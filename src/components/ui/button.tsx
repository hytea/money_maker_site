import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "default" &&
            "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-sm hover:shadow-md active:from-primary-800 active:to-primary-900 active:scale-95",
          variant === "outline" &&
            "border-2 border-primary-300 bg-white hover:bg-primary-50 text-primary-700 hover:border-primary-400 active:bg-primary-100 active:border-primary-500",
          variant === "ghost" &&
            "hover:bg-gray-100 text-gray-700 hover:text-gray-900 active:bg-gray-200",
          variant === "secondary" &&
            "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
          size === "sm" && "h-8 px-3 text-xs",
          size === "md" && "h-10 px-4 text-sm",
          size === "lg" && "h-12 px-6 text-base",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
