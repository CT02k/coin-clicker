import { GameState } from "../types/gameReducer";

export enum UpgradeEffectType {
  Additive = "additive",
  Multiplier = "multiplier",
  Chance = "chance",
  Special = "special",
}

export type UpgradeEffect = {
  target: "click" | "autoclicker" | "airdrop";
  type: UpgradeEffectType;
  value: number;
};

export type UpgradeConfig = {
  title: string;
  description: string;
  baseCost: number;
  costIncrement: number;
  maxLevel?: number;
  getLevel: (state: GameState) => number;
  getEffects: (state: GameState) => UpgradeEffect[];
};

export const upgrades: Record<string, UpgradeConfig> = {
  autoClicker: {
    title: "Auto Clicker",
    description: "Generates coins automatically every second.",
    baseCost: 10,
    costIncrement: 10,
    getLevel: (state) => state.upgrades.autoClicker || 0,
    getEffects(state) {
      const level = state.upgrades.autoClicker || 0;
      return [
        {
          target: "autoclicker",
          type: UpgradeEffectType.Additive,
          value: level * 1,
        },
      ];
    },
  },
  luckyCoins: {
    title: "Lucky Coins",
    description: "Chance to trigger a critical click.",
    baseCost: 150,
    maxLevel: 10,
    costIncrement: 200,
    getLevel: (state) => state.upgrades.luckyCoins || 0,
    getEffects(state) {
      const level = state.upgrades.luckyCoins || 0;
      return [
        {
          target: "click",
          type: UpgradeEffectType.Chance,
          value: Math.min(level * 0.05, 0.5),
        },
      ];
    },
  },
  clickPower: {
    title: "Click Power",
    description: "Increase the amount of coins gained per click.",
    baseCost: 50,
    costIncrement: 50,
    getLevel: (state: GameState) => state.upgrades.clickPower || 0,
    getEffects(state: GameState) {
      const level = state.upgrades.clickPower || 0;
      return [
        {
          target: "click",
          type: UpgradeEffectType.Additive,
          value: level,
        },
      ];
    },
  },
  airdropChance: {
    title: "Airdrop Chance",
    description: "Increase the chance of an airdrop appearing.",
    baseCost: 200,
    costIncrement: 250,
    maxLevel: 20,
    getLevel: (state) => state.upgrades.airdropChance || 0,
    getEffects(state) {
      const level = state.upgrades.airdropChance || 0;
      return [
        {
          target: "airdrop",
          type: UpgradeEffectType.Chance,
          value: Math.min(level * 0.02, 0.5),
        },
      ];
    },
  },
  airdropSpeed: {
    title: "Airdrop Speed",
    description: "Decrease cooldown between airdrops.",
    baseCost: 300,
    costIncrement: 300,
    maxLevel: 15,
    getLevel: (state) => state.upgrades.airdropSpeed || 0,
    getEffects(state) {
      const level = state.upgrades.airdropSpeed || 0;
      return [
        {
          target: "airdrop",
          type: UpgradeEffectType.Multiplier,
          value: 1 - Math.min(level * 0.05, 0.75),
        },
      ];
    },
  },
  extraDropValue: {
    title: "Extra Drop Value",
    description: "Increase the coins gained from airdrops.",
    baseCost: 250,
    costIncrement: 200,
    getLevel: (state) => state.upgrades.extraDropValue || 0,
    getEffects(state) {
      const level = state.upgrades.extraDropValue || 0;
      return [
        {
          target: "airdrop",
          type: UpgradeEffectType.Multiplier,
          value: 1 + level * 0.1,
        },
      ];
    },
  },
};
