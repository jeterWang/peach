/* iPhone Safari 没有元素全屏。全屏按钮在窄触屏的 iPhone 上把播放器铺满视口，
 * 不调用 `webkitEnterFullscreen`，Peach 的控制条和字幕留在页面里。
 * 桌面和宽屏不走这条，仍由 Video.js 的全屏按钮处理。 */

export const FULLWINDOW_QUERY = '(max-width: 760px) and (pointer: coarse)';
export const FULLWINDOW_ATTR = 'data-peach-fullwindow';

export type FullWindowPlan = 'delegate' | 'enter' | 'exit';

/** 窄触屏上的 iPhone / iPod。桌面改窄、Android 都不算。 */
export function prefersFullWindow(narrowTouch: boolean, userAgent: string): boolean {
  return narrowTouch && /iPhone|iPod/.test(userAgent);
}

export function fullWindowOnThisDevice(): boolean {
  const narrowTouch = typeof matchMedia === 'function' && matchMedia(FULLWINDOW_QUERY).matches;
  return prefersFullWindow(narrowTouch, navigator.userAgent);
}

export function planFullWindow(input: { fullWindow: boolean; active: boolean }): FullWindowPlan {
  if (!input.fullWindow) return 'delegate';
  return input.active ? 'exit' : 'enter';
}

export function fullWindowActive(root: Element | null): boolean {
  return !!root?.hasAttribute(FULLWINDOW_ATTR);
}

export function setFullWindow(root: HTMLElement, active: boolean): void {
  root.toggleAttribute(FULLWINDOW_ATTR, active);
  document.documentElement.toggleAttribute(FULLWINDOW_ATTR, active);
  document.body.classList.toggle('vjs-full-window', active);
}

export function exitFullWindow(root: HTMLElement | null): void {
  if (root) setFullWindow(root, false);
}
