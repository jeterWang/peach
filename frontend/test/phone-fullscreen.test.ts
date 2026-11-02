/* 竖屏手机的全屏补路：桌面和已经进入元素全屏时不拦截。 */
import { describe, expect, it } from 'vitest';

import {
  enterWebkitVideoFullscreen, exitWebkitVideoFullscreen, planPhoneFullscreen, type WebkitFullscreenVideo,
} from '../src/player/phone-fullscreen';

const base = { portrait: true, webkit: true, elementFullscreen: true, elementActive: false, webkitActive: false };

describe('竖屏全屏计划', () => {
  it('宽屏或没有视频 webkit 全屏时交给原来的按钮', () => {
    expect(planPhoneFullscreen({ ...base, portrait: false })).toBe('delegate');
    expect(planPhoneFullscreen({ ...base, webkit: false })).toBe('delegate');
  });

  it('元素全屏已经打开时仍交给原来的按钮退出', () => {
    expect(planPhoneFullscreen({ ...base, elementActive: true, webkitActive: true })).toBe('delegate');
  });

  it('系统全屏打开时走 webkit 退出', () => {
    expect(planPhoneFullscreen({ ...base, webkitActive: true })).toBe('webkit-exit');
  });

  it('元素全屏可用时先试元素全屏，否则直接进系统全屏', () => {
    expect(planPhoneFullscreen(base)).toBe('element-then-webkit');
    expect(planPhoneFullscreen({ ...base, elementFullscreen: false })).toBe('webkit-enter');
  });
});

describe('视频 webkit 全屏', () => {
  it('优先用 presentation mode，退出时回到 inline', () => {
    const calls: string[] = [];
    const video: WebkitFullscreenVideo = {
      webkitPresentationMode: 'inline',
      webkitSetPresentationMode: (mode) => { calls.push(mode); video.webkitPresentationMode = mode },
      webkitEnterFullscreen: () => { calls.push('enter') },
    };
    expect(enterWebkitVideoFullscreen(video)).toBe(true);
    expect(calls).toEqual(['fullscreen']);
    expect(exitWebkitVideoFullscreen(video)).toBe(true);
    expect(calls).toEqual(['fullscreen', 'inline']);
  });

  it('只有旧的 enter/exit 时用那一对', () => {
    const calls: string[] = [];
    const video: WebkitFullscreenVideo = {
      webkitEnterFullscreen: () => { calls.push('enter') },
      webkitExitFullscreen: () => { calls.push('exit') },
    };
    expect(enterWebkitVideoFullscreen(video)).toBe(true);
    expect(exitWebkitVideoFullscreen(video)).toBe(true);
    expect(calls).toEqual(['enter', 'exit']);
  });
});
