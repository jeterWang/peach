/* iPhone 页内全屏：桌面和宽屏不拦截，窄触屏的 iPhone 铺满视口。 */
import { describe, expect, it } from 'vitest';

import { fullWindowRotation, planFullWindow, prefersFullWindow, setFullWindow } from '../src/player/phone-fullscreen';

const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

describe('页内全屏计划', () => {
  it('桌面、Android 和宽屏交给原来的全屏按钮', () => {
    expect(prefersFullWindow(false, iphone)).toBe(false);
    expect(prefersFullWindow(true, 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile')).toBe(false);
    expect(prefersFullWindow(true, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15')).toBe(false);
    expect(planFullWindow({ fullWindow: false, active: false })).toBe('delegate');
    expect(planFullWindow({ fullWindow: false, active: true })).toBe('delegate');
  });

  it('窄触屏的 iPhone 进入或退出页内全屏', () => {
    expect(prefersFullWindow(true, iphone)).toBe(true);
    expect(prefersFullWindow(true, 'Mozilla/5.0 (iPod touch; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15')).toBe(true);
    expect(planFullWindow({ fullWindow: true, active: false })).toBe('enter');
    expect(planFullWindow({ fullWindow: true, active: true })).toBe('exit');
  });
});

describe('竖屏页内全屏的画面方向', () => {
  it('横屏和未知尺寸转 90°，竖屏片源不转', () => {
    expect(fullWindowRotation(true, true, 1920, 1080)).toBe('90');
    expect(fullWindowRotation(true, true, 0, 0)).toBe('90');
    expect(fullWindowRotation(true, true, 1080, 1920)).toBe('');
    expect(fullWindowRotation(true, false, 1920, 1080)).toBe('');
    expect(fullWindowRotation(false, true, 1920, 1080)).toBe('');
  });
});

describe('页内全屏状态', () => {
  it('打开时锁住页面滚动，关掉时撤掉', () => {
    document.body.innerHTML = '<div class="video-js"></div>';
    const root = document.querySelector<HTMLElement>('.video-js')!;
    setFullWindow(root, true);
    expect(root.hasAttribute('data-peach-fullwindow')).toBe(true);
    expect(document.documentElement.hasAttribute('data-peach-fullwindow')).toBe(true);
    expect(document.body.classList.contains('vjs-full-window')).toBe(true);
    setFullWindow(root, false);
    expect(root.hasAttribute('data-peach-fullwindow')).toBe(false);
    expect(document.documentElement.hasAttribute('data-peach-fullwindow')).toBe(false);
    expect(document.body.classList.contains('vjs-full-window')).toBe(false);
  });
});
