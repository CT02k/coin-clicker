import { useReducer, useEffect } from "react";
import { ActionType, initialGameState, gameReducer } from "../types/gameReducer";
import { calculateClickGain } from "./utils";

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState, () => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("clickerGame") : null;
    return saved ? JSON.parse(saved) : initialGameState;
  });

  useEffect(() => localStorage.setItem("clickerGame", JSON.stringify(state)), [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      const cps = calculateClickGain(state, true);
      if (cps > 0) dispatch({ type: ActionType.AddCoins, payload: { amount: cps } });
    }, 1000);
    return () => clearInterval(interval);
  });

  return [state, dispatch] as const;
}

export const useTab = (initial: "clicker" | "store") =>
  useReducer((_, newTab: "clicker" | "store") => newTab, initial);
