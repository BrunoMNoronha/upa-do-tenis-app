import * as React from "react";
import { cn } from "@/lib/utils";

const alertVariants = {
  default: "border-border bg-background text-foreground",
  destructive: "border-destructive/50 bg-destructive/10 text-destructive",
  success: "border-emerald-600/40 bg-emerald-600/10 text-emerald-800 dark:text-emerald-200",
} as const;

type AlertVariant = keyof typeof alertVariants;
type DivProps = React.HTMLAttributes<HTMLDivElement>;
type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

type AlertProps = DivProps & {
  variant?: AlertVariant;
};

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("relative w-full rounded-lg border p-4", alertVariants[variant], className)}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: HeadingProps) {
  return <h3 className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: DivProps) {
  return <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />;
}
