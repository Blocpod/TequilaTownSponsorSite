async (page) => {
  await page.evaluate(() => document.fonts.ready);
  const sizes = [[320, 568], [390, 844], [768, 600], [800, 600], [1024, 600], [1280, 720], [1280, 800], [1366, 768], [1440, 700], [1440, 900], [1536, 864], [1920, 1080], [2560, 1440]];
  const results = [];
  for (const font of ['brand', 'fallback']) {
    if (font === 'fallback') await page.addStyleTag({ content: '.hero h1{font-family:Arial,sans-serif}' });
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      const spacing = await page.evaluate(() => {
        const header = document.querySelector('header').getBoundingClientRect();
        const content = document.querySelector('.hero-inner').getBoundingClientRect();
        const hero = document.querySelector('.hero').getBoundingClientRect();
        const heading = document.querySelector('.hero h1');
        const buttons = document.querySelector('.hero-actions').getBoundingClientRect();
        return {
          topGap: content.top - header.bottom,
          bottomGap: hero.bottom - content.bottom,
          headlineLines: heading.getBoundingClientRect().height / parseFloat(getComputedStyle(heading).lineHeight),
          buttonClearance: innerHeight - buttons.bottom,
        };
      });
      if (spacing.topGap < 24 || spacing.bottomGap < 64) {
        throw new Error(`Hero overlaps its header or outgrows its background at ${width}×${height} (${font}): ${JSON.stringify(spacing)}`);
      }
      if (width >= 1024 && (spacing.headlineLines > 2.1 || spacing.buttonClearance < 24)) {
        throw new Error(`Desktop headline or buttons exceed the available space at ${width}×${height} (${font}): ${JSON.stringify(spacing)}`);
      }
      results.push({ width, height, font, ...spacing });
    }
  }
  await page.reload();
  return results;
}
