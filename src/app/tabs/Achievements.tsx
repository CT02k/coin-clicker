"use client";
import { GameState, Action } from "../components/types/gameReducer";
import { useAchievements } from "../components/lib/Achievement";

type Props = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

export default function Achievements({ state }: Props) {
  const { state: achievementState } = useAchievements();

  return (
    <div className="achievements flex flex-col justify-center items-center gap-6 w-2/3">
      <div className="flex flex-wrap px-8 py-6 gap-4 max-h-[70vh] overflow-y-auto">
        {achievementState.achievements.map((ach) => {
          const unlocked = ach.condition(state);

          return (
            <div
              key={ach.id}
              className={`p-4 w-64 border transition ${
                unlocked ? "bg-zinc-200 border-zinc-400" : "bg-zinc-200 border-zinc-400 opacity-50"
              }`}
            >
              <h3 className="text-lg font-semibold">{ach.title}</h3>
              <p className="text-sm text-gray-700">{ach.description}</p>
              {unlocked ? "" : <span className="text-gray-500 text-sm">Locked</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
