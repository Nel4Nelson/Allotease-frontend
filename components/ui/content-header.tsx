import React from "react";

interface ContentHeaderProps {
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function ContentHeader({
  title,
  action,
  className = "",
}: ContentHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>{title}</div>
      {action && <div>{action}</div>}
    </div>
  );
}
