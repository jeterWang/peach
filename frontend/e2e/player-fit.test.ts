/* 全屏画面适配不依赖资料库，直接用正式样式和浏览器全屏 API 验证。
 * 竖屏窄视口的高度和全屏按钮也在这里量，不启动资料库。 */
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
  ['源码', readStyles('../src/player/player.css', '../src/react/stage/stage.css')],
  ['构建样式', readStyles('../../web/dist/peach-app.css')],
] as const) {
describe(`竖屏窄视口播放器：${label}`, () => {
  let browser: Browser;
  before(async () => { browser = await launch() });
  after(async () => { await browser?.close() });

  const open = async (viewport: { width: number; height: number }, theater = false) => {
    const page = await browser.newPage({ viewport });
    await page.setContent(`<style>${css}</style>${PORTRAIT_STAGE}`);
    if (theater) await page.locator('[data-stage]').evaluate((node) => node.setAttribute('data-theater', ''));
    return page;
  };

  it('390×844 播放器占大半高度，全屏按钮直接可见，画面不裁切', { timeout: 30_000 }, async () => {
    const page = await open({ width: 390, height: 844 });
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

  it('竖屏影院模式不改成这条拉高', { timeout: 30_000 }, async () => {
    const page = await open({ width: 390, height: 844 }, true);
    try {
      const box = await playerBox(page);
      assert.equal(box.fit, 'contain');
      assert.ok(box.height < 844 * .6, `影院播放器被竖屏规则拉高：${box.height}px`);
    } finally { await page.close() }
  });

  it('桌面宽屏仍是 16:9，窄播放器的全屏继续收起', { timeout: 30_000 }, async () => {
    const page = await open({ width: 1280, height: 800 });
    try {
      const box = await playerBox(page);
      assert.equal(box.fit, 'contain');
      assert.equal(box.aspect, '16 / 9');
      assert.equal(box.fullscreen, 'none');
      assert.equal(box.theater, 'none');
    } finally { await page.close() }
  });

  it('390×844 页内全屏盖住视口，画面不裁切', { timeout: 30_000 }, async () => {
    const page = await open({ width: 390, height: 844 });
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

  it('390×844 页内全屏把横屏画面转 90° 贴满长边，控制条不转', { timeout: 30_000 }, async () => {
    const page = await open({ width: 390, height: 844 });
    try {
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-peach-fullwindow', '');
        document.querySelector('.video-js')!.setAttribute('data-peach-fullwindow', '');
        document.querySelector('.video-js')!.setAttribute('data-peach-rotate', '90');
      });
      const turned = await page.locator('video').evaluate((node) => {
        const style = getComputedStyle(node);
        const box = node.getBoundingClientRect();
        const matrix = new DOMMatrix(style.transform);
        const bar = node.closest('.video-js')!.querySelector('.vjs-control-bar')!;
        const barBox = bar.getBoundingClientRect();
        return {
          fit: style.objectFit,
          clockwise: Math.abs(matrix.b - 1) < .05 && Math.abs(matrix.c + 1) < .05,
          width: box.width, height: box.height,
          barTransform: getComputedStyle(bar).transform,
          barBottom: barBox.bottom, barWidth: barBox.width,
        };
      });
      assert.equal(turned.fit, 'cover');
      assert.equal(turned.clockwise, true);
      assert.ok(turned.width > 390 * .9, `转过后的宽度 ${turned.width}px`);
      assert.ok(turned.height > 844 * .9, `转过后的高度 ${turned.height}px`);
      assert.equal(turned.barTransform, 'none');
      assert.ok(turned.barBottom > 844 - 120, `控制条不在竖屏底部：${turned.barBottom}`);
      assert.ok(turned.barWidth > 200);
      await page.locator('.video-js').evaluate((root) => {
        const captions = document.createElement('div');
        captions.className = 'vjs-peach-captions';
        captions.innerHTML = '<div class="vjs-peach-caption-window"><span class="vjs-peach-caption-line">字幕</span></div>';
        root.append(captions);
      });
      const caption = await page.locator('.vjs-peach-captions').evaluate((node) => {
        const style = getComputedStyle(node);
        const matrix = new DOMMatrix(style.transform);
        const line = node.querySelector('.vjs-peach-caption-line')!.getBoundingClientRect();
        return {
          clockwise: Math.abs(matrix.b - 1) < .05 && Math.abs(matrix.c + 1) < .05,
          lineLeft: line.left, lineTop: line.top,
        };
      });
      assert.equal(caption.clockwise, true, '字幕要和画面同向旋转');
      assert.ok(caption.lineLeft < 80, `字幕不在横屏底边：left ${caption.lineLeft}`);
      assert.ok(caption.lineTop > 40 && caption.lineTop < 800, `字幕不沿长边：top ${caption.lineTop}`);
    } finally { await page.close() }
  });

  it('桌面没有页内全屏属性时仍是 16:9', { timeout: 30_000 }, async () => {
    const page = await open({ width: 1280, height: 800 });
    try {
      const box = await playerBox(page);
      const marked = await page.locator('.video-js').evaluate((node) => node.hasAttribute('data-peach-fullwindow'));
      assert.equal(marked, false);
      assert.equal(box.aspect, '16 / 9');
    } finally { await page.close() }
  });

  it('手机横屏不拉高，全屏仍收在展开键里', { timeout: 30_000 }, async () => {
    const page = await open({ width: 700, height: 400 });
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
