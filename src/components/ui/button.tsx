import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg hover:shadow-glow-lg hover:from-[#1d4ed8] hover:to-[#1e40af] active:shadow-md",
        destructive:
          "bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-xl",
        outline:
          "border-2 border-[#60a5fa] bg-white hover:bg-blue-50 text-[#1d4ed8] hover:border-[#2563eb] active:bg-blue-100 shadow-md hover:shadow-lg",
        secondary:
          "bg-gray-100 text-gray-900 shadow-md hover:bg-gray-200 hover:shadow-lg",
        ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
        link: "text-[#2563eb] underline-offset-4 hover:underline",
        glass:
          "bg-white/90 backdrop-blur-md text-gray-900 shadow-lg hover:shadow-glow-lg border border-gray-200 hover:bg-white",
        gradient:
          "bg-gradient-to-r from-[#3b82f6] via-[#d946ef] to-[#2563eb] text-white shadow-glow-lg hover:shadow-glow-accent-lg animate-gradient-shift bg-[length:200%_100%]",
        neumorphic:
          "neumorphic text-gray-900 hover:shadow-neumorphic-inset active:shadow-neumorphic-inset",
        glow:
          "bg-[#2563eb] text-white shadow-glow-lg hover:shadow-glow-accent-lg",
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
