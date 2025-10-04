import { useEffect, useState } from "react";

type Props = {
  title: string;
  description: string;
  duration?: number;
};

export default function AchievementToast({ title, description, duration = 3000 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      className={`
        fixed left-1/2 transform -translate-x-1/2 
        bg-zinc-300 border border-zinc-400 text-black p-4 rounded shadow-lg 
        transition-all duration-500 ease-in-out
        ${visible ? "top-10 opacity-100" : "-top-20 opacity-0"}
        z-50
      `}
    >
      <h4 className="font-bold">{title}</h4>
      <p>{description}</p>
    </div>
  );
}
