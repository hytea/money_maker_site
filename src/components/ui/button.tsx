import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary-600 to-primary-700 text-primary-foreground shadow-md hover:shadow-glow hover:from-primary-700 hover:to-primary-800 active:shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg",
        outline:
          "border-2 border-primary-300 bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary-400 active:bg-accent/80",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass:
          "glass text-foreground shadow-glass hover:shadow-glow backdrop-blur-md hover:bg-white/30",
        gradient:
          "bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 text-white shadow-glow-lg hover:shadow-glow-accent-lg animate-gradient-shift bg-[length:200%_100%]",
        neumorphic:
          "neumorphic text-foreground hover:shadow-neumorphic-inset active:shadow-neumorphic-inset",
        glow:
          "bg-primary text-primary-foreground shadow-glow hover:shadow-glow-lg animate-pulse-glow",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
