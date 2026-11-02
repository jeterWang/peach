/* iPhone Safari 没有可用的元素全屏。窄触屏上的 iPhone / iPod 把播放器铺满视口，
 * 竖屏里横屏片子连同控制条、字幕和转圈一起转 90°。
 * `data-peach-ios` 与首屏内联脚本用同一条 UA 判断。Android 和桌面不写这枚属性，
 * 竖屏铺满和旋转规则都不生效。 */

export const IOS_UA = /iPhone|iPod|iPad/;
export const FULLWINDOW_QUERY = '(max-width: 760px) and (pointer: coarse)';
export const FULLWINDOW_ATTR = 'data-peach-fullwindow';

export type FullWindowPlan = 'delegate' | 'enter' | 'exit';

export function isIosUserAgent(userAgent: string): boolean {
  return IOS_UA.test(userAgent);
}

/** 首屏脚本已经写过时再写一次结果相同。测试页和晚加载的播放器靠这里补上。 */
export function markIosDocument(userAgent = navigator.userAgent): void {
  document.documentElement.toggleAttribute('data-peach-ios', isIosUserAgent(userAgent));
}

/** 窄触屏上的 iPhone / iPod。桌面改窄、Android、iPad 都不走页内全屏。 */
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
  if (!root) return;
  setFullWindow(root, false);
  root.removeAttribute('data-peach-rotate');
}

/** 竖屏页内全屏里，横屏或尚未读到尺寸的画面转 90° 去贴长边。竖屏片源不转。 */
export function fullWindowRotation(active: boolean, portrait: boolean, videoWidth: number, videoHeight: number): '90' | '' {
  if (!active || !portrait) return '';
  if (videoWidth > 0 && videoHeight > videoWidth) return '';
  return '90';
}
