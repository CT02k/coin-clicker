import { AchievementActionType, useAchievements } from "./Achievement";
import { useGameState } from "./utils/hooks";

export default function Test() {
  const { state: achState, dispatch: achDispatch } = useAchievements();
  const [state] = useGameState();

  return (
    state.upgrades &&
    achState.achievements.forEach((ach) => {
      if (!ach.achieved && ach.condition(state)) {
        achDispatch({ type: AchievementActionType.UNLOCK, id: ach.id });
        alert("para bens");
      }
    })
  );
}
