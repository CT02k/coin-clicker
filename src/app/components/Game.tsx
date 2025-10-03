import Terminal from "./Terminal";
import CoinClicker from "./CoinClicker";
import Store from "./Store";
import Navigation from "./Navigation";
import { useGameState } from "./utils/hooks";
import { useTab } from "./utils/hooks";
import { AchievementActionType, useAchievements } from "./Achievement";

import AchievementToast from "./AchievementToast";
import { useEffect, useState } from "react";

export default function Game() {
  const [state, dispatch] = useGameState();
  const [tab, setTab] = useTab("clicker");
  const { state: achState, dispatch: achDispatch } = useAchievements();

  const [toasts, setToasts] = useState<{ id: string; title: string; desc: string }[]>([]);

  useEffect(() => {
    achState.achievements.forEach((ach) => {
      if (!ach.achieved && ach.condition(state)) {
        achDispatch({ type: AchievementActionType.UNLOCK, id: ach.id });
        setToasts((prev) => [...prev, { id: ach.id, title: ach.title, desc: ach.description }]);
      }
    });
  }, [state, achState.achievements, achDispatch]);

  return (
    <main className="flex flex-col items-center justify-between h-screen p-4 relative select-none">
      <Terminal dispatch={dispatch} />
      <h1 className="text-3xl font-bold mb-4">Coin Clicker</h1>
      {tab === "clicker" ? (
        <CoinClicker state={state} dispatch={dispatch} />
      ) : (
        <Store state={state} dispatch={dispatch} />
      )}
      <Navigation tab={tab} state={state} dispatch={dispatch} setTab={setTab} />

      {toasts.map((toast) => (
        <AchievementToast
          key={toast.id}
          title={toast.title}
          description={toast.desc}
          duration={3000}
        />
      ))}
    </main>
  );
}
