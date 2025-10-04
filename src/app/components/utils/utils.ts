import { GameState } from "../types/gameReducer";
import { upgrades } from "./upgradesConfig";

export function calculateClickGain(state: GameState, auto = false): number {
  const base = 1;
  let bonus = 0;
  let multiplier = 1;
  let chance = 0;

  for (const key in upgrades) {
    const effects = upgrades[key].getEffects(state);
    effects.forEach((e) => {
      if (e.target === "click") {
        if (e.type === "additive") bonus += e.value;
        if (e.type === "multiplier") multiplier *= e.value;
        if (e.type === "chance") chance += e.value;
      } else if (e.target === "autoclicker" && auto) {
        if (e.type === "additive") bonus += e.value - 1;
      }
    });
  }

  if (state.rebirths > 0) multiplier *= state.rebirths + 1;

  let gain = (base + bonus) * multiplier;

  if (Math.random() < chance) {
    gain *= 2.5;
  }

  return auto ? (upgrades.autoClicker.getLevel(state) === 0 ? 0 : gain) : gain;
}

export function getNextRebirthCost(state: GameState): number {
  const run = state.rebirths || 0;
  return 100_000 * (run + 1) ** 2;
}

export const formatNumber = (num: number) => {
  const suffixes = [
    "",
    "K",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "Oc",
    "No",
    "Dc",
    "Ud",
    "Dd",
    "Td",
    "Qad",
    "Qid",
    "Sxd",
    "Spd",
    "Ocd",
    "Nod",
  ];
  let i = 0;
  while (num >= 1000 && i < suffixes.length - 1) {
    num /= 1000;
    i++;
  }
  return num.toFixed(1) + suffixes[i];
};
