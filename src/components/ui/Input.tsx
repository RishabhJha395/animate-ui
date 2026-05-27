import { forwardRef } from "react";
import { cn } from "../../lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-xl border border-white/10 bg-white/[0.055] px-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-400/60 focus:bg-white/[0.08]",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";
