import { GameState, Action } from "../components/types/gameReducer";

type Props = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

export default function Store({ state, dispatch }: Props) {
  return <div className="stats flex flex-col justify-center items-center gap-4"></div>;
}
