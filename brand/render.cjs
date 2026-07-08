const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const DIR = __dirname;

const JOBS = [
  { svg: 'icon.svg',            out: 'icon.png',            w: 1024, h: 1024 },
  { svg: 'icon.svg',            out: 'icon-preview.png',    w: 512,  h: 512 },
  { svg: 'icon-background.svg', out: 'icon-background.png', w: 1024, h: 1024 },
  { svg: 'icon-foreground.svg', out: 'icon-foreground.png', w: 1024, h: 1024, transparent: true },
  { svg: 'splash.svg',          out: 'splash.png',          w: 2732, h: 2732 },
  { svg: 'splash-dark.svg',     out: 'splash-dark.png',     w: 2732, h: 2732 },
  { svg: 'splash.svg',          out: 'splash-preview.png',      w: 900, h: 900 },
  { svg: 'splash-dark.svg',     out: 'splash-dark-preview.png', w: 900, h: 900 },
];

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  for (const j of JOBS) {
    const svg = fs.readFileSync(path.join(DIR, j.svg), 'utf8');
    const page = await browser.newPage();
    await page.setViewport({ width: j.w, height: j.h, deviceScaleFactor: 1 });
    const html = `<!doctype html><html><head><meta charset="utf8"><style>*{margin:0;padding:0}html,body{width:${j.w}px;height:${j.h}px;overflow:hidden}svg{display:block;width:${j.w}px;height:${j.h}px}</style></head><body>${svg}</body></html>`;
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(DIR, j.out), type: 'png', omitBackground: !!j.transparent });
    await page.close();
    console.log('rendered', j.out, j.w + 'x' + j.h);
  }
  await browser.close();
})();
