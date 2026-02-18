import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
    outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
  },
} as const;

type ButtonVariant = keyof typeof buttonVariants.variant;
type ButtonSize = keyof typeof buttonVariants.size;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  type = "button",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      {...props}
    />
  );
}
