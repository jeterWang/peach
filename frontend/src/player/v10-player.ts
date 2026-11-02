/* Peach 播放会话：Video.js 10 的媒体、原生事件与自有控制条共用同一枚 video。 */
import { randomId } from '../core/random-id';
import type { PlayerEvents, PlayerSource, QualityLevelList, VideojsFactory, VjsPlayer } from './types';

interface HlsEngine {
  bandwidthEstimate: number;
  currentLevel: number;
  levels: { width?: number; height?: number }[];
  on(event: string, callback: () => void): void;
}
interface MediaElement extends HTMLElement {
  source: PlayerSource | null;
  engine?: HlsEngine | null;
  error?: unknown;
  adapter: { destroy(): void };
}

const tags = (events: PlayerEvents): string[] => typeof events === 'string' ? [events] : events;

/** 控件由 Video.js 10 自定义元素处理；Peach 管片源、时长口径和会话释放。 */
export const createV10Player: VideojsFactory = (video, options) => {
  const root = document.createElement('div');
  const provider = document.createElement('video-player');
  root.className = 'video-js vjs-paused vjs-user-active';
  root.id = video.id || `peach-player-${randomId()}`;
  root.setAttribute('lang', 'zh-CN');
  const container = document.createElement('media-container');
  let media = document.createElement('hlsjs-video') as MediaElement;
  const parent = video.parentNode;
  parent?.replaceChild(root, video);
  video.removeAttribute('id'); video.className = 'vjs-tech'; video.slot = 'media';
  video.controls = false; video.preload = options.preload === 'auto' ? 'auto' : options.preload === 'none' ? 'none' : 'metadata';
  if (options.poster) video.poster = String(options.poster);
  media.append(video); container.append(media); provider.append(container); root.append(provider);
  if (options.controls !== false) {
    container.insertAdjacentHTML('beforeend', `<div class="vjs-loading-spinner" aria-label="正在缓冲"></div>
      <div class="vjs-error-display"><div class="vjs-modal-dialog-content" role="alert"></div></div>
      <div class="vjs-control-bar">
        <media-play-button class="vjs-play-control vjs-control vjs-button" label="播放"></media-play-button>
        <div class="vjs-volume-panel vjs-control vjs-volume-panel-horizontal">
          <media-mute-button class="vjs-mute-control vjs-control vjs-button" label="静音"></media-mute-button>
          <div class="vjs-volume-control vjs-volume-horizontal"><media-volume-slider class="vjs-volume-bar vjs-slider vjs-slider-horizontal" label="音量">
            <media-slider-track><media-slider-fill class="vjs-volume-level"></media-slider-fill></media-slider-track>
            <media-slider-thumb class="vjs-volume-thumb"></media-slider-thumb>
            <media-slider-value class="vjs-volume-tooltip"></media-slider-value>
          </media-volume-slider></div>
        </div>
        <div class="vjs-progress-control vjs-control"><media-time-slider class="vjs-progress-holder vjs-slider vjs-slider-horizontal" label="播放进度">
          <media-slider-track><media-slider-buffer class="vjs-load-progress"></media-slider-buffer><media-slider-fill class="vjs-play-progress"></media-slider-fill></media-slider-track>
          <media-slider-thumb class="vjs-progress-thumb"></media-slider-thumb>
        </media-time-slider></div>
        <div class="vjs-subtitles-control vjs-control"><button type="button" class="vjs-button" aria-label="开启字幕" aria-pressed="false">CC</button></div>
        <media-pip-button class="vjs-picture-in-picture-control vjs-control vjs-button" label="画中画"></media-pip-button>
        <media-fullscreen-button class="vjs-fullscreen-control vjs-control vjs-button" label="全屏"></media-fullscreen-button>
      </div>`);
  }
  const events = new EventTarget();
  const cleanup = new AbortController();
  const signal = cleanup.signal;
  let disposed = false, sourceGeneration = 0, playGeneration = 0, expectedDuration = 0, source: PlayerSource = { src: '', type: '' }, failure: unknown = null;
  let idle: ReturnType<typeof setTimeout> | undefined;
  const active = () => {
    root.classList.add('vjs-user-active'); root.classList.remove('vjs-user-inactive');
    if (idle) clearTimeout(idle);
    if (!video.paused) idle = setTimeout(() => {
      if (root.matches(':focus-within,:hover') && root.querySelector('[aria-expanded="true"]')) return;
      root.classList.remove('vjs-user-active'); root.classList.add('vjs-user-inactive');
    }, 2500);
  };
  root.addEventListener('pointermove', active, { signal });
  root.addEventListener('focusin', active, { signal });
  video.addEventListener('click', () => { if (video.paused) void video.play().catch(() => {}); else video.pause() }, { signal });
  video.addEventListener('dblclick', () => root.querySelector<HTMLElement>('media-fullscreen-button')?.click(), { signal });
  const update = () => {
    root.classList.toggle('vjs-paused', video.paused); root.classList.toggle('vjs-playing', !video.paused);
    root.classList.toggle('vjs-ended', video.ended); root.classList.toggle('vjs-has-started', video.currentTime > 0 || !video.paused);
    active();
  };
  const emit = (name: string) => events.dispatchEvent(new Event(name));
  /* Safari 在缓冲已经够播、甚至进度还在走时也会派发 waiting / stalled，而且往往不再补一次 playing。
   * 进度在走、readyState 已经能续播、或刚刚开始播放时撤掉转圈。真正停住且数据不够时，
   * 先等一小段，避免一次空转把转圈留在画面正中。 */
  const HAVE_FUTURE_DATA = 3;
  const SPINNER_DELAY_MS = 400;
  let seenTime = 0;
  let stallTimer: ReturnType<typeof setTimeout> | undefined;
  const clearStall = () => { if (stallTimer) { clearTimeout(stallTimer); stallTimer = undefined } };
  const hideWaiting = () => { clearStall(); root.classList.remove('vjs-waiting') };
  const armStall = () => {
    if (root.classList.contains('vjs-waiting') || stallTimer) return;
    stallTimer = setTimeout(() => {
      stallTimer = undefined;
      if (video.paused || video.ended || video.seeking || video.readyState >= HAVE_FUTURE_DATA) return;
      root.classList.add('vjs-waiting');
    }, SPINNER_DELAY_MS);
  };
  const syncWaiting = (name: string) => {
    if (video.paused || video.ended) { hideWaiting(); return }
    const time = Number(video.currentTime) || 0;
    const advanced = name === 'timeupdate' && time > seenTime + 0.04;
    if (name === 'timeupdate') seenTime = time;
    if (video.seeking || name === 'seeking') { clearStall(); root.classList.add('vjs-waiting'); return }
    if (advanced || video.readyState >= HAVE_FUTURE_DATA || name === 'playing' || name === 'canplay' || name === 'seeked') {
      hideWaiting(); return;
    }
    if (name === 'waiting' || name === 'stalled' || name === 'timeupdate') armStall();
  };
  for (const name of ['play', 'pause', 'ended', 'loadedmetadata', 'durationchange', 'timeupdate', 'progress', 'loadstart', 'waiting', 'stalled', 'canplay', 'playing', 'seeking', 'seeked', 'ratechange', 'volumechange', 'resize', 'enterpictureinpicture', 'leavepictureinpicture']) {
    video.addEventListener(name, () => {
      if (['play', 'pause', 'ended', 'loadedmetadata'].includes(name)) update();
      syncWaiting(name);
      emit(name);
    }, { signal });
  }
  const showError = (value: unknown, notify = true) => {
    failure = value; root.classList.add('vjs-error');
    const message = root.querySelector('.vjs-modal-dialog-content');
    if (message) message.textContent = (value as { message?: string })?.message || '视频暂时无法播放';
    if (notify) emit('error');
  };
  media.addEventListener('error', () => showError(media.error || video.error), { signal });
  document.addEventListener('fullscreenchange', () => {
    root.classList.toggle('vjs-fullscreen', !!document.fullscreenElement && root.contains(document.fullscreenElement));
    emit('fullscreenchange');
  }, { signal });
  const levels = [] as unknown as QualityLevelList;
  const boundEngines = new WeakSet<HlsEngine>();
  let enabledLevels: boolean[] = [], selectionQueued = false;
  const syncLevels = () => {
    const engine = media.engine;
    if (!engine || !Array.isArray(engine.levels)) return;
    if (enabledLevels.length !== engine.levels.length) enabledLevels = engine.levels.map(() => true);
    for (let index = 0; index < engine.levels.length; index++) {
      const level = engine.levels[index]!;
      levels[index] = { ...level, get enabled() { return enabledLevels[index] ?? true },
        set enabled(value: boolean) {
          enabledLevels[index] = value;
          if (selectionQueued) return;
          selectionQueued = true;
          const generation = sourceGeneration;
          queueMicrotask(() => {
            if (disposed || media.engine !== engine || generation !== sourceGeneration) return;
            selectionQueued = false;
            const selected = enabledLevels.flatMap((enabled, at) => enabled ? [at] : []);
            engine.currentLevel = selected.length === 1 ? selected[0]! : -1;
          });
        } };
    }
    levels.length = engine.levels.length;
    levels.selectedIndex = engine.currentLevel;
    emit('qualitychange');
  };
  levels.on = (_names, callback) => events.addEventListener('qualitychange', callback, { signal });
  const attachEngine = () => {
    const engine = media.engine;
    if (engine && Array.isArray(engine.levels) && !boundEngines.has(engine)) {
      boundEngines.add(engine);
      engine.on('hlsManifestParsed', syncLevels); engine.on('hlsLevelSwitched', syncLevels);
    }
    syncLevels();
  };
  video.addEventListener('loadedmetadata', attachEngine, { signal });
  const player = {
    on: (names, handler) => tags(names).forEach(name => events.addEventListener(name, handler as EventListener, { signal })),
    off: (names, handler) => tags(names).forEach(name => events.removeEventListener(name, handler as EventListener)),
    one: (names, handler) => tags(names).forEach(name => events.addEventListener(name, handler as EventListener, { once: true, signal })),
    ready: (handler) => queueMicrotask(() => { if (!disposed) handler() }),
    el: () => root,
    isDisposed: () => disposed,
    dispose: () => {
      if (disposed) return;
      emit('dispose'); disposed = true; cleanup.abort(); if (idle) clearTimeout(idle); clearStall();
      media.adapter.destroy(); video.pause(); video.removeAttribute('src'); video.load(); root.remove();
    },
    trigger: emit,
    paused: () => video.paused, ended: () => video.ended,
    error: (value?: { code: number; message: string }) => value ? showError(value, false) : failure || video.error,
    play: async () => {
      const generation = ++playGeneration;
      // 官方 HLS adapter 在微任务里挂载片源；原生 play 必须使用已经挂载的片源。
      await Promise.resolve();
      if (disposed || generation !== playGeneration) throw new DOMException('播放请求已取消', 'AbortError');
      return video.play();
    },
    pause: () => { playGeneration++; video.pause() },
    currentTime: (value?: number) => value === undefined ? video.currentTime : (video.currentTime = value),
    duration: (value?: number) => value === undefined ? expectedDuration || video.duration : (expectedDuration = value),
    playbackRate: (value?: number) => value === undefined ? video.playbackRate : (video.playbackRate = value),
    loop: (value?: boolean) => value === undefined ? video.loop : (video.loop = value),
    muted: () => video.muted, volume: () => video.volume,
    isFullscreen: () => !!document.fullscreenElement && root.contains(document.fullscreenElement),
    poster: (url: string) => { video.poster = url },
    src: (next: PlayerSource) => {
      source = next; failure = null; root.classList.remove('vjs-error');
      sourceGeneration++; playGeneration++; selectionQueued = false; enabledLevels = []; levels.length = 0;
      const tag = next.type.toLowerCase().includes('dash') ? 'dash-video' : 'hlsjs-video';
      if (media.localName !== tag) {
        const previous = media;
        media = document.createElement(tag) as MediaElement;
        previous.replaceWith(media); media.append(video); previous.adapter.destroy();
        media.addEventListener('error', () => showError(media.error || video.error), { signal });
        enabledLevels = []; levels.length = 0;
      }
      media.source = { ...next, src: new URL(next.src, location.href).href };
      attachEngine();
    },
    currentSrc: () => source.src, currentSource: () => source,
    qualityLevels: () => levels,
    bandwidth: () => media.engine?.bandwidthEstimate || 0,
    addRemoteTextTrack: (track: Record<string, unknown>) => {
      const node = document.createElement('track');
      node.id = String(track.id || '');
      if (track.legacyId) node.dataset.subtitleAlias = String(track.legacyId);
      node.kind = String(track.kind || 'subtitles'); node.src = String(track.src || '');
      node.srclang = String(track.srclang || ''); node.label = String(track.label || ''); video.append(node);
    },
  } satisfies VjsPlayer;
  return player;
};
