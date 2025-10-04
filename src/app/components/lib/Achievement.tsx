"use client";
import { createContext, useContext, useEffect, useReducer } from "react";
import { Achievement } from "../types/achievements";
import { GameState } from "../types/gameReducer";

export const achievementsList: Achievement[] = [
  {
    id: "first_click",
    title: "First Click!",
    description: "You made your first click!",
    achieved: false,
    condition: (state: GameState) => state.coins >= 1,
  },
  {
    id: "airdrop_hunter",
    title: "Airdrop Hunter",
    description: "You collected your first airdrop!",
    achieved: false,
    condition: (state: GameState) => state.airdrops_collected >= 1,
  },

  // Coin Milestones
  {
    id: "rich",
    title: "Getting Rich!",
    description: "You have accumulated 100,000 coins!",
    achieved: false,
    condition: (state: GameState) => state.coins >= 100_000,
  },
  {
    id: "millionaire",
    title: "Millionaire",
    description: "Wow! You've reached 1,000,000 coins!",
    achieved: false,
    condition: (state: GameState) => state.coins >= 1_000_000,
  },
  {
    id: "billionaire",
    title: "Billionaire",
    description: "You are unstoppable! 1,000,000,000 coins!",
    achieved: false,
    condition: (state: GameState) => state.coins >= 1_000_000_000,
  },

  // Upgrade Milestones
  {
    id: "shopper",
    title: "Shopper",
    description: "You bought your first upgrade!",
    achieved: false,
    condition: (state: GameState) =>
      (state.upgrades && Object.values(state.upgrades).some((v) => v >= 1)) ?? false,
  },
  {
    id: "upgrade_enthusiast",
    title: "Upgrade Enthusiast",
    description: "You own 10 upgrades in total.",
    achieved: false,
    condition: (state: GameState) =>
      (state.upgrades && Object.values(state.upgrades).reduce((sum, v) => sum + v, 0) >= 10) ??
      false,
  },
  {
    id: "upgrade_master",
    title: "Upgrade Master",
    description: "You own 100 upgrades in total.",
    achieved: false,
    condition: (state: GameState) =>
      (state.upgrades && Object.values(state.upgrades).reduce((sum, v) => sum + v, 0) >= 100) ??
      false,
  },

  // Rebirth Milestones
  {
    id: "rebirth_beginner",
    title: "Rebirth Beginner",
    description: "You have performed your first rebirth!",
    achieved: false,
    condition: (state: GameState) => state.rebirths >= 1,
  },
  {
    id: "reborn_again",
    title: "Reborn Again",
    description: "You have performed 5 rebirths.",
    achieved: false,
    condition: (state: GameState) => state.rebirths >= 5,
  },
  {
    id: "cycle_of_life",
    title: "Cycle of Life",
    description: "You have performed 20 rebirths. A true veteran.",
    achieved: false,
    condition: (state: GameState) => state.rebirths >= 20,
  },

  {
    id: "one_in_a_million",
    title: "One in a Million",
    description: "There was a 0.0001% chance of this happening.",
    achieved: false,
    condition: (state: GameState) => state.lucky_event_triggered === true,
  },
];

export enum AchievementActionType {
  UNLOCK = "UNLOCK",
  LOAD_SAVED = "LOAD_SAVED",
}

type AchievementState = {
  achievements: Achievement[];
};

type AchievementAction =
  | { type: AchievementActionType.UNLOCK; id: string }
  | { type: AchievementActionType.LOAD_SAVED; payload: Achievement[] };

const initialGameState: AchievementState = {
  achievements: achievementsList,
};

const AchievementContext = createContext<{
  state: AchievementState;
  dispatch: React.Dispatch<AchievementAction>;
}>(null!);

function achievementReducer(state: AchievementState, action: AchievementAction): AchievementState {
  switch (action.type) {
    case AchievementActionType.UNLOCK:
      return {
        achievements: state.achievements.map((ach) =>
          ach.id === action.id ? { ...ach, achieved: true } : ach,
        ),
      };
    case AchievementActionType.LOAD_SAVED:
      const savedAchievementsMap = new Map(
        action.payload.map((savedAch) => [savedAch.id, savedAch]),
      );

      const hydratedAchievements = state.achievements.map((initialAch) => {
        const savedAch = savedAchievementsMap.get(initialAch.id);
        return savedAch ? { ...initialAch, achieved: savedAch.achieved } : initialAch;
      });

      return { achievements: hydratedAchievements };
    default:
      return state;
  }
}

export const AchievementProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(achievementReducer, initialGameState);

  useEffect(() => {
    const saved = localStorage.getItem("achievements");
    if (saved) {
      dispatch({ type: AchievementActionType.LOAD_SAVED, payload: JSON.parse(saved) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(state.achievements));
  }, [state.achievements]);

  return (
    <AchievementContext.Provider value={{ state, dispatch }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => useContext(AchievementContext);
