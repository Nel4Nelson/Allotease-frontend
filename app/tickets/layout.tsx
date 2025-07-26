interface TicketsLayoutProps {
  children: React.ReactNode;
}

export default function TicketsLayout({ children }: TicketsLayoutProps) {
  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Left Column - 40% (2/5) */}
      <div className="col-span-2">
        {/* Left column content will go here */}
      </div>
      
      {/* Right Column - 60% (3/5) */}
      <div className="col-span-3">
        {children}
      </div>
    </div>
  );
}