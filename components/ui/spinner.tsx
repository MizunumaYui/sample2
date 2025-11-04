// components/ui/spinner.tsx
import React from "react";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={`w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin ${
        className ?? ""
      }`}
    ></div>
  );
}
