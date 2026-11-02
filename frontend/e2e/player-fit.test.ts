/* 全屏画面适配不依赖资料库，直接用正式样式和浏览器全屏 API 验证。
 * iOS 竖屏的高度、页内全屏和画面旋转也在这里量，不启动资料库。 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { after, before, describe, it } from 'node:test';
import type { Browser, Page } from 'playwright-core';
import { launch } from './harness.ts';

const readStyles = (...names: string[]) => names.map((name) => readFileSync(new URL(name, import.meta.url), 'utf8')).join('\n');

const PORTRAIT_STAGE = `<div data-stage data-stage-kind="item">
  <div data-stage-scroll><div data-stage-grid><div data-stage-media>
    <div class="video-js vjs-peach-xsmall">
      <video class="vjs-tech" width="1920" height="1080"></video>
      <div class="vjs-control-bar"><div class="vjs-peach-right-controls">
        <div class="vjs-peach-expand vjs-control"></div>
        <div class="vjs-peach-settings vjs-control"></div>
        <div class="vjs-peach-theater vjs-control"></div>
        <div class="vjs-fullscreen-control vjs-control"></div>
      </div></div>
    </div>
  </div></div></div>
</div>`;

const playerBox = (page: Page) => page.locator('[data-stage-media] > .video-js').evaluate((node) => {
  const box = node.getBoundingClientRect();
  const fullscreen = node.querySelector('.vjs-fullscreen-control')!;
  const theater = node.querySelector('.vjs-peach-theater')!;
  const video = node.querySelector('video')!;
  return {
    height: box.height, width: box.width,
    fit: getComputedStyle(video).objectFit,
    aspect: getComputedStyle(node).aspectRatio,
    fullscreen: getComputedStyle(fullscreen).display,
    theater: getComputedStyle(theater).display,
    fullscreenWidth: fullscreen.getBoundingClientRect().width,
  };
});

for (const stylesheet of ['../src/player/player.css', '../../web/dist/peach-app.css']) {
describe(`全屏画面比例：${stylesheet}`, () => {
  let browser: Browser;
  before(async () => { browser = await launch() });
  after(async () => { await browser?.close() });

  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
  ]) {
    it(`${viewport.width}×${viewport.height}：全屏与退出全屏均完整显示`, { timeout: 30_000 }, async () => {
      const page = await browser.newPage({ viewport });
      try {
        const css = readFileSync(new URL(stylesheet, import.meta.url), 'utf8');
        await page.setContent(`<style>${css}</style><div data-stage-media>
          <div class="video-js"><video-player><media-container>
            <video class="vjs-tech" width="1920" height="1080"></video>
            <button style="position:relative;z-index:1">全屏</button>
          </media-container></video-player></div></div>`);
        await page.locator('button').evaluate(button => {
          button.addEventListener('click', () => button.parentElement!.requestFullscreen());
        });
        const video = page.locator('video');
        assert.equal(await video.evaluate(node => getComputedStyle(node).objectFit), 'contain');
        await page.locator('button').click();
        await page.waitForFunction(() => !!document.fullscreenElement);
        const frame = await video.evaluate(node => {
          const rect = node.getBoundingClientRect();
          return { fit: getComputedStyle(node).objectFit,
            box: [rect.x, rect.y, rect.width, rect.height], viewport: [innerWidth, innerHeight] };
        });
        assert.equal(frame.fit, 'contain', '比例不同时保留完整画面和黑边');
        assert.deepEqual(frame.box, [0, 0, ...frame.viewport]);
        await page.evaluate(() => document.exitFullscreen());
        for (const state of ['class', 'attribute', 'full-window']) {
          await page.locator('.video-js').evaluate((root, state) => {
            root.classList.toggle('vjs-fullscreen', state === 'class');
            root.toggleAttribute('data-peach-fullscreen', state === 'attribute');
            document.body.classList.toggle('vjs-full-window', state === 'full-window');
          }, state);
          assert.equal(await video.evaluate(node => getComputedStyle(node).objectFit), 'contain', state);
        }
        await page.locator('.video-js').evaluate(root => {
          root.classList.remove('vjs-fullscreen');
          root.removeAttribute('data-peach-fullscreen');
          document.body.classList.remove('vjs-full-window');
        });
        assert.equal(await video.evaluate(node => getComputedStyle(node).objectFit), 'contain');
      } finally { await page.close() }
    });
  }
});
}

for (const [label, css] of [
  ['源码', readStyles('../src/player/player.css', '../src/player/subtitles.css', '../src/react/stage/stage.css')],
  ['构建样式', readStyles('../../web/dist/peach-app.css')],
] as const) {
describe(`iOS 竖屏播放器：${label}`, () => {
  let browser: Browser;
  before(async () => { browser = await launch() });
  after(async () => { await browser?.close() });

  const open = async (viewport: { width: number; height: number }, options?: { ios?: boolean; theater?: boolean }) => {
    const page = await browser.newPage({ viewport });
    await page.setContent(`<style>${css}</style>${PORTRAIT_STAGE}`);
    await page.evaluate(({ ios, theater }) => {
      document.documentElement.toggleAttribute('data-peach-ios', ios);
      if (theater) document.querySelector('[data-stage]')!.setAttribute('data-theater', '');
    }, { ios: options?.ios === true, theater: options?.theater === true });
    return page;
  };

  it('iPhone 390×844 播放器占大半高度，全屏按钮直接可见，画面不裁切', { timeout: 30_000 }, async () => {
    const page = await open({ width: 390, height: 844 }, { ios: true });
    try {
      const box = await playerBox(page);
      assert.equal(box.fit, 'contain');
      assert.equal(box.aspect, 'auto');
      assert.ok(box.height > 844 * .75, `播放器高度 ${box.height}px，仍是一条横条`);
      assert.ok(box.height > box.width * 9 / 16 + 100, `播放器没有高出 16:9：${box.height}×${box.width}`);
      assert.equal(box.fullscreen, 'block');
      assert.ok(box.fullscreenWidth >= 30, '全屏按钮没有占位');
      assert.equal(box.theater, 'none', '影院仍收在展开键里');
    } finally { await page.close() }
  });

  it('iPhone 竖屏影院模式不拉高', { timeout: 30_000 }, async () => {
    const page = await open({ width: 390, height: 844 }, { ios: true, theater: true });
    try {
      const box = await playerBox(page);
      assert.equal(box.fit, 'contain');
      assert.ok(box.height < 844 * .6, `影院播放器被竖屏规则拉高：${box.height}px`);
    } finally { await page.close() }
  });

  it('Android 390×844 仍是 16:9，全屏继续收起，写上旋转属性也不转', { timeout: 30_000 }, async () => {
    const page = await open({ width: 390, height: 844 });
    try {
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-peach-fullwindow', '');
        const root = document.querySelector('.video-js')!;
        root.setAttribute('data-peach-fullwindow', '');
        root.setAttribute('data-peach-rotate', '90');
      });
      const box = await playerBox(page);
      const turned = await page.locator('.video-js').evaluate((node) => ({
        transform: getComputedStyle(node).transform,
        fit: getComputedStyle(node.querySelector('video')!).objectFit,
      }));
      assert.equal(box.aspect, '16 / 9');
      assert.equal(box.fullscreen, 'none');
      assert.equal(turned.transform, 'none');
      assert.equal(turned.fit, 'contain');
      assert.ok(box.height < 844 * .6, `Android 播放器被竖屏规则拉高：${box.height}px`);
    } finally { await page.close() }
  });

  it('桌面宽屏仍是 16:9，窄播放器的全屏继续收起', { timeout: 30_000 }, async () => {
    const page = await open({ width: 1280, height: 800 }, { ios: true });
    try {
      const box = await playerBox(page);
      assert.equal(box.fit, 'contain');
      assert.equal(box.aspect, '16 / 9');
      assert.equal(box.fullscreen, 'none');
      assert.equal(box.theater, 'none');
    } finally { await page.close() }
  });

  it('iPhone 390×844 页内全屏盖住视口，画面不裁切', { timeout: 30_000 }, async () => {
    const page = await open({ width: 390, height: 844 }, { ios: true });
    try {
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-peach-fullwindow', '');
        document.body.classList.add('vjs-full-window');
        document.querySelector('.video-js')!.setAttribute('data-peach-fullwindow', '');
      });
      const box = await playerBox(page);
      const position = await page.locator('.video-js').evaluate((node) => getComputedStyle(node).position);
      assert.equal(box.fit, 'contain');
      assert.equal(position, 'fixed');
      assert.ok(box.height > 844 * .95, `页内全屏高度 ${box.height}px，没有盖住视口`);
      assert.ok(box.width > 390 * .95, `页内全屏宽度 ${box.width}px`);
      const scroll = await page.evaluate(() => getComputedStyle(document.documentElement).overflow);
      assert.equal(scroll, 'hidden');
    } finally { await page.close() }
  });

  it('iPhone 竖屏页内全屏把播放器和控制条一起转 90°', { timeout: 30_000 }, async () => {
    const page = await open({ width: 390, height: 844 }, { ios: true });
    try {
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-peach-fullwindow', '');
        const root = document.querySelector('.video-js')!;
        root.setAttribute('data-peach-fullwindow', '');
        root.setAttribute('data-peach-rotate', '90');
        const captions = document.createElement('div');
        captions.className = 'vjs-peach-captions';
        captions.innerHTML = '<div class="vjs-peach-caption-window"><span class="vjs-peach-caption-line">字幕</span></div>';
        root.append(captions);
      });
      const turned = await page.locator('.video-js').evaluate((node) => {
        const style = getComputedStyle(node);
        const matrix = new DOMMatrix(style.transform);
        const video = node.querySelector('video')!;
        const videoStyle = getComputedStyle(video);
        const bar = node.querySelector('.vjs-control-bar')!;
        const barBox = bar.getBoundingClientRect();
        const line = node.querySelector('.vjs-peach-caption-line')!.getBoundingClientRect();
        return {
          clockwise: Math.abs(matrix.b - 1) < .05 && Math.abs(matrix.c + 1) < .05,
          fit: videoStyle.objectFit,
          videoTransform: videoStyle.transform,
          barTransform: getComputedStyle(bar).transform,
          barLeft: barBox.left, barWidth: barBox.width, barHeight: barBox.height,
          lineLeft: line.left, lineTop: line.top, lineWidth: line.width, lineHeight: line.height,
        };
      });
      assert.equal(turned.clockwise, true, '播放器要顺时针转 90°');
      assert.equal(turned.fit, 'cover');
      assert.equal(turned.videoTransform, 'none', '画面本身不再叠一次旋转');
      assert.equal(turned.barTransform, 'none');
      assert.ok(turned.barLeft < 40, `控制条不在画面底边：left ${turned.barLeft}`);
      assert.ok(turned.barWidth < 140, `控制条仍是横条：width ${turned.barWidth}`);
      assert.ok(turned.barHeight > 500, `控制条没有跟着长边走：height ${turned.barHeight}`);
      assert.ok(turned.lineLeft < 180, `字幕不在画面底边：left ${turned.lineLeft}`);
      assert.ok(turned.lineTop > 40 && turned.lineTop < 800, `字幕不沿长边：top ${turned.lineTop}`);
      assert.ok(turned.lineHeight > turned.lineWidth, '字幕仍是手机正向');
    } finally { await page.close() }
  });

  it('手机横屏不拉高，全屏仍收在展开键里', { timeout: 30_000 }, async () => {
    const page = await open({ width: 700, height: 400 }, { ios: true });
    try {
      const box = await playerBox(page);
      assert.equal(box.fit, 'contain');
      assert.equal(box.aspect, '16 / 9');
      assert.equal(box.fullscreen, 'none');
      assert.ok(box.height < 400 * .75, `横屏播放器被拉高：${box.height}px`);
    } finally { await page.close() }
  });
});
}
