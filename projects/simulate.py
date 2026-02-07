import json
import random
import time
import os

STATE_FILE = "projects/glucose_state.json"

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return {"glucose": 110.0, "activeInsulin": 0.0, "activeCarbs": 0.0, "history": []}

def save_state(state):
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=4)

def simulate_step(state, minutes=1):
    glucose = state["glucose"]
    activeCarbs = state["activeCarbs"]
    activeInsulin = state["activeInsulin"]
    
    for _ in range(minutes):
        change = (random.random() - 0.5) * 0.5 # Ruido base menor por minuto
        
        if activeCarbs > 0:
            digestion = min(activeCarbs, 1.0)
            change += digestion * 3.0
            activeCarbs -= digestion
            
        if activeInsulin > 0:
            absorption = min(activeInsulin, 0.1)
            change -= absorption * 25.0
            activeInsulin -= absorption
            
        # Tendencia natural al equilibrio
        change += (105 - glucose) * 0.005
        
        glucose += change
        
    state["glucose"] = round(glucose, 1)
    state["activeCarbs"] = round(activeCarbs, 1)
    state["activeInsulin"] = round(activeInsulin, 2)
    state["history"].append(state["glucose"])
    if len(state["history"]) > 60: state["history"].pop(0)
    
    return state

def get_report():
    state = load_state()
    old_glucose = state["glucose"]
    state = simulate_step(state)
    save_state(state)
    
    diff = state["glucose"] - old_glucose
    trend = "→"
    if diff > 1.0: trend = "↑"
    elif diff > 0.3: trend = "↗"
    elif diff < -1.0: trend = "↓"
    elif diff < -0.3: trend = "↘"
    
    status = "EN RANGO"
    if state["glucose"] < 70: status = "BAJA (HIPO)"
    elif state["glucose"] > 180: status = "ALTA (HIPER)"
    
    report = f"📊 *Reporte Libre 3*\n"
    report += f"Glucosa: {state['glucose']} mg/dL {trend}\n"
    report += f"Estado: {status}\n"
    if state['activeCarbs'] > 0: report += f"Carbohidratos activos: {state['activeCarbs']}g\n"
    if state['activeInsulin'] > 0: report += f"Insulina activa: {state['activeInsulin']}u"
    
    return report

if __name__ == "__main__":
    print(get_report())
