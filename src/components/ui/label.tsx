import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        gradient: "gradient-text font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label, labelVariants }
