/* 按住画面右半边临时两倍速：坐标、触发条件，以及松手回到原来的倍速。 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  HOLD_DELAY_MS, HOLD_MOVE_PX, HOLD_PLAYBACK_RATE, attachHoldSpeed, canArmHold, videoAlong,
} from '../src/player/hold-speed';
import type { VjsPlayer } from '../src/player/types';

afterEach(() => { document.body.replaceChildren(); document.documentElement.removeAttribute('data-peach-ios'); vi.useRealTimers() });

const wide = { left: 0, top: 0, width: 800, height: 450 };
const tall = { left: 8, top: 0, width: 18, height: 800 };

describe('画面右半边', () => {
  it('未旋转时用水平位置', () => {
    expect(videoAlong({ clientX: 100, clientY: 10 }, wide, false)).toBeCloseTo(0.125);
    expect(videoAlong({ clientX: 600, clientY: 10 }, wide, false)).toBeCloseTo(0.75);
  });

  it('竖屏旋转后，画面右侧在屏幕下半边', () => {
    expect(videoAlong({ clientX: 20, clientY: 100 }, tall, true)).toBeCloseTo(0.125);
    expect(videoAlong({ clientX: 20, clientY: 600 }, tall, true)).toBeCloseTo(0.75);
  });

  it('旋转标记在、包围盒仍是横条时仍按水平位置', () => {
    expect(videoAlong({ clientX: 600, clientY: 10 }, wide, true)).toBeCloseTo(0.75);
  });
});

describe('长按是否开始计时', () => {
  it('正在播放的触摸落在右半边才计时', () => {
    expect(canArmHold({ pointerType: 'touch', playing: true, seeking: false, along: 0.8 })).toBe(true);
    expect(canArmHold({ pointerType: 'pen', playing: true, seeking: false, along: 0.5 })).toBe(true);
    expect(canArmHold({ pointerType: 'mouse', playing: true, seeking: false, along: 0.9 })).toBe(false);
    expect(canArmHold({ pointerType: 'touch', playing: false, seeking: false, along: 0.9 })).toBe(false);
    expect(canArmHold({ pointerType: 'touch', playing: true, seeking: true, along: 0.9 })).toBe(false);
    expect(canArmHold({ pointerType: 'touch', playing: true, seeking: false, along: 0.2 })).toBe(false);
  });
});

describe('按住与松手', () => {
  function mounted() {
    const video = document.createElement('video');
    const root = document.createElement('div');
    root.className = 'video-js';
    root.append(video);
    document.body.append(root);
    video.getBoundingClientRect = () => ({ ...wide, right: 800, bottom: 450, x: 0, y: 0, toJSON() { return {} } }) as DOMRect;
    let rate = 1.25;
    let paused = false;
    const player = {
      el: () => root,
      paused: () => paused,
      playbackRate: (value?: number) => { if (value === undefined) return rate; rate = value },
    } as VjsPlayer;
    const release = attachHoldSpeed(player);
    const press = (clientX: number, clientY = 40) => video.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, button: 0, pointerId: 3, pointerType: 'touch', clientX, clientY,
    }));
    return { video, root, press, release, rate: () => rate, pause: () => { paused = true; video.dispatchEvent(new Event('pause')) } };
  }

  it('按住右半边超过阈值后显示 2x，松手回到原来的倍速', () => {
    vi.useFakeTimers();
    const view = mounted();
    view.press(700);
    expect(view.rate()).toBe(1.25);
    expect(view.root.querySelector('[data-peach-hold-speed]')?.hasAttribute('hidden')).toBe(true);
    vi.advanceTimersByTime(HOLD_DELAY_MS);
    expect(view.rate()).toBe(HOLD_PLAYBACK_RATE);
    expect(view.root.querySelector('[data-peach-hold-speed]')?.textContent).toBe('2x');
    expect(view.root.querySelector('[data-peach-hold-speed]')?.hasAttribute('hidden')).toBe(false);
    view.video.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 3, pointerType: 'touch' }));
    expect(view.rate()).toBe(1.25);
    expect(view.root.querySelector('[data-peach-hold-speed]')?.hasAttribute('hidden')).toBe(true);
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    view.video.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    view.release();
  });

  it('手指滑开或落在左半边都不会加速', () => {
    vi.useFakeTimers();
    const view = mounted();
    view.press(100);
    vi.advanceTimersByTime(HOLD_DELAY_MS);
    expect(view.rate()).toBe(1.25);
    view.press(700);
    view.video.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true, pointerId: 3, pointerType: 'touch', clientX: 700 + HOLD_MOVE_PX + 2, clientY: 40,
    }));
    vi.advanceTimersByTime(HOLD_DELAY_MS);
    expect(view.rate()).toBe(1.25);
    view.release();
  });

  it('鼠标按下不改变倍速', () => {
    vi.useFakeTimers();
    const view = mounted();
    view.video.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, button: 0, pointerId: 4, pointerType: 'mouse', clientX: 700, clientY: 40,
    }));
    vi.advanceTimersByTime(HOLD_DELAY_MS);
    expect(view.rate()).toBe(1.25);
    view.release();
  });
});
