import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-500",
    secondary:
      "border border-white/15 bg-white/5 text-white hover:bg-white/10",
    ghost:
      "bg-transparent text-zinc-300 hover:bg-white/10 hover:text-white",
    danger:
      "bg-red-800 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`
        rounded-xl px-4 py-2 text-sm font-semibold transition
        disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    />
  );
}