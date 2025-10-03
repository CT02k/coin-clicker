import { GameState, Action, ActionType } from "./types/gameReducer";
import { UpgradeConfig, UpgradeEffectType } from "./utils/upgradesConfig";
import { useMemo } from "react";

type Props = {
  id: string;
  config: UpgradeConfig;
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

export default function UpgradeCard({ id, config, state, dispatch }: Props) {
  const level = config.getLevel(state);
  const reachedMax = config.maxLevel !== undefined && level >= config.maxLevel;

  const { cost, affordable, affordableAmount, totalBulkCost } = useMemo(() => {
    if (reachedMax) {
      return { cost: 0, affordable: false, affordableAmount: 0, totalBulkCost: 0 };
    }

    const cost = config.baseCost + config.costIncrement * level;
    const affordable = state.coins >= cost;

    let affordableAmount = 0;
    let totalBulkCost = 0;

    if (config.costIncrement === 0) {
      affordableAmount = Math.min(
        config.maxLevel ? config.maxLevel - level : Infinity,
        Math.floor(state.coins / cost),
      );
      totalBulkCost = affordableAmount * cost;
    } else {
      const maxPossible = config.maxLevel ? config.maxLevel - level : 1e9;

      let lo = 0,
        hi = maxPossible;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const firstCost = cost;
        const lastCost = cost + (mid - 1) * config.costIncrement;
        const totalCost = (mid * (firstCost + lastCost)) / 2;

        if (totalCost <= state.coins) {
          affordableAmount = mid;
          totalBulkCost = totalCost;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
    }

    return { cost, affordable, affordableAmount, totalBulkCost };
  }, [state.coins, config, level, reachedMax]);

  const effects = useMemo(
    () =>
      config
        .getEffects(state)
        .map((effect) => {
          switch (effect.type) {
            case UpgradeEffectType.Additive:
              return `+${effect.value} ${effect.target}`;
            case UpgradeEffectType.Multiplier:
              return `x${effect.value} ${effect.target}`;
            case UpgradeEffectType.Chance:
              return `${(effect.value * 100).toFixed(0)}% chance ${effect.target}`;
            default:
              return "";
          }
        })
        .filter(Boolean)
        .join(", "),
    [state, config],
  );

  return (
    <div className="product-card flex flex-col justify-between w-72 h-72 border border-zinc-400 overflow-hidden">
      <div className="high w-full flex items-center justify-center h-24 bg-zinc-400 relative contain-content">
        <h1 className="text-3xl font-black whitespace-nowrap z-10">{config.title}</h1>
        <h1 className="text-5xl font-black opacity-25 absolute top-0 whitespace-nowrap">
          {config.title}
        </h1>
        <h1 className="text-5xl font-black opacity-25 absolute bottom-0 whitespace-nowrap">
          {config.title}
        </h1>
      </div>

      <div className="info text-xl w-full flex flex-col items-center py-2">
        <p className="font-bold text-2xl">Lv. {level}</p>
        <p className="font-medium">{effects}</p>
        <p className="text-sm mx-2 text-center text-zinc-700">{config.description}</p>
      </div>

      <div className="flex flex-col">
        <button
          disabled={reachedMax}
          className={`${
            reachedMax
              ? "bg-zinc-800/50 cursor-not-allowed"
              : affordable
                ? "bg-zinc-700 hover:bg-zinc-700/95"
                : "bg-zinc-800/50"
          } text-white w-full py-2`}
          onClick={() =>
            affordable &&
            dispatch({
              type: ActionType.BuyUpgrade,
              payload: {
                upgradeId: id,
                cost,
              },
            })
          }
        >
          {reachedMax
            ? "Max Level Reached"
            : affordable
              ? level > 0
                ? `Upgrade (${cost} coins)`
                : `Buy (${cost} coins)`
              : `Insufficient coins (${cost} needed)`}
        </button>
        <button
          disabled={reachedMax || affordableAmount <= 0}
          className={`${
            reachedMax || affordableAmount <= 0
              ? "bg-zinc-800/50 cursor-not-allowed"
              : "bg-zinc-700 hover:bg-zinc-700/95"
          } text-white w-full py-2`}
          onClick={() => {
            if (affordableAmount > 0) {
              dispatch({
                type: ActionType.BuyUpgradeBulk,
                payload: {
                  upgradeId: id,
                  amount: affordableAmount,
                  totalCost: totalBulkCost,
                },
              });
            }
          }}
        >
          Buy All ({affordableAmount})
        </button>
      </div>
    </div>
  );
}
