import { Phase } from "../../model/Phase.ts";
import { EnergyNodeType } from "../../model/NodeType.ts";

export type HaPhaseMapping = {
  phase: Phase;
  entity_id: string;
  factor?: number; // z.B. -1 für Vorzeichenkorrektur
};

export type HaNodeMapping = {
  id: string;
  type: EnergyNodeType;
  label?: string;

  phases: HaPhaseMapping[];

  power_total_entity?: string;

  soc_entity?: string;
  capacity_kwh?: number;
};

export type HaEnergyMapping = {
  nodes: HaNodeMapping[];
};
