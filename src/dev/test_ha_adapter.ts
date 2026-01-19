import { buildEnergyFrameFromHa } from "../adapters/homeassistant/buildEnergyFrameFromHa";
import { validateEnergyFrame } from "../validate/validateEnergyFrame";
import type { HaEnergyMapping } from "../adapters/homeassistant/HaMapping";
import type { HaState } from "../adapters/homeassistant/HaState";

// 1) Beispiel-Mapping (wie später aus Wizard/Config)
const mapping: HaEnergyMapping = {
  nodes: [
    {
      id: "pv",
      type: "pv",
      label: "PV",
      phases: [
        { phase: "L1", entity_id: "sensor.pv_l1_power" },
        { phase: "L2", entity_id: "sensor.pv_l2_power" },
        { phase: "L3", entity_id: "sensor.pv_l3_power" }
      ]
    },
    {
      id: "house",
      type: "house",
      label: "Haus",
      phases: [
        // Haus ist Verbrauch => negative Vorzeichen im Core
        { phase: "L1", entity_id: "sensor.house_l1_power", factor: -1 },
        { phase: "L2", entity_id: "sensor.house_l2_power", factor: -1 },
        { phase: "L3", entity_id: "sensor.house_l3_power", factor: -1 }
      ]
    },
    {
      id: "grid",
      type: "grid",
      label: "Netz",
      phases: [
        // Netz: + Bezug / - Einspeisung (Core-Konvention)
        { phase: "L1", entity_id: "sensor.grid_l1_power" },
        { phase: "L2", entity_id: "sensor.grid_l2_power" },
        { phase: "L3", entity_id: "sensor.grid_l3_power" }
      ]
    }
  ]
};

// 2) Fake-States (so wie HA sie liefern würde)
const statesList: HaState[] = [
  { entity_id: "sensor.pv_l1_power", state: "1400" },
  { entity_id: "sensor.pv_l2_power", state: "1400" },
  { entity_id: "sensor.pv_l3_power", state: "1400" },

  { entity_id: "sensor.house_l1_power", state: "1200" },
  { entity_id: "sensor.house_l2_power", state: "1000" },
  { entity_id: "sensor.house_l3_power", state: "800" },

  // In diesem Beispiel: PV 4200, Haus -3000 => Einspeisung -1200
  { entity_id: "sensor.grid_l1_power", state: "-200" },
  { entity_id: "sensor.grid_l2_power", state: "-400" },
  { entity_id: "sensor.grid_l3_power", state: "-600" }
];

// Für schnellen Lookup: entity_id -> state
const states: Record<string, HaState> = Object.fromEntries(
  statesList.map((s) => [s.entity_id, s])
);

// 3) EnergyFrame bauen
const frame = buildEnergyFrameFromHa(mapping, states, 1000);

// 4) Validieren
const check = validateEnergyFrame(frame);

// 5) Output
console.log("EnergyFrame:", JSON.stringify(frame, null, 2));
console.log("Validation:", check);

if (!check.valid) {
  process.exitCode = 1;
}
