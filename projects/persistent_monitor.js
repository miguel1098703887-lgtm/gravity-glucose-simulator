const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
    console.log("Iniciando navegador persistente...");
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

        // Loop principal
        while (true) {
            // Verificar si hay comandos pendientes
            if (fs.existsSync('projects/cmd.json')) {
                const cmdData = JSON.parse(fs.readFileSync('projects/cmd.json'));
                fs.unlinkSync('projects/cmd.json');
                
                if (cmdData.action === 'inject') {
                    await page.evaluate((u) => {
                        if (typeof injectInsulin === 'function') injectInsulin(u);
                    }, cmdData.units);
                    console.log(`Comando ejecutado: Inyectar ${cmdData.units} UI`);
                }
            }

            // Leer estado actual
            const status = await page.evaluate(() => {
                return {
                    glucose: document.getElementById('current-glucose').innerText,
                    trend: document.getElementById('trend-arrow').innerText,
                    iob: document.getElementById('metric-iob').innerText
                };
            });

            // Guardar estado para el reporte del cron
            fs.writeFileSync('projects/web_state.json', JSON.stringify(status));

            await new Promise(r => setTimeout(r, 2000));
        }

    } catch (error) {
        console.error("Error en sesión persistente:", error);
    } finally {
        await browser.close();
    }
}

run();
