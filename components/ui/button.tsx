import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ClipLoader } from "react-spinners";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-offset-2 transform cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",

        // Allotease Custom Variants
        "allotease-primary": `
          bg-(--allotease-primary)
          text-white 
          font-bold 
          font-source-sans-pro 
          shadow-btn-primary
          hover:bg-(--allotease-primary-hover)
          hover:shadow-btn-primary-hover 
          hover:scale-[1.02]
          active:bg-(--allotease-primary-active)
          active:scale-[0.98]
          focus-visible:ring-4 
          focus-visible:ring-(--allotease-primary-focus)
        `,

        "signup-primary": `
          bg-[var(--feature-accent-orange)]
          text-white 
          font-bold 
          font-source-sans-pro 
          shadow-btn-primary
          hover:bg-[var(--btn-browse-hover)]
          hover:shadow-btn-primary-hover 
          hover:scale-[1.02]
          active:bg-[var(--btn-browse-active)]
          active:scale-[0.98]
          focus-visible:ring-4 
          focus-visible:ring-[var(--btn-browse-focus)]
        `,

        "allotease-glass": `
          bg-white/10 
          backdrop-blur-[20px] 
          border 
          border-white/20 
          text-white/80 
          font-semibold 
          font-source-sans-pro 
          shadow-btn-glass 
          text-shadow-glass
          hover:bg-white/15 
          hover:border-white/40 
          hover:text-white 
          hover:shadow-btn-glass-hover
          active:bg-white/20
          focus-visible:ring-4 
          focus-visible:ring-white/20
        `,

        "allotease-blur": `
          bg-[rgba(242,244,247,0.60)]
          backdrop-blur-[21px]
          text-[var(--input-text)]
          font-semibold
          font-source-sans-pro
          border-0
          hover:bg-[rgba(242,244,247,0.75)]
          active:bg-[rgba(242,244,247,0.85)]
          focus-visible:ring-4
          focus-visible:ring-[var(--input-border-focus)]/20
        `,
      },
      size: {
        default: "h-9 px-4 py-2 text-sm rounded-md",
        sm: "h-8 px-3 py-2 text-sm rounded-md",
        lg: "h-10 px-6 py-2 text-base rounded-md",
        icon: "size-9",

        "allotease-sm": "px-[12px] py-[6px] text-sm rounded-[51px]",
        "allotease-md": "px-6 py-2.5 text-base rounded-[51px]",
        "allotease-lg": "px-[18px] py-[12px] text-lg rounded-[51px]",
        "allotease-xl": "px-12 py-4 text-xl rounded-[51px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Helper function to get spinner size based on button size
const getSpinnerSize = (size: string | null | undefined): number => {
  switch (size) {
    case "sm":
    case "allotease-sm":
      return 14;
    case "default":
    case "allotease-md":
      return 16;
    case "lg":
    case "allotease-lg":
      return 18;
    case "allotease-xl":
      return 22;
    case "icon":
      return 16;
    default:
      return 16;
  }
};

// Helper function to get spinner color based on button variant
const getSpinnerColor = (variant: string | null | undefined): string => {
  switch (variant) {
    case "allotease-primary":
      return "#ffffff"; // White for green background
    case "signup-primary":
      return "#ffffff"; // White for orange background
    case "allotease-glass":
      return "#ffffff"; // White for glass effect
    case "destructive":
      return "#ffffff"; // White for destructive
    case "allotease-blur":
      return "#1F2024"; // Dark for blur variant
    case "outline":
    case "ghost":
    case "link":
      return "#374151"; // Dark gray for light backgrounds
    case "secondary":
      return "#374151"; // Dark gray
    default:
      return "#ffffff"; // Default white
  }
};

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const spinnerSize = getSpinnerSize(size);
  const spinnerColor = getSpinnerColor(variant);

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), "group", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ClipLoader
          color={spinnerColor}
          loading={true}
          size={spinnerSize}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <>
          {leftIcon && (
            <span className="mr-[10px] flex-shrink-0">{leftIcon}</span>
          )}
          <span>{children}</span>
          {rightIcon && <span className="ml-2 flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
