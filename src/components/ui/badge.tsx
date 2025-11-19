import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground border border-border",
        success: "bg-success text-success-foreground shadow-sm",
        warning: "bg-warning text-warning-foreground shadow-sm",
        destructive: "bg-destructive text-destructive-foreground shadow-sm",
        outline: "text-foreground border-2 border-border bg-transparent",
        glass: "glass text-foreground border-white/20",
        gradient: "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow",
        glow: "bg-primary text-primary-foreground shadow-glow animate-pulse-glow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
