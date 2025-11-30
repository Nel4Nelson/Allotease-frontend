import type { Metadata } from "next";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { NetworkStatusProvider } from "@/hooks/use-network-status";
import { GoogleMapsLoader } from "@/components/ui/google-maps-loader";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-sans",
});

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
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${sourceSans.variable}`}
    >
      <body className="font-source-sans-pro">
        <QueryProvider>
          <NetworkStatusProvider>
            <ConditionalLayout>
              <GoogleMapsLoader apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} />
              {children}
            </ConditionalLayout>
          </NetworkStatusProvider>
        </QueryProvider>
      </body>
    </html>
  );
}