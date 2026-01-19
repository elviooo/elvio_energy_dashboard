import type { EnergyFrame } from "../model/EnergyFrame.js";

export type EnergyFrameValidationResult = {
  valid: boolean;
  imbalance_w: number;
  tolerance_w: number;
};

/**
 * Validiert einen EnergyFrame anhand der Energiebilanz.
 *
 * Regel:
 *   Summe aller power_total_w ≈ 0
 *
 * Positive Leistung  = Energie fließt INS System
 * Negative Leistung  = Energie fließt AUS dem System
 */
export function validateEnergyFrame(
  frame: EnergyFrame,
  tolerance_w = 50
): EnergyFrameValidationResult {
  if (!frame || !Array.isArray(frame.nodes)) {
    return {
      valid: false,
      imbalance_w: NaN,
      tolerance_w
    };
  }

  const imbalance = frame.nodes.reduce((sum, node) => {
    if (typeof node.power_total_w !== "number") {
      return sum;
    }
    return sum + node.power_total_w;
  }, 0);

  return {
    valid: Math.abs(imbalance) <= tolerance_w,
    imbalance_w: Math.round(imbalance),
    tolerance_w
  };
}
