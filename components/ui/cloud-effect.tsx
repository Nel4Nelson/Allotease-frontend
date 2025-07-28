//Todo: Clean up
"use client";

interface CloudEffectProps {
  className?: string;
}

export function CloudEffect({ className = "" }: CloudEffectProps) {
  return (
    <div
      className={`absolute -bottom-[120px] sm:-bottom-[180px] md:-bottom-[140px] -left-10 w-[120%] overflow-hidde pointer-events-none ${className}`}
    >
      <div
        className="w-full h-[80px] sm:h-[120px] md:h-[160px] lg:h-[200px] bg-white"
        style={{
          filter: "blur(34.400001525878906px)",
        }}
      />
    </div>
  );
}
