/* 按住画面右半边临时两倍速，松手回到原来的倍速。
 * 只认触摸和笔。鼠标拖进度条不会进这里。
 * 竖屏页内全屏把播放器顺时针转了 90° 时，画面的右侧落在屏幕下半边，按画面自己的横轴判断。 */
import type { VjsPlayer } from './types';

export const HOLD_PLAYBACK_RATE = 2;
export const HOLD_DELAY_MS = 450;
export const HOLD_MOVE_PX = 14;

export interface HoldBox { left: number; top: number; width: number; height: number }

/** 画面横轴上的位置，0 是画面左侧，1 是右侧。旋转后改读屏幕的竖直方向。 */
export function videoAlong(point: { clientX: number; clientY: number }, box: HoldBox, rotated: boolean): number {
  const vertical = rotated && box.height > box.width;
  const span = (vertical ? box.height : box.width) || 1;
  const delta = vertical ? point.clientY - box.top : point.clientX - box.left;
  return Math.min(1, Math.max(0, delta / span));
}

export function holdOnRight(along: number): boolean {
  return along >= 0.5;
}

/** 触摸落在正在播放的画面右半边，并且手指还没滑开，才开始计时。 */
export function canArmHold(input: { pointerType: string; playing: boolean; seeking: boolean; along: number }): boolean {
  if (input.pointerType !== 'touch' && input.pointerType !== 'pen') return false;
  if (!input.playing || input.seeking) return false;
  return holdOnRight(input.along);
}

/** 按住画面右半边时临时改成两倍速，松手或取消时收回按下前的倍速。 */
export function attachHoldSpeed(player: VjsPlayer): () => void {
  const root = player.el();
  const video = root.querySelector('video');
  if (!video) return () => {};
  let badge = root.querySelector<HTMLElement>('[data-peach-hold-speed]');
  if (!badge) {
    badge = document.createElement('div');
    badge.className = 'vjs-peach-hold-speed';
    badge.dataset.peachHoldSpeed = '';
    badge.setAttribute('role', 'status');
    badge.setAttribute('aria-label', '两倍速');
    badge.textContent = '2x';
    badge.hidden = true;
    root.append(badge);
  }
  const shown = badge;
  let pointerId = -1;
  let originX = 0;
  let originY = 0;
  let previous = 1;
  let armed = false;
  let boosted = false;
  let swallowClick = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const rotated = () => document.documentElement.hasAttribute('data-peach-ios') && root.getAttribute('data-peach-rotate') === '90';
  const hide = () => { shown.hidden = true };
  const clearTimer = () => { if (timer) { clearTimeout(timer); timer = undefined } };
  const restore = () => {
    clearTimer();
    if (boosted) player.playbackRate(previous);
    boosted = false;
    armed = false;
    pointerId = -1;
    hide();
  };
  const onDown = (event: PointerEvent) => {
    if (pointerId !== -1 || event.button !== 0) return;
    const box = video.getBoundingClientRect();
    const along = videoAlong(event, box, rotated());
    if (!canArmHold({ pointerType: event.pointerType, playing: !player.paused() && !video.ended, seeking: video.seeking, along })) return;
    pointerId = event.pointerId;
    originX = event.clientX;
    originY = event.clientY;
    previous = Number(player.playbackRate()) || 1;
    armed = true;
    swallowClick = false;
    clearTimer();
    timer = setTimeout(() => {
      timer = undefined;
      if (!armed || pointerId !== event.pointerId || player.paused()) return;
      player.playbackRate(HOLD_PLAYBACK_RATE);
      boosted = true;
      swallowClick = true;
      shown.hidden = false;
    }, HOLD_DELAY_MS);
  };
  const onMove = (event: PointerEvent) => {
    if (!armed || event.pointerId !== pointerId || boosted) return;
    if (Math.hypot(event.clientX - originX, event.clientY - originY) <= HOLD_MOVE_PX) return;
    clearTimer();
    armed = false;
    pointerId = -1;
  };
  const onUp = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    const consumed = boosted;
    restore();
    if (consumed) swallowClick = true;
  };
  const onClick = (event: MouseEvent) => {
    if (!swallowClick) return;
    swallowClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  const onContext = (event: Event) => { if (armed || boosted) event.preventDefault() };
  video.addEventListener('pointerdown', onDown);
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
  document.addEventListener('pointercancel', onUp);
  video.addEventListener('click', onClick, true);
  video.addEventListener('contextmenu', onContext);
  video.addEventListener('pause', restore);
  video.addEventListener('ended', restore);
  return () => {
    restore();
    swallowClick = false;
    video.removeEventListener('pointerdown', onDown);
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    document.removeEventListener('pointercancel', onUp);
    video.removeEventListener('click', onClick, true);
    video.removeEventListener('contextmenu', onContext);
    video.removeEventListener('pause', restore);
    video.removeEventListener('ended', restore);
    shown.remove();
  };
}
