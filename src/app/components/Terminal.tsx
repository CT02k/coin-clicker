import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import TerminalIcon from "@/../public/terminal.png";
import { Action, ActionType } from "./types/gameReducer";

type SubCommand = {
  name: string;
  description: string;
  run: (args: string[], log: (msg: string) => void, dispatch: React.Dispatch<Action>) => void;
};

type Command = {
  name: string;
  description: string;
  subcommands?: SubCommand[];
  run?: (args: string[], log: (msg: string) => void, dispatch: React.Dispatch<Action>) => void;
};

const commands: Command[] = [
  {
    name: "coins",
    description: "Manage coins",
    subcommands: [
      {
        name: "add",
        description: "Add coins. Example: coins add 1000",
        run: (args, log, dispatch) => {
          const amount = parseInt(args[0]);
          if (!isNaN(amount)) {
            dispatch({
              type: ActionType.AddCoins,
              payload: {
                amount,
              },
            });
            log(`✔ Added ${amount} coins`);
          } else {
            log("✖ Invalid amount. Usage: coins add <amount>");
          }
        },
      },
      {
        name: "remove",
        description: "Remove coins",
        run: (args, log, dispatch) => {
          const amount = parseInt(args[0]);
          if (!isNaN(amount)) {
            dispatch({
              type: ActionType.RemoveCoins,
              payload: {
                amount,
              },
            });
            log(`✔ Removed ${amount} coins`);
          } else {
            log("✖ Invalid amount. Usage: coins remove <amount>");
          }
        },
      },
      {
        name: "reset",
        description: "Reset coins. Example: coins reset",
        run: (args, log, dispatch) => {
          dispatch({ type: ActionType.ResetProgress, payload: undefined });
        },
      },
    ],
  },
  {
    name: "reset",
    description: "Reset the game",
    run: (args, log, dispatch) => {
      dispatch({ type: ActionType.ResetGame, payload: undefined });
    },
  },
  {
    name: "clear",
    description: "Clear the terminal",
    run: (_, log) => log("__CLEAR__"),
  },
  {
    name: "help",
    description: "Show all available commands",
    run: (_, log) =>
      commands.forEach((cmd) => {
        log(cmd.name + " - " + cmd.description);
        cmd.subcommands?.forEach((sub) => log(`  ${sub.name} - ${sub.description}`));
      }),
  },
];

type TerminalProps = {
  dispatch: React.Dispatch<Action>;
};

export default function Terminal({ dispatch }: TerminalProps) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    ` ██████╗ ██████╗ ██╗███╗   ██╗     ██████╗██╗     ██╗ ██████╗██╗  ██╗███████╗██████╗ 
██╔════╝██╔═══██╗██║████╗  ██║    ██╔════╝██║     ██║██╔════╝██║ ██╔╝██╔════╝██╔══██╗
██║     ██║   ██║██║██╔██╗ ██║    ██║     ██║     ██║██║     █████╔╝ █████╗  ██████╔╝
██║     ██║   ██║██║██║╚██╗██║    ██║     ██║     ██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
╚██████╗╚██████╔╝██║██║ ╚████║    ╚██████╗███████╗██║╚██████╗██║  ██╗███████╗██║  ██║
 ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝     ╚═════╝╚══════╝╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
                                                                                     `,
  ]);
  const [input, setInput] = useState("");
  const [pos, setPos] = useState({ x: 50, y: 300 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const logsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [suggestion, setSuggestion] = useState<string>("");

  const [history, setHistory] = useState<string[]>([]);
  const [, setHistoryPlace] = useState(-1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "'") {
        setOpen((prev) => !prev);
        setMinimized(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus();
  }, [open, minimized]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };
  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragging) setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  const runCommand = (line: string) => {
    const parts = line.trim().split(" ");
    const cmdName = parts[0];
    const subName = parts[1];
    const args = parts.slice(subName ? 2 : 1);

    setHistory((prev) => [line, ...prev]);

    const command = commands.find((c) => c.name === cmdName);
    if (!command) return setLogs((prev) => [...prev, `${cmdName}: command not found`]);

    if (command.subcommands && subName) {
      const sub = command.subcommands.find((s) => s.name === subName);
      if (sub) {
        sub.run(
          args,
          (msg) => (msg === "__CLEAR__" ? setLogs([]) : setLogs((prev) => [...prev, msg])),
          dispatch,
        );
      } else {
        setLogs((prev) => [...prev, `${subName}: subcommand not found`]);
      }
    } else if (command.run) {
      command.run(
        args,
        (msg) => (msg === "__CLEAR__" ? setLogs([]) : setLogs((prev) => [...prev, msg])),
        dispatch,
      );
    } else {
      setLogs((prev) => [...prev, `${cmdName}: missing subcommand`]);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (!value) {
      setSuggestion("");
      return;
    }

    const parts = value.split(" ");
    const cmdPart = parts[0];
    const subPart = parts[1];

    if (parts.length === 1) {
      const matches = commands.map((c) => c.name).filter((n) => n.startsWith(cmdPart));
      setSuggestion(matches[0]?.slice(cmdPart.length) || "");
    } else if (parts.length === 2) {
      const command = commands.find((c) => c.name === cmdPart);
      if (command?.subcommands) {
        const matches = command.subcommands.map((s) => s.name).filter((n) => n.startsWith(subPart));
        setSuggestion(matches[0]?.slice(subPart.length) || "");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestion) {
        setInput((prev) => prev + suggestion);
        setSuggestion("");
      }
    }
    if (e.key === "ArrowRight") {
      if (suggestion) {
        setInput((prev) => prev + suggestion);
        setSuggestion("");
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        setHistoryPlace((prev) => {
          const next = Math.min(prev + 1, history.length - 1);
          setInput(history[next]);
          return next;
        });
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length > 0) {
        setHistoryPlace((prev) => {
          const next = Math.max(prev - 1, 0);
          setInput(history[next]);
          return next;
        });
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className={`bg-zinc-900 fixed text-white shadow-lg border border-zinc-700 flex flex-col font-mono ${
        minimized ? "w-48 h-10 absolute rounded-tl-lg" : "rounded-lg w-[600px] h-[300px]"
      }`}
      style={
        minimized
          ? { right: -1, bottom: 0, zIndex: 9999 }
          : { top: pos.y, left: pos.x, zIndex: 9999 }
      }
    >
      <div
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-t-lg relative select-none"
        onMouseDown={onMouseDown}
      >
        <div className="flex gap-2">
          <button
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
            onClick={() => setOpen(false)}
          />
          <button
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
            onClick={() => setMinimized((m) => !m)}
          />
          <button
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"
            onClick={() => setPos({ x: 50, y: 50 })}
          />
        </div>
        <span className="text-xs opacity-60 absolute flex gap-2 left-1/2 w-fit right-1/2 -translate-x-1/2">
          <Image src={TerminalIcon} width={16} height={16} alt="Terminal Icon" /> Terminal
        </span>
      </div>

      {!minimized && (
        <>
          <div className="flex flex-col h-full justify-end overflow-y-auto p-2 font-mono text-sm">
            {logs.map((line, i) => (
              <div key={i} className="whitespace-pre text-xs">
                {line}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
          <div className="relative p-2 flex items-center gap-2 font-mono text-xs">
            <span>dev@clicker:~# </span>
            <form
              className="relative flex-1 text-xs"
              onSubmit={(e) => {
                e.preventDefault();
                if (!input.trim()) return;
                setLogs((prev) => [...prev, `dev@clicker:~# ${input}`]);
                runCommand(input);
                setInput("");
              }}
            >
              <input
                ref={inputRef}
                className="flex-1 bg-transparent outline-none font-mono text-xs"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {suggestion && (
                <div className="absolute top-0 left-0 pointer-events-none text-zinc-500 -z-[1] font-mono text-xs">
                  {input}
                  {suggestion}
                </div>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
}
