/* iPhone 页内全屏：桌面和宽屏不拦截，窄触屏的 iPhone 铺满视口。 */
import { describe, expect, it } from 'vitest';

import {
  attachRotatedSeek, fullWindowRotation, needsRotatedSeekMap, planFullWindow, prefersFullWindow,
  rotatedSeekClientPoint, setFullWindow,
} from '../src/player/phone-fullscreen';

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

describe('旋转后的进度条坐标', () => {
  const box = { left: 12, top: 40, width: 18, height: 800 };
  const videoJsPercent = (clientX: number) => (clientX - box.left) / box.width;

  it('手指沿竖直长边移动时，写回的 clientX 让水平公式读到同一比例', () => {
    for (const along of [0, 0.25, 0.5, 1]) {
      const mapped = rotatedSeekClientPoint({ clientX: 30, clientY: box.top + along * box.height }, box);
      expect(videoJsPercent(mapped.clientX)).toBeCloseTo(along);
      expect(mapped.clientY).toBe(box.top + box.height / 2);
    }
  });

  it('长边以外的点夹在片头和片尾', () => {
    expect(videoJsPercent(rotatedSeekClientPoint({ clientX: 0, clientY: 0 }, box).clientX)).toBe(0);
    expect(videoJsPercent(rotatedSeekClientPoint({ clientX: 0, clientY: 900 }, box).clientX)).toBe(1);
  });

  it('只在 iOS 竖屏旋转且包围盒已经竖过来时改坐标', () => {
    expect(needsRotatedSeekMap(true, '90', box)).toBe(true);
    expect(needsRotatedSeekMap(false, '90', box)).toBe(false);
    expect(needsRotatedSeekMap(true, null, box)).toBe(false);
    expect(needsRotatedSeekMap(true, '90', { left: 0, top: 0, width: 800, height: 18 })).toBe(false);
  });

  it('捕获阶段把竖直拖动写成 Video.js 要的水平坐标，横条不改', () => {
    document.documentElement.setAttribute('data-peach-ios', '');
    document.body.innerHTML = '<div class="video-js" data-peach-rotate="90"><media-time-slider><span></span></media-time-slider></div>';
    const root = document.querySelector<HTMLElement>('.video-js')!;
    const slider = root.querySelector('media-time-slider')!;
    const thumb = slider.querySelector('span')!;
    slider.getBoundingClientRect = () => ({ ...box, right: box.left + box.width, bottom: box.top + box.height, x: box.left, y: box.top, toJSON() { return {} } }) as DOMRect;
    const seen: number[] = [];
    slider.addEventListener('pointerdown', (event) => seen.push((event as PointerEvent).clientX));
    const release = attachRotatedSeek(root);
    thumb.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 40, clientY: box.top + box.height / 2, pointerId: 1 }));
    expect(seen).toHaveLength(1);
    expect(videoJsPercent(seen[0]!)).toBeCloseTo(0.5);
    root.removeAttribute('data-peach-rotate');
    thumb.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 40, clientY: box.top, pointerId: 2 }));
    expect(seen[1]).toBe(40);
    release();
    document.documentElement.removeAttribute('data-peach-ios');
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
