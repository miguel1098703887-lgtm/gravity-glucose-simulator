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
        
        // Administrar 2 UI usando la función interna
        await page.evaluate(() => {
            if (typeof injectInsulin === 'function') {
                injectInsulin(2);
                return "2 UI administradas.";
            } else {
                return "Error: Función no encontrada.";
            }
        });

        console.log("✅ Se han administrado 2 UI de insulina adicionales.");

    } catch (error) {
        console.log("❌ Error: " + error.message);
    } finally {
        await browser.close();
    }
})();
