import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "h-11 border-2 border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 hover:border-gray-400 shadow-md",
        glass:
          "h-11 bg-white/90 backdrop-blur-sm border-2 border-gray-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 hover:bg-white shadow-md",
        neumorphic:
          "h-11 neumorphic-inset border-none focus-visible:shadow-neumorphic",
        outline:
          "h-11 border-2 border-gray-300 bg-white focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 shadow-md",
        filled:
          "h-11 border-0 bg-gray-100 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary-500 shadow-md",
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
