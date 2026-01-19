import { EnergyFrame } from "../../model/EnergyFrame.js";
import { HaEnergyMapping } from "./HaMapping.js";
import { HaState } from "./HaState.js";
import { normalizeHaNode } from "./HaNormalizer.js";

export function buildEnergyFrameFromHa(
  mapping: HaEnergyMapping,
  states: Record<string, HaState>,
  interval_ms = 1000
): EnergyFrame {
  const nodes = mapping.nodes.map((n) =>
    normalizeHaNode(n, states)
  );

  return {
    version: "1.0",
    timestamp: new Date().toISOString(),
    interval_ms,
    nodes,
  };
}
