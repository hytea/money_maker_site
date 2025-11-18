import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        glass: "glass border-white/20",
        neumorphic: "neumorphic-inset",
        gradient: "bg-gradient-to-r from-primary-100 to-accent-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        glass: "bg-white/50 backdrop-blur-sm",
        neumorphic: "bg-gradient-to-r from-primary-400 to-primary-600",
        gradient: "bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 shadow-glow",
        glow: "bg-primary shadow-glow animate-pulse-glow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number
  indicatorClassName?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, variant, value = 0, indicatorClassName, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(progressVariants({ variant }), className)}
      {...props}
    >
      <div
        className={cn(progressIndicatorVariants({ variant }), indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress, progressVariants, progressIndicatorVariants }
