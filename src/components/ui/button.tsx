import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gambut focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-gambut text-white shadow-sm hover:bg-gambut-700",
        secondary: "bg-tunas text-gambut-900 hover:bg-[#d2eadc]",
        outline: "border-2 border-gambut/25 bg-white text-gambut-900 hover:bg-tunas",
        ghost: "text-gambut-900 hover:bg-tunas",
        warning: "bg-bahaya text-white hover:bg-[#9a3412]",
        link: "text-gambut underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-4",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-14 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };

