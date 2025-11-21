"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

const cardVariants = cva(
  "rounded-xl overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white border border-gray-100 shadow-sm",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white",
        elevated: "bg-white shadow-xl border-none",
        bordered: "bg-transparent border border-gray-200",
      },
      hover: {
        true: "hover:shadow-xl hover:-translate-y-1 cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: false,
    },
  }
);

export interface CardProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant, hover, className }))}
        initial={hover ? { y: 0 } : undefined}
        whileHover={hover ? { y: -5 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export { Card, cardVariants };

