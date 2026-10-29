"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-xl border-2 border-gambut/15 bg-white px-3 text-base text-arang tabular-nums placeholder:text-slate-400 focus-visible:border-gambut focus-visible:outline-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-semibold text-arang", className)} {...props} />;
}

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-xl border-2 border-gambut/15 bg-white px-3 text-base text-arang focus-visible:border-gambut focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  ),
);
Select.displayName = "Select";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-20 w-full rounded-xl border-2 border-gambut/15 bg-white px-3 py-2 text-base text-arang placeholder:text-slate-400 focus-visible:border-gambut focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; hint?: string }[];
  ariaLabel: string;
  className?: string;
}

/** Pilihan tombol besar (ramah jempol) pengganti dropdown. */
export function Segmented<T extends string>({ value, onChange, options, ariaLabel, className }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cn("grid gap-2", className)} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center rounded-xl border-2 px-2 py-1.5 text-sm font-semibold transition-colors",
              active ? "border-gambut bg-gambut text-white" : "border-gambut/15 bg-white text-arang hover:bg-tunas",
            )}
          >
            {o.label}
            {o.hint && <span className={cn("text-[11px] font-normal", active ? "text-white/80" : "text-kabut")}>{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Progress({ value, className, indicatorClassName }: { value: number; className?: string; indicatorClassName?: string }) {
  return (
    <div className={cn("h-3 w-full overflow-hidden rounded-full bg-tunas", className)} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full bg-gambut transition-all", indicatorClassName)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

