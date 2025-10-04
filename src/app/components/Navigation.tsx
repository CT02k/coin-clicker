import { ChartArea, Home, Medal, Store as StoreIcon } from "lucide-react";
import { Action, ActionType, GameState } from "./types/gameReducer";
import { formatNumber, getNextRebirthCost } from "./utils/utils";

const buttonClip = `polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%)`;

const tabButtonClass = (active: boolean) =>
  `${
    active ? "bg-zinc-900 hover:bg-zinc-950" : "bg-zinc-700 hover:bg-zinc-800"
  } text-white w-12 h-12 flex items-center justify-center transition`;

export enum Tabs {
  Clicker = "clicker",
  Store = "store",
  Achievements = "achievements",
  Stats = "stats",
}

type Props = {
  tab: Tabs;
  setTab: React.Dispatch<Tabs>;
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

export default function Navigation({ tab, setTab, state, dispatch }: Props) {
  const rebirthCost = getNextRebirthCost(state);

  const handleRebirthClick = () => {
    if (state.coins < rebirthCost) {
      console.log("Not enough coins for rebirth!");
      return;
    }

    dispatch({ type: ActionType.RemoveCoins, payload: { amount: rebirthCost } });
    dispatch({ type: ActionType.AddRebirth, payload: undefined });
    dispatch({ type: ActionType.ResetProgress, payload: undefined });
  };

  return (
    <nav className="flex gap-4 px-6 py-2.5 rounded-lg mb-10">
      {state.coins >= rebirthCost && (
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 transition"
          style={{ clipPath: buttonClip }}
          onClick={handleRebirthClick}
        >
          Rebirth ({formatNumber(rebirthCost)} coins)
        </button>
      )}

      <button
        className={tabButtonClass(tab === Tabs.Clicker)}
        style={{ clipPath: buttonClip }}
        onClick={() => setTab(Tabs.Clicker)}
      >
        <Home />
      </button>

      <button
        className={tabButtonClass(tab === Tabs.Store)}
        style={{ clipPath: buttonClip }}
        onClick={() => setTab(Tabs.Store)}
      >
        <StoreIcon />
      </button>

      <button
        className={tabButtonClass(tab === Tabs.Achievements)}
        style={{ clipPath: buttonClip }}
        onClick={() => setTab(Tabs.Achievements)}
      >
        <Medal />
      </button>

      <button
        className={tabButtonClass(tab === Tabs.Stats)}
        style={{ clipPath: buttonClip }}
        onClick={() => setTab(Tabs.Stats)}
      >
        <ChartArea />
      </button>
    </nav>
  );
}
