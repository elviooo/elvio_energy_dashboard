import { EnergyNode } from "../../model/EnergyNode.js";
import { Phase } from "../../model/Phase.js";
import { HaNodeMapping } from "./HaMapping.js";
import { HaState } from "./HaState.js";

function getStateValue(
  states: Record<string, HaState>,
  entity_id?: string
): number {
  if (!entity_id) return 0;
  const s = states[entity_id];
  if (!s) return 0;
  const v = parseFloat(s.state);
  return isNaN(v) ? 0 : v;
}

export function normalizeHaNode(
  mapping: HaNodeMapping,
  states: Record<string, HaState>
): EnergyNode {
  const phases: Record<Phase, { power_w: number }> = {
    L1: { power_w: 0 },
    L2: { power_w: 0 },
    L3: { power_w: 0 },
  };

  for (const p of mapping.phases) {
    const raw = getStateValue(states, p.entity_id);
    const factor = p.factor ?? 1;
    phases[p.phase].power_w = raw * factor;
  }

  const power_total =
    mapping.power_total_entity
      ? getStateValue(states, mapping.power_total_entity)
      : Object.values(phases).reduce((a, p) => a + p.power_w, 0);

  return {
    id: mapping.id,
    type: mapping.type,
    label: mapping.label,
    phases,
    power_total_w: power_total,
    state_of_charge: mapping.soc_entity
      ? getStateValue(states, mapping.soc_entity)
      : undefined,
    capacity_kwh: mapping.capacity_kwh,
  };
}
