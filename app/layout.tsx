import type { Metadata } from "next";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/conditional-layout";


export const metadata: Metadata = {
  title: "Allotease - Find the right vacation accommodation",
  description:
    "Stay connected to the pulse of your city. Explore trending events, secure your spot, and create unforgettable memories—all in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-source-sans">
           <ConditionalLayout>{children}</ConditionalLayout>
     
        
       
      </body>
    </html>
  );
}
