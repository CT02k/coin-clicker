"use client";
import Game from "./components/Game";
import { AchievementProvider } from "./components/lib/Achievement";

export default function Page() {
  return (
    <AchievementProvider>
      <Game />
    </AchievementProvider>
  );
}
