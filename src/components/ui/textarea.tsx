import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-lg px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y",
  {
    variants: {
      variant: {
        default:
          "border-2 border-input bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary hover:border-muted-foreground/40",
        glass:
          "glass border-white/20 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 hover:bg-white/30",
        neumorphic:
          "neumorphic-inset border-none focus-visible:shadow-neumorphic",
        outline:
          "border-2 border-border bg-transparent focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring",
        filled:
          "border-0 bg-muted focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
