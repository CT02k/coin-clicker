import { GameState, Action } from "../components/types/gameReducer";

type Props = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

export default function Stats({ state }: Props) {
  return (
    <div className="stats flex flex-col justify-center items-center gap-6 p-6">
      <h2 className="text-2xl font-bold">Game Stats</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard label="Coins" value={state.coins.toLocaleString()} />
        <StatCard label="Rebirths" value={state.rebirths} />
        <StatCard label="Airdrops Collected" value={state.airdrops_collected} />
        <StatCard
          label="Total Upgrades"
          value={Object.values(state.upgrades || {}).reduce((sum, v) => sum + v, 0)}
        />
        <StatCard label="Total Clicks" value={state.totalClicks} />
        {state.lucky_event_triggered && <StatCard label="One in a Million" value="Yes 🎉" />}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 w-40 border border-zinc-400 flex flex-col items-center bg-zinc-200">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}
