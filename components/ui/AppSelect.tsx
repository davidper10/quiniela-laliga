"use client";

import { useEffect, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
  description?: string;
  avatarUrl?: string | null;
};

export default function AppSelect({
  value,
  options,
  onChange,
  placeholder = "Seleccionar",
}: {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-black px-4 py-3 text-left font-bold text-white outline-none transition hover:border-red-500"
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <span className="ml-3 text-zinc-500">⌄</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-2 shadow-2xl">
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                  active
                    ? "bg-red-600/20 text-white"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-red-600 text-xs font-black text-white">
                  {option.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={option.avatarUrl}
                      alt={option.label}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    option.label[0]?.toUpperCase()
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold">
                    {option.label}
                  </span>

                  {option.description && (
                    <span className="block truncate text-xs text-zinc-500">
                      {option.description}
                    </span>
                  )}
                </span>

                {active && <span className="text-red-400">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}