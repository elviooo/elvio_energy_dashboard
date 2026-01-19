import { EnergyNode } from "./EnergyNode.js";

export type EnergyFrame = {
  version: "1.0";
  timestamp: string;
  interval_ms: number;
  nodes: EnergyNode[];
};
