const fs = require('fs');

try {
    if (fs.existsSync('projects/web_state.json')) {
        const state = JSON.parse(fs.readFileSync('projects/web_state.json'));
        const val = parseInt(state.glucose);
        const trend = state.trend;
        
        let report = "";
        let isAlarm = false;

        if (val < 70) {
            report = `🚨 *ALERTA: GLUCOSA BAJA*\nGlucosa: ${val} mg/dL ${trend}\nIOB: ${state.iob} U\nEstado: Hipoglucemia detectada.`;
            isAlarm = true;
        } else if (val > 180) {
            report = `⚠️ *ALERTA: GLUCOSA ALTA*\nGlucosa: ${val} mg/dL ${trend}\nIOB: ${state.iob} U\nEstado: Hiperglucemia detectada.`;
            isAlarm = true;
        } else if (trend === "↑↑" || trend === "↓↓") {
            report = `📈 *ALERTA: CAMBIO RÁPIDO*\nGlucosa: ${val} mg/dL ${trend}\nIOB: ${state.iob} U\nAtención a la tendencia.`;
            isAlarm = true;
        }

        if (isAlarm) {
            console.log(report);
        } else {
            // No output = No report via cron
            console.log("STATUS_OK"); 
        }
    } else {
        console.log("⏳ Buscando señal del simulador...");
    }
} catch (e) {
    console.log("❌ Error: " + e.message);
}
