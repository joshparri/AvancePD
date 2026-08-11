import { chromium } from 'playwright';

(async () => {
  console.log("Starting QA test with Playwright...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  try {
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
    const title = await page.title();
    console.log(`Visited Homepage. Title: ${title}`);
    
    // Get all links on the page
    const links = await page.$$eval('a', anchors => 
      anchors.map(a => ({ text: a.innerText.trim(), href: a.href }))
    );
    
    console.log(`Found ${links.length} links on the homepage.`);
    
    // Visit unique internal links
    const visited = new Set(['http://localhost:4173/']);
    const internalLinks = links.filter(l => l.href.startsWith('http://localhost:4173/'));
    
    for (const link of internalLinks) {
      if (!visited.has(link.href)) {
        visited.add(link.href);
        console.log(`Navigating to ${link.text || 'unnamed'} (${link.href})...`);
        await page.goto(link.href, { waitUntil: 'networkidle' });
        
        // Simple sanity check: grab the h1 if it exists
        const heading = await page.locator('h1').first().textContent().catch(() => 'No H1 found');
        console.log(`  -> Page loaded. Main heading: ${heading}`);
      }
    }
    
    console.log("\n--- QA Results ---");
    if (errors.length > 0) {
      console.log("Encountered errors during QA:");
      errors.forEach(e => console.log(e));
    } else {
      console.log("No console or page errors encountered!");
    }
    
  } catch (err) {
    console.error("Test failed to execute:", err);
  } finally {
    await browser.close();
  }
})();
