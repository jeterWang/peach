/* 每部视频的字幕会话；详情、小窗和沉浸播放共享服务端记忆。 */
import type { VjsPlayer } from './types';
import { playerMemory } from './memory';

interface SavedTrack { key: string; name: string; text: string }

/** 简体优先，其次未分简繁的中文，再次繁体。 */
export function preferredChineseTrack(tracks: TextTrack[]): TextTrack | null {
  const rank = (track: TextTrack) => {
    const language = (track.language || '').toLowerCase();
    const label = track.label || '';
    if (language === 'zh-hans' || language === 'zh-cn' || label.includes('简体')) return 3;
    if (language === 'zh' || language === 'chi' || language === 'zho' || label.includes('中文')) return 2;
    if (language.startsWith('zh') || label.includes('繁')) return 1;
    return 0;
  };
  return tracks.filter(track => rank(track) > 0).sort((left, right) => rank(right) - rank(left))[0] ?? null;
}

export class SubtitleSession {
  private cleanup = new AbortController();
  private imported = new Map<string, { node: HTMLTrackElement; url: string }>();
  private selected: string | null | undefined;
  private memory;
  readonly ready: Promise<void>;
  error = '';

  constructor(private player: VjsPlayer, private video: HTMLVideoElement, private changed = () => {}) {
    this.memory = playerMemory(player);
    const signal = this.cleanup.signal;
    video.textTracks.addEventListener('addtrack', () => { this.apply(); this.changed() }, { signal });
    video.addEventListener('loadedmetadata', () => this.apply(), { signal });
    player.on('dispose', () => {
      this.cleanup.abort();
      this.imported.forEach(({ url }) => URL.revokeObjectURL(url)); this.imported.clear();
    });
    this.ready = this.restore();
  }
  tracks() { return [...this.video.textTracks].filter(track => ['subtitles', 'captions'].includes(track.kind)) }
  has(key: string) { return this.imported.has(key) }
  private key(track: TextTrack) {
    return /^(sidecar|file|subtitlecat):/.test(track.id) ? track.id
      : `native:${track.kind}:${track.language}:${track.id || track.label}`;
  }
  selectImported(key: string) { this.select(this.imported.get(key)!.node.track) }
  select(track: TextTrack | null) {
    this.preferChinese = false;
    this.selected = track ? this.key(track) : null;
    this.apply(); this.changed();
    void this.save({ selected: this.selected }).catch(error => this.failed(error));
  }
  private preferChinese = false;
  private apply() {
    if (this.preferChinese && this.selected === undefined) {
      const pick = preferredChineseTrack(this.tracks());
      if (!pick) return;
      this.tracks().forEach(track => {
        const mode = track === pick ? 'showing' : 'disabled';
        if (track.mode !== mode) track.mode = mode;
      });
      return;
    }
    if (this.selected === undefined) return;
    const aliases = [...this.video.querySelectorAll<HTMLTrackElement>('track[data-subtitle-alias]')];
    const selected = this.tracks().find(track => this.key(track) === this.selected
      || aliases.some(node => node.track === track && node.dataset.subtitleAlias === this.selected));
    this.tracks().forEach(track => {
      const mode = track === selected ? 'showing' : 'disabled';
      if (track.mode !== mode) track.mode = mode;
    });
  }
  private failed(error: unknown) {
    if (this.cleanup.signal.aborted) return;
    this.error = error instanceof Error ? error.message : '字幕记忆未保存，请重试';
    this.changed();
  }
  private save(value: { selected: string | null; track?: SavedTrack }) {
    return this.memory.save({ ...value, subtitle_chosen: true }).then(() => {
      const hadError = !!this.error;
      this.error = ''; if (hadError && !this.cleanup.signal.aborted) this.changed();
    });
  }
  private async restore() {
    const signal = this.cleanup.signal;
    try {
      const saved = await this.memory.load();
      if (signal.aborted) return;
      if (this.selected === undefined) {
        const chosen = saved.subtitle_chosen ?? !!saved.selected;
        if (chosen) this.selected = saved.selected;
        else this.preferChinese = true;
      }
      this.apply();
      let failure: unknown;
      for (const track of saved.tracks) {
        if (signal.aborted) return;
        try {
          if (this.has(track.key)) continue;
          const response = await fetch(track.src, { signal });
          if (!response.ok) throw new Error(`字幕未恢复：${track.name}`);
          await this.attach(await response.text(), track.name, track.key, signal);
        } catch (error) { failure = error }
      }
      if (signal.aborted) return;
      if (failure) throw failure;
      this.error = ''; this.apply(); this.changed();
    } catch (error) { if (!signal.aborted) this.failed(error) }
  }
  async retry() {
    await this.restore();
    if (!this.error && this.selected !== undefined) {
      await this.save({ selected: this.selected }).catch(error => this.failed(error));
    }
    this.changed();
  }
  async import(text: string, name: string, key: string, signal: AbortSignal) {
    await this.ready;
    if (signal.aborted) return;
    await this.save({ selected: key, track: { key, name, text } });
    if (signal.aborted) return;
    await this.attach(text, name, key, signal);
    this.selectImported(key);
  }
  private async attach(text: string, name: string, key: string, signal: AbortSignal) {
    if (this.imported.has(key)) return;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/vtt' }));
    const node = document.createElement('track'); node.id = key; node.kind = 'subtitles'; node.label = name; node.src = url;
    try {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => finish(new Error('字幕加载超时，请重试')), 15_000);
        const finish = (error?: Error) => {
          clearTimeout(timer); node.removeEventListener('load', loaded); node.removeEventListener('error', failed); signal.removeEventListener('abort', aborted);
          if (error) reject(error); else resolve();
        };
        const loaded = () => finish(), failed = () => finish(new Error(`字幕时间轴无法读取：${name}`));
        const aborted = () => finish(new DOMException('字幕加载已取消', 'AbortError'));
        node.addEventListener('load', loaded); node.addEventListener('error', failed); signal.addEventListener('abort', aborted, { once: true });
        if (signal.aborted) { aborted(); return }
        this.video.append(node); node.track.mode = 'hidden';
      });
      if (signal.aborted || this.player.isDisposed()) throw new DOMException('字幕加载已取消', 'AbortError');
      this.imported.set(key, { node, url }); this.apply(); this.changed();
    } catch (error) { node.remove(); URL.revokeObjectURL(url); throw error }
  }
}
