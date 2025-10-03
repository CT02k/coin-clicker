import { GameState } from "../types/gameReducer";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  achieved: boolean;
  condition: (state: GameState) => boolean;
};
