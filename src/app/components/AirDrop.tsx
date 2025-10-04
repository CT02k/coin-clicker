import { useEffect, useState } from "react";
import Image from "next/image";
import { GameState, Action, ActionType } from "./types/gameReducer";

type Props = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

type Drop = {
  id: number;
  left: number;
  top: number;
};

export default function AirdropSystem({ state, dispatch }: Props) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const baseInterval = 10000;
    const speedUpgrade = state.upgrades.airdropSpeed || 0;
    const speedMultiplier = 1 - Math.min(speedUpgrade * 0.05, 0.75);
    const interval = baseInterval * speedMultiplier;

    const chance = Math.min((state.upgrades.airdropChance || 0) * 0.02, 0.5);

    const spawnDrop = () => {
      const newDrop = {
        id: counter,
        left: Math.random() * 80,
        top: 0,
      };
      setDrops((prev) => [...prev, newDrop]);
      setCounter((c) => c + 1);

      setTimeout(() => {
        setDrops((prev) => prev.filter((d) => d.id !== newDrop.id));
      }, interval);
    };

    const timer = setInterval(() => {
      if (Math.random() < chance) spawnDrop();
    }, interval);

    return () => clearInterval(timer);
  }, [state.upgrades.airdropChance, state.upgrades.airdropSpeed, counter]);

  const handleClick = (id: number) => {
    setDrops((prev) => prev.filter((drop) => drop.id !== id));

    const baseAmount = 50;
    const dropValueMultiplier = 1 + (state.upgrades.extraDropValue || 0) * 0.1;

    dispatch({
      type: ActionType.CollectAirdrop,
      payload: {
        amount: Math.floor(baseAmount * dropValueMultiplier),
      },
    });
  };

  return (
    <div className="absolute w-full h-full">
      {drops.map((drop) => (
        <Image
          key={drop.id}
          src="/coin.png"
          height={100}
          width={100}
          alt="Airdrop"
          className="absolute w-12 h-12 cursor-pointer animate-fall z-40"
          style={{
            left: `${drop.left}%`,
            top: `${drop.top}%`,
          }}
          onClick={() => handleClick(drop.id)}
        />
      ))}
    </div>
  );
}
