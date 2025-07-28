"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

interface BreadcrumbProps {
  className?: string;
}

// Component that uses useSearchParams
function BreadcrumbContent({ className = "" }: BreadcrumbProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Split pathname and filter out empty strings
  const pathSegments = pathname.split("/").filter(Boolean);

  // Function to format segment names
  const formatSegmentName = (segment: string): string => {
    // Handle specific cases
    if (segment === "allocation-admin") return "Admin";

    // Capitalize first letter and replace hyphens with spaces
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Build breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    let name = formatSegmentName(segment);
    const isLast = index === pathSegments.length - 1;

    // Handle special cases for better breadcrumb display
    if (mounted) {
      // If this is the create segment and there's a type parameter, append it
      if (segment === "create" && !isLast) {
        const type = searchParams.get("type");
        if (type) {
          const formattedType = formatSegmentName(type);
          name = `${name}_${formattedType}`;
        }
      }
      
      // If this is the last segment and it's "create", also append the type
      if (isLast && segment === "create") {
        const type = searchParams.get("type");
        if (type) {
          const formattedType = formatSegmentName(type);
          name = `${name}_${formattedType}`;
        }
      }
    }

    return {
      name,
      path,
      isLast,
    };
  });

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav className={`breadcrumb ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center">
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="flex items-center gap-0.5 ">
            {index > 0 && <span className="text-(--body-text)">/</span>}
            {item.isLast ? (
              <span className="breadcrumb-text">{item.name}</span>
            ) : (
              <Link
                href={item.path}
                className="breadcrumb-text hover:text-(--body-text) transition-colors mr-0.5"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Main component that wraps the useSearchParams component in Suspense
export function Breadcrumb({ className = "" }: BreadcrumbProps) {
  return (
    <Suspense fallback={<div>Loading breadcrumb...</div>}>
      <BreadcrumbContent className={className} />
    </Suspense>
  );
}