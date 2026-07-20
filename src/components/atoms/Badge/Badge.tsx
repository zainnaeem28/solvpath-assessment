import type { HTMLAttributes, ReactNode } from "react";
import "./Badge.css";

export type BadgeTone = "neutral" | "success" | "info" | "warning" | "danger" | "accent";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = "neutral", className = "", children, ...rest }: BadgeProps) {
  return (
    <span className={`badge badge--${tone} ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}
