import Image from "next/image";
import Coin from "@/../public/coin.png";
import { calculateClickGain, formatNumber } from "../components/utils/utils";
import { GameState, Action, ActionType } from "../components/types/gameReducer";

type Props = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

import { useState, useEffect } from "react";
import AirdropSystem from "../components/AirDrop";

export default function CoinClicker({ state, dispatch }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleCoinClick = () => {
    dispatch({
      type: ActionType.AddCoins,
      payload: {
        amount: calculateClickGain(state),
      },
    });

    dispatch({
      type: ActionType.AddClick,
      payload: undefined,
    });

    const isLucky = Math.random() < 0.000001;
    if (isLucky) {
      dispatch({ type: ActionType.TriggerLuckyEvent, payload: undefined });
      dispatch({ type: ActionType.AddCoins, payload: { amount: 1000000 } });
    }
  };

  if (!mounted) return null;

  return (
    <div className="clicker flex flex-col items-center justify-center">
      <AirdropSystem state={state} dispatch={dispatch} />
      <div className="relative">
        <Image
          src={Coin}
          height={256}
          width={256}
          alt="Coin"
          className="scale-100 active:scale-90 cursor-pointer transition"
          onClick={handleCoinClick}
        />
        <div className="text-2xl justify-center w-full flex gap-2 mt-5 px-5 py-2 border border-zinc-400 rounded-full">
          <Image src={Coin} height={32} width={32} alt="Coin" />
          {formatNumber(state.coins)}
        </div>
      </div>
    </div>
  );
}
