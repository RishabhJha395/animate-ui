import { forwardRef } from "react";
import { cn } from "../../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400/70 disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" &&
            "bg-gradient-to-r from-cyan-400 to-violet-500 text-white shadow-glow hover:brightness-110",
          variant === "secondary" &&
            "border border-white/10 bg-white/[0.07] text-white hover:bg-white/[0.11]",
          variant === "ghost" && "text-zinc-300 hover:bg-white/[0.07] hover:text-white",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
