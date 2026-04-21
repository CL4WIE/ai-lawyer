import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-black/85 disabled:bg-subtle disabled:text-white/70",
  secondary:
    "bg-canvas text-ink border border-border hover:bg-surface disabled:text-subtle",
  ghost: "text-ink hover:bg-sidebarHover",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-full",
  md: "h-10 px-4 text-sm rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 disabled:cursor-not-allowed",
          VARIANTS[variant],
          SIZES[size],
          className,
        )}
        {...rest}
      />
    );
  },
);
Button.displayName = "Button";
