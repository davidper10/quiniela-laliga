import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`
        rounded-xl border border-white/15 bg-black px-3 py-2 text-white
        outline-none transition placeholder:text-zinc-500
        focus:border-red-500
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
}