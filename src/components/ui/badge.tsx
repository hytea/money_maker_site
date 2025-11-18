import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variant === "default" && "bg-primary-100 text-primary-800 border border-primary-200",
          variant === "secondary" && "bg-gray-100 text-gray-800 border border-gray-200",
          variant === "success" && "bg-green-100 text-green-800 border border-green-200",
          variant === "warning" && "bg-yellow-100 text-yellow-800 border border-yellow-200",
          variant === "destructive" && "bg-red-100 text-red-800 border border-red-200",
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
