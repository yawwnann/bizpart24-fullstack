import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

// Since I didn't install class-variance-authority or radix-ui/react-slot in the plan, I will implement a simpler version now
// or better yet, I should add them to be safe and standard, but let's stick to simple props first as per "primitive" request to avoid overengineering if not needed.
// WAIT, the prompt said "resuable components". I will use standard props pattern.
// I'll stick to a simpler implementation without cva/radix for now to avoid extra hidden dependencies unless I add them.
// Let's use `clsx` logic manually for now to keep it lightweight as requested.

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "link"
  size?: "sm" | "md" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button"
    
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      primary: "bg-[#D92D20] text-white hover:bg-[#b91c1c]", // Red specific to brand
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    }
    
    const sizes = {
      sm: "h-9 rounded-md px-3",
      md: "h-10 px-4 py-2",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }

    return (
      <Component
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
