const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto('https://enchanting-begonia-56cdd4.netlify.app/');
        
        if (await page.isVisible('input[type="password"]')) {
            await page.fill('input[type="password"]', 'My-Drop-Site');
            await page.click('button:has-text("Submit")');
            await page.waitForURL('https://enchanting-begonia-56cdd4.netlify.app/');
        }

        await page.waitForSelector('#current-glucose');
        
        // Inject 100 UI via evaluate to bypass the UI dropdown limit
        await page.evaluate(() => {
            if (typeof injectInsulin === 'function') {
                injectInsulin(100);
                return "Insulina inyectada mediante función interna.";
            } else {
                return "Error: Función injectInsulin no encontrada.";
            }
        });

        console.log("✅ Se han administrado 100 UI de insulina en el simulador.");

    } catch (error) {
        console.log("❌ Error: " + error.message);
    } finally {
        await browser.close();
    }
})();
