export type GameState = {
  coins: number;
  rebirths: number;
  totalClicks: number;
  upgrades: Record<string, number>;
  airdrops_collected: number;
  lucky_event_triggered: boolean;
};

export enum ActionType {
  AddCoins = "ADD_COINS",
  RemoveCoins = "REMOVE_COINS",
  AddClick = "ADD_CLICK",
  BuyUpgrade = "BUY_UPGRADE",
  BuyUpgradeBulk = "BUY_UPGRADE_BULK",
  AddRebirth = "ADD_REBIRTH",
  CollectAirdrop = "COLLECT_AIRDROP",
  TriggerLuckyEvent = "TRIGGER_LUCKY_EVENT",
  ResetGame = "RESET_GAME",
  ResetProgress = "RESET_PROGRESS",
}

type ActionMap = {
  [ActionType.AddCoins]: { amount: number };
  [ActionType.RemoveCoins]: { amount: number };
  [ActionType.AddClick]: undefined;
  [ActionType.BuyUpgrade]: { upgradeId: string; cost: number };
  [ActionType.BuyUpgradeBulk]: { upgradeId: string; amount: number; totalCost: number };
  [ActionType.AddRebirth]: undefined;
  [ActionType.CollectAirdrop]: { amount: number };
  [ActionType.TriggerLuckyEvent]: undefined;
  [ActionType.ResetGame]: undefined;
  [ActionType.ResetProgress]: undefined;
};

export type Action = {
  [Key in keyof ActionMap]: {
    type: Key;
    payload: ActionMap[Key];
  };
}[keyof ActionMap];

export const initialGameState: GameState = {
  coins: 0,
  rebirths: 0,
  totalClicks: 0,
  upgrades: {},
  airdrops_collected: 0,
  lucky_event_triggered: false,
};

export const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case ActionType.AddCoins:
      return { ...state, coins: state.coins + action.payload.amount };

    case ActionType.RemoveCoins:
      return { ...state, coins: Math.max(0, state.coins - action.payload.amount) };

    case ActionType.AddClick:
      return { ...state, totalClicks: state.totalClicks + 1 };

    case ActionType.BuyUpgrade: {
      const { upgradeId, cost } = action.payload;
      if (state.coins < cost) return state;

      const currentLevel = state.upgrades[upgradeId] || 0;
      return {
        ...state,
        coins: state.coins - cost,
        upgrades: {
          ...state.upgrades,
          [upgradeId]: currentLevel + 1,
        },
      };
    }

    case ActionType.BuyUpgradeBulk: {
      const { upgradeId, amount, totalCost } = action.payload;
      if (state.coins < totalCost) return state;

      const currentLevel = state.upgrades[upgradeId] || 0;
      return {
        ...state,
        coins: state.coins - totalCost,
        upgrades: {
          ...state.upgrades,
          [upgradeId]: currentLevel + amount,
        },
      };
    }

    case ActionType.CollectAirdrop:
      return {
        ...state,
        airdrops_collected: state.airdrops_collected + 1,
        coins: state.coins + action.payload.amount,
      };

    case ActionType.TriggerLuckyEvent:
      return { ...state, lucky_event_triggered: true };

    case ActionType.AddRebirth:
      return { ...state, rebirths: state.rebirths + 1 };

    case ActionType.ResetProgress:
      return {
        ...state,
        coins: 0,
        upgrades: {},
        airdrops_collected: 0,
      };

    case ActionType.ResetGame:
      return initialGameState;

    default:
      return state;
  }
};
