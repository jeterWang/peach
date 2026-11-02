import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createV10Player } from '../src/player/v10-player';

const engine = () => ({ bandwidthEstimate: 8000000, currentLevel: -1,
  levels: [{ width: 1280, height: 720 }, { width: 1920, height: 1080 }], on: vi.fn() });

class TestMedia extends HTMLElement {
  source: unknown = null;
  engine = engine();
  adapter = { destroy: vi.fn() };
}
beforeAll(() => {
  if (!customElements.get('hlsjs-video')) customElements.define('hlsjs-video', TestMedia);
  if (!customElements.get('dash-video')) customElements.define('dash-video', class extends TestMedia {});
});
afterEach(() => { document.body.replaceChildren(); vi.restoreAllMocks(); vi.unstubAllGlobals() });

function mounted(controls = false) {
  const video = document.createElement('video'); document.body.append(video);
  const player = createV10Player(video, { controls });
  const media = player.el().querySelector('hlsjs-video') as TestMedia;
  return { video, player, media };
}

describe('Video.js 10 播放会话', () => {
  it('普通 HTTP 的随机源为无 ID 的视频创建独立播放器', () => {
    vi.stubGlobal('crypto', { getRandomValues: crypto.getRandomValues.bind(crypto) });
    const first = mounted().player;
    const second = mounted().player;
    try {
      expect(first.el().id).toMatch(/^peach-player-/);
      expect(first.el().id).not.toBe(second.el().id);
    } finally { first.dispose(); second.dispose() }
  });

  it('片源交给异步 adapter 后立即播放，原生 play 使用已挂载的片源', async () => {
    const { video, player, media } = mounted();
    Object.defineProperty(media, 'source', { set: (value: { src: string }) => {
      queueMicrotask(() => { video.src = value.src });
    } });
    const play = vi.spyOn(video, 'play').mockImplementation(() => video.getAttribute('src')
      ? Promise.resolve() : Promise.reject(new DOMException('没有可播放的片源', 'NotSupportedError')));
    player.src({ src: '/example.mp4', type: 'video/mp4' });
    await expect(player.play()).resolves.toBeUndefined();
    expect(play).toHaveBeenCalledOnce();
    expect(video.src).toContain('/example.mp4');
    player.dispose();
  });

  it.each(['pause', 'source', 'dispose'] as const)('排队播放期间 %s 会取消该请求', async action => {
    const { video, player } = mounted();
    const play = vi.spyOn(video, 'play').mockResolvedValue(undefined);
    const pending = player.play();
    if (action === 'pause') player.pause();
    else if (action === 'source') player.src({ src: '/next.mp4', type: 'video/mp4' });
    else player.dispose();
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    expect(play).not.toHaveBeenCalled();
    player.dispose();
  });

  it('媒体错误可补充来源状态文案，展示错误不会再次触发错误处理', () => {
    const { player, media } = mounted();
    const callback = vi.fn(() => player.error({ code: 2, message: '媒体目录无法访问' }));
    player.on('error', callback);
    media.dispatchEvent(new Event('error'));
    expect(callback).toHaveBeenCalledOnce();
    expect(player.error()).toEqual({ code: 2, message: '媒体目录无法访问' });
    player.dispose();
  });

  it('固定清晰度和自动码率使用同一条 HLS 引擎，带宽读取实际估计', async () => {
    const { player, media } = mounted();
    player.src({ src: '/example.m3u8', type: 'application/vnd.apple.mpegurl' });
    const levels = player.qualityLevels!();
    expect(levels.length).toBe(2);
    videoMetadata(player.el()); videoMetadata(player.el());
    expect(media.engine.on).toHaveBeenCalledTimes(2);
    levels[0]!.enabled = false; levels[1]!.enabled = true;
    await Promise.resolve(); expect(media.engine.currentLevel).toBe(1);
    levels[0]!.enabled = true; levels[1]!.enabled = true;
    await Promise.resolve(); expect(media.engine.currentLevel).toBe(-1);
    expect(player.bandwidth!()).toBe(8000000);
    player.dispose();
  });

  it('清晰度选择排队后切换片源或销毁，不再写入旧引擎', async () => {
    const { player, media } = mounted();
    player.src({ src: '/first.m3u8', type: 'application/vnd.apple.mpegurl' });
    const levels = player.qualityLevels!();
    levels[0]!.enabled = false; levels[1]!.enabled = true;
    player.src({ src: '/second.m3u8', type: 'application/vnd.apple.mpegurl' });
    await Promise.resolve(); expect(media.engine.currentLevel).toBe(-1);
    levels[0]!.enabled = false; levels[1]!.enabled = true;
    player.dispose();
    await Promise.resolve(); expect(media.engine.currentLevel).toBe(-1);
  });

  it('HLS 与 DASH 切源保留原生视频和字幕，销毁停播并解除事件', () => {
    const { video, player, media } = mounted();
    const pause = vi.spyOn(video, 'pause').mockImplementation(() => {});
    const load = vi.spyOn(video, 'load').mockImplementation(() => {});
    const played = vi.fn(); player.on('play', played);
    video.dispatchEvent(new Event('play')); expect(played).toHaveBeenCalledOnce();
    const track = document.createElement('track'); track.label = '中文'; video.append(track);
    player.src({ src: '/example.mpd', type: 'application/dash+xml' });
    expect(media.adapter.destroy).toHaveBeenCalledOnce();
    expect(player.el().querySelector('dash-video > video')).toBe(video);
    expect(video.querySelector('track')).toBe(track);
    player.dispose(); player.dispose();
    expect(pause).toHaveBeenCalledOnce(); expect(load).toHaveBeenCalledOnce();
    video.dispatchEvent(new Event('play')); expect(played).toHaveBeenCalledOnce();
    expect(document.querySelector('.video-js')).toBeNull();
  });
});

function videoMetadata(root: HTMLElement) { root.querySelector('video')!.dispatchEvent(new Event('loadedmetadata')) }

function playback(video: HTMLVideoElement, initial: { paused: boolean; readyState: number; currentTime: number; seeking?: boolean; ended?: boolean }) {
  const state = { seeking: false, ended: false, ...initial };
  for (const key of ['paused', 'readyState', 'currentTime', 'seeking', 'ended'] as const) {
    Object.defineProperty(video, key, { configurable: true, get: () => state[key] });
  }
  return { set: (next: Partial<typeof state>) => Object.assign(state, next) };
}

describe('播放中的中央转圈', () => {
  it('缓冲已经够播时，waiting 和 stalled 不把转圈留在画面正中', () => {
    vi.useFakeTimers();
    try {
      const { video, player } = mounted(true);
      playback(video, { paused: false, readyState: 4, currentTime: 2 });
      video.dispatchEvent(new Event('playing'));
      video.dispatchEvent(new Event('stalled'));
      video.dispatchEvent(new Event('waiting'));
      vi.advanceTimersByTime(1000);
      expect(player.el().classList.contains('vjs-waiting')).toBe(false);
      player.dispose();
    } finally { vi.useRealTimers() }
  });

  it('进度还在走时撤掉转圈；停住且数据不够才显示', () => {
    vi.useFakeTimers();
    try {
      const { video, player } = mounted(true);
      const media = playback(video, { paused: false, readyState: 1, currentTime: 1 });
      video.dispatchEvent(new Event('timeupdate'));
      video.dispatchEvent(new Event('waiting'));
      vi.advanceTimersByTime(200);
      expect(player.el().classList.contains('vjs-waiting')).toBe(false);
      media.set({ currentTime: 1.4 });
      video.dispatchEvent(new Event('timeupdate'));
      vi.advanceTimersByTime(500);
      expect(player.el().classList.contains('vjs-waiting')).toBe(false);
      video.dispatchEvent(new Event('waiting'));
      vi.advanceTimersByTime(500);
      expect(player.el().classList.contains('vjs-waiting')).toBe(true);
      media.set({ readyState: 4, currentTime: 2 });
      video.dispatchEvent(new Event('timeupdate'));
      expect(player.el().classList.contains('vjs-waiting')).toBe(false);
      player.dispose();
    } finally { vi.useRealTimers() }
  });

  it('拖动进度立刻显示转圈，seeked 后撤掉', () => {
    const { video, player } = mounted(true);
    const media = playback(video, { paused: false, readyState: 4, currentTime: 3, seeking: true });
    video.dispatchEvent(new Event('seeking'));
    expect(player.el().classList.contains('vjs-waiting')).toBe(true);
    media.set({ seeking: false, currentTime: 8 });
    video.dispatchEvent(new Event('seeked'));
    expect(player.el().classList.contains('vjs-waiting')).toBe(false);
    player.dispose();
  });
});
