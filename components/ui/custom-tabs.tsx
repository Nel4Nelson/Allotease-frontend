"use client";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const CustomTabs = TabsPrimitive.Root;

const CustomTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg bg-transparent p-1 text-[var(--body-text)] gap-1",
      className
    )}
    {...props}
  />
));
CustomTabsList.displayName = TabsPrimitive.List.displayName;

const CustomTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-lg font-semibold font-source-sans-pro ring-offset-background transition-all duration-200 ease-out cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--feature-accent-orange)] focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      // Default (unselected) state
      "text-[var(--body-text)] hover:text-[var(--title-color)]",
      // Selected state with Figma styling
      "data-[state=active]:text-[var(--title-color)] data-[state=active]:shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]",
      "data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFF3E7] data-[state=active]:to-[#FFF]",
      className
    )}
    style={{
      background:
        'var(--state) === "active" ? "linear-gradient(267deg, #FFF3E7 -49.46%, #FFF 97.79%)" : "transparent"',
    }}
    {...props}
  />
));
CustomTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const CustomTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--feature-accent-orange)] focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
CustomTabsContent.displayName = TabsPrimitive.Content.displayName;

export { CustomTabs, CustomTabsList, CustomTabsTrigger, CustomTabsContent };
