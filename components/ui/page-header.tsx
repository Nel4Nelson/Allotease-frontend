interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={className}>
      {/* Title */}
      <h1 className="text-(--title-color) font-space-grotesk text-[28px] font-bold leading-[140%] tracking-[-0.56px] mb-2">
        {title}
      </h1>

      {/* Description */}
      <p className="text-(--body-text) font-source-sans-pro text-base font-normal leading-[160%] max-w-3xl">
        {description}
      </p>
    </div>
  );
}
