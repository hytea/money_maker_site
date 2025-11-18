import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "h-11 border-2 border-input bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary hover:border-muted-foreground/40",
        glass:
          "h-11 glass border-white/20 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 hover:bg-white/30",
        neumorphic:
          "h-11 neumorphic-inset border-none focus-visible:shadow-neumorphic",
        outline:
          "h-11 border-2 border-border bg-transparent focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring",
        filled:
          "h-11 border-0 bg-muted focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring",
      },
      inputSize: {
        default: "h-11",
        sm: "h-9 text-xs",
        lg: "h-13 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
