import React, { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "neon";
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  hover = false,
  ...props
}) => {
  const variants = {
    default: "bg-dark-800 border border-dark-700 shadow-lg",
    glass:
      "bg-dark-800/50 backdrop-blur-lg border border-neon-cyan/20 shadow-lg shadow-neon-cyan/10",
    neon: "bg-dark-800/50 backdrop-blur-lg border border-neon-cyan/30 shadow-lg shadow-neon-cyan/20",
  };

  const hoverEffect = hover
    ? "transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-neon-cyan/30"
    : "";

  return (
    <div
      className={`rounded-xl p-6 ${variants[variant]} ${hoverEffect} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
