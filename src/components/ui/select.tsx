import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const selectVariants = cva(
  "flex h-11 w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-2 border-input bg-background ring-offset-background focus:ring-2 focus:ring-ring focus:border-primary hover:border-muted-foreground/40",
        glass:
          "glass border-white/20 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:bg-white/30",
        neumorphic:
          "neumorphic-inset border-none focus:shadow-neumorphic",
        outline:
          "border-2 border-border bg-transparent focus:border-primary focus:ring-2 focus:ring-ring",
        filled:
          "border-0 bg-muted focus:bg-background focus:ring-2 focus:ring-ring",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <select
        className={cn(selectVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select, selectVariants }
