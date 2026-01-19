import { Phase } from "./Phase.js";
import { EnergyNodeType } from "./NodeType.js";

export type PhasePower = {
  power_w: number;
};

export type EnergyNode = {
  id: string;
  type: EnergyNodeType;
  label?: string;

  phases: Record<Phase, PhasePower>;

  power_total_w: number;

  energy_today_kwh?: number;

  state_of_charge?: number;
  capacity_kwh?: number;

  meta?: Record<string, any>;
};
