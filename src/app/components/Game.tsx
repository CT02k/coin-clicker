import Terminal from "./Terminal";
import CoinClicker from "../tabs/CoinClicker";
import Store from "../tabs/Store";
import Navigation, { Tabs } from "./Navigation";
import { useGameState } from "./utils/hooks";
import { useTab } from "./utils/hooks";
import { AchievementActionType, useAchievements } from "./lib/Achievement";

import AchievementToast from "./lib/AchievementToast";
import { useEffect, useState } from "react";
import Achievements from "../tabs/Achievements";
import Stats from "../tabs/Stats";

export default function Game() {
  const [state, dispatch] = useGameState();
  const [tab, setTab] = useTab(Tabs.Clicker);
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
      {
        {
          clicker: <CoinClicker state={state} dispatch={dispatch} />,
          store: <Store state={state} dispatch={dispatch} />,
          achievements: <Achievements />,
          stats: <Stats state={state} dispatch={dispatch} />,
        }[tab]
      }
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
