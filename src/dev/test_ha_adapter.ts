import { buildEnergyFrameFromHa } from "../adapters/homeassistant/buildEnergyFrameFromHa.js";
import { validateEnergyFrame } from "../validate/validateEnergyFrame.js";
import type { HaEnergyMapping } from "../adapters/homeassistant/HaMapping.js";
import type { HaState } from "../adapters/homeassistant/HaState.js";

/**
 * 1) Beispiel-Mapping
 *    (entspricht später einem HA-Setup-Wizard-Output)
 */
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
        // Haus = Verbraucher → negative Vorzeichen im Core
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
        // Netz: +Bezug / -Einspeisung
        { phase: "L1", entity_id: "sensor.grid_l1_power" },
        { phase: "L2", entity_id: "sensor.grid_l2_power" },
        { phase: "L3", entity_id: "sensor.grid_l3_power" }
      ]
    }
  ]
};

/**
 * 2) Fake-States
 *    (genau so kommen sie aus Home Assistant)
 */
const statesList: HaState[] = [
  { entity_id: "sensor.pv_l1_power", state: "1400" },
  { entity_id: "sensor.pv_l2_power", state: "1400" },
  { entity_id: "sensor.pv_l3_power", state: "1400" },

  { entity_id: "sensor.house_l1_power", state: "1200" },
  { entity_id: "sensor.house_l2_power", state: "1000" },
  { entity_id: "sensor.house_l3_power", state: "800" },

  // PV 4200 W – Haus 3000 W → Einspeisung 1200 W
  { entity_id: "sensor.grid_l1_power", state: "-200" },
  { entity_id: "sensor.grid_l2_power", state: "-400" },
  { entity_id: "sensor.grid_l3_power", state: "-600" }
];

// Lookup: entity_id → State
const states: Record<string, HaState> = Object.fromEntries(
  statesList.map((s) => [s.entity_id, s])
);

async function main() {
  /**
   * 3) EnergyFrame bauen
   */
  const frame = buildEnergyFrameFromHa(mapping, states, 1000);

  /**
   * DEBUG: Power pro Node
   */
  console.log("DEBUG power totals:");
  for (const n of frame.nodes) {
    console.log(`- ${n.id}: ${n.power_total_w} W`);
  }

  /**
   * 4) Validieren
   */
  const check = validateEnergyFrame(frame);

  /**
   * 5) Output
   */
  console.log("EnergyFrame:");
  console.log(JSON.stringify(frame, null, 2));

  console.log("Validation:", check);

  if (!check.valid) {
    throw new Error(
      `EnergyFrame invalid (imbalance ${check.imbalance_w} W)`
    );
  }

  console.log("✅ EnergyFrame valid");
}

main().catch((err) => {
  console.error("❌ Fatal error:");
  console.error(err instanceof Error ? err.stack : err);
  process.exit(1);
});
