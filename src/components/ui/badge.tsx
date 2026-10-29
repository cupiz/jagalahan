import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-gambut text-white",
        secondary: "bg-tunas text-gambut-900",
        outline: "border border-gambut/25 text-gambut-900",
        muted: "bg-slate-100 text-kabut",
        aman: "bg-aman-bg text-[#115e59] border border-aman",
        waspada: "bg-waspada-bg text-[#92400e] border border-dashed border-waspada",
        bahaya: "bg-bahaya-bg text-[#9a3412] border-2 border-double border-bahaya",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

