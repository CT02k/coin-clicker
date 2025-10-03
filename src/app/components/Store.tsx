import { upgrades } from "./utils/upgradesConfig";
import UpgradeCard from "./UpgradeCard";
import { GameState, Action } from "./types/gameReducer";

type Props = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

export default function Store({ state, dispatch }: Props) {
  return (
    <div className="store flex flex-col justify-center items-center gap-4">
      <div className="flex flex-wrap px-64 py-16 gap-4 h-2/3 overflow-y-scroll">
        {Object.entries(upgrades).map(([key, config]) => (
          <UpgradeCard key={key} id={key} config={config} state={state} dispatch={dispatch} />
        ))}
      </div>
    </div>
  );
}
