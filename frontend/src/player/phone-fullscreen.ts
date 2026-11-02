/* 竖屏窄视口上的全屏补路。
 *
 * iPhone Safari 常常报得出 Fullscreen API，点下去却进不了元素全屏。视频自己的
 * `webkitSetPresentationMode` / `webkitEnterFullscreen` 仍能打开系统全屏。桌面没有这些方法，
 * 计划直接交回 Video.js，宽屏布局和控件不受影响。 */

export type PhoneFullscreenPlan = 'delegate' | 'webkit-exit' | 'element-then-webkit' | 'webkit-enter';

export interface WebkitFullscreenVideo {
  webkitDisplayingFullscreen?: boolean;
  webkitPresentationMode?: string;
  webkitEnterFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  webkitSetPresentationMode?: (mode: string) => void;
}

export interface PhoneFullscreenInput {
  portrait: boolean;
  webkit: boolean;
  elementFullscreen: boolean;
  elementActive: boolean;
  webkitActive: boolean;
}

/** 设备竖屏且视口不宽于手机详情断点。横屏和桌面不匹配。 */
export const PORTRAIT_PHONE_QUERY = '(max-width: 760px) and (orientation: portrait)';

export const portraitPhone = (): boolean => matchMedia(PORTRAIT_PHONE_QUERY).matches;

export const webkitVideoFullscreenAvailable = (video: WebkitFullscreenVideo): boolean =>
  typeof video.webkitEnterFullscreen === 'function' || typeof video.webkitSetPresentationMode === 'function';

export const webkitVideoFullscreenActive = (video: WebkitFullscreenVideo): boolean =>
  video.webkitDisplayingFullscreen === true || video.webkitPresentationMode === 'fullscreen';

export const elementFullscreenEnabled = (): boolean => {
  const doc = document as Document & { webkitFullscreenEnabled?: boolean };
  return !!doc.fullscreenEnabled || !!doc.webkitFullscreenEnabled;
};

export const elementFullscreenActive = (): boolean => {
  const doc = document as Document & { webkitFullscreenElement?: Element | null };
  return !!(doc.fullscreenElement || doc.webkitFullscreenElement);
};

/** 已经在元素全屏里时交给 Video.js 退出；其余竖屏且具备 webkit 视频全屏时由 Peach 补路。 */
export const planPhoneFullscreen = (input: PhoneFullscreenInput): PhoneFullscreenPlan => {
  if (!input.portrait || !input.webkit || input.elementActive) return 'delegate';
  if (input.webkitActive) return 'webkit-exit';
  return input.elementFullscreen ? 'element-then-webkit' : 'webkit-enter';
};

export const enterWebkitVideoFullscreen = (video: WebkitFullscreenVideo): boolean => {
  if (typeof video.webkitSetPresentationMode === 'function') {
    video.webkitSetPresentationMode('fullscreen');
    return true;
  }
  if (typeof video.webkitEnterFullscreen === 'function') {
    video.webkitEnterFullscreen();
    return true;
  }
  return false;
};

export const exitWebkitVideoFullscreen = (video: WebkitFullscreenVideo): boolean => {
  if (video.webkitPresentationMode === 'fullscreen' && typeof video.webkitSetPresentationMode === 'function') {
    video.webkitSetPresentationMode('inline');
    return true;
  }
  if (typeof video.webkitExitFullscreen === 'function') {
    video.webkitExitFullscreen();
    return true;
  }
  return false;
};

export const requestElementFullscreen = (container: HTMLElement): Promise<void> => {
  const node = container as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
  const request = node.requestFullscreen?.bind(node) ?? node.webkitRequestFullscreen?.bind(node);
  if (!request) return Promise.reject(new Error('element fullscreen unavailable'));
  return Promise.resolve(request());
};
