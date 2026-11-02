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

export interface SeekBox { left: number; top: number; width: number; height: number }

/** 播放器顺时针转 90° 之后，进度条的布局仍是横条，屏幕上的长边却是竖直的。
 *  Video.js 在按下时记下 `getBoundingClientRect()`，水平条用 `(clientX - left) / width`。
 *  转完以后 width 是短边，手指沿长边移动几乎不改变这个比值，短边上的一点晃动就会从片头跳到片尾。
 *  时间 0 在屏幕上方。把沿长边的比例写回 clientX，那条公式读到的就是手指在进度条上的位置。 */
export function rotatedSeekClientPoint(point: { clientX: number; clientY: number }, box: SeekBox): { clientX: number; clientY: number } {
  const span = box.height > 0 ? box.height : 1;
  const along = Math.min(1, Math.max(0, (point.clientY - box.top) / span));
  return { clientX: box.left + along * box.width, clientY: box.top + box.height / 2 };
}

/** 只有 iOS 竖屏页内全屏、而且进度条的包围盒已经竖过来时才改坐标。横条仍交给 Video.js。 */
export function needsRotatedSeekMap(ios: boolean, rotate: string | null, box: SeekBox): boolean {
  return ios && rotate === '90' && box.width > 0 && box.height > box.width;
}

/** 在捕获阶段改写进度条的指针坐标，再交给 Video.js。桌面和未旋转的控制条原样放过。 */
export function attachRotatedSeek(root: HTMLElement): () => void {
  const seen = new WeakSet<Event>();
  const remap = (event: Event) => {
    if (!(event instanceof PointerEvent) || seen.has(event)) return;
    if (!document.documentElement.hasAttribute('data-peach-ios') || root.getAttribute('data-peach-rotate') !== '90') return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const slider = target.closest('media-time-slider');
    if (!slider || !root.contains(slider)) return;
    const box = slider.getBoundingClientRect();
    if (!needsRotatedSeekMap(true, '90', box)) return;
    const point = rotatedSeekClientPoint(event, box);
    const clone = new PointerEvent(event.type, {
      bubbles: true, cancelable: true, composed: true,
      pointerId: event.pointerId, pointerType: event.pointerType, isPrimary: event.isPrimary,
      button: event.button, buttons: event.buttons,
      clientX: point.clientX, clientY: point.clientY,
      screenX: event.screenX + point.clientX - event.clientX,
      screenY: event.screenY + point.clientY - event.clientY,
      ctrlKey: event.ctrlKey, shiftKey: event.shiftKey, altKey: event.altKey, metaKey: event.metaKey,
      width: event.width, height: event.height, pressure: event.pressure,
    });
    seen.add(clone);
    event.stopImmediatePropagation();
    event.preventDefault();
    slider.dispatchEvent(clone);
  };
  for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) root.addEventListener(type, remap, true);
  return () => { for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) root.removeEventListener(type, remap, true) };
}
