// components/layouts/ModalLayout.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function ModalLayout({
  isOpen,
  onClose,
  title,
  children,
}: ModalLayoutProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Background Overlay */}
      <DialogOverlay className="fixed inset-0 z-50 bg-white/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

      <DialogContent className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] p-0 border-none bg-transparent shadow-none max-w-[95vw] w-full sm:max-w-[400px]">
        <div
          className="p-6 sm:p-8 rounded-2xl relative mx-auto w-full max-w-[400px] shadow-2xl"
          style={{
            background:
              "linear-gradient(353.72deg, #FFFFFF 24.04%, rgba(255, 243, 230, 0.35) 59.41%, #D5FFEB 113.97%)",
          }}
        >
          <div className="flex flex-col items-center">
            {/* Title */}
            <DialogTitle className="text-[#1F2024] mb-6 sm:mb-8 text-center font-bold text-lg sm:text-xl font-space-grotesk">
              {title}
            </DialogTitle>

            {/* Content */}
            <div className="w-full flex flex-col items-center">{children}</div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
              <span className="text-sm  md:text-md font-normal leading-relaxed text-[#7A7A7A]">
                Powered by
              </span>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-[#FF5B00] rounded flex items-center justify-center shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <span className="ml-1 text-xs font-semibold text-[#7A7A7A]">
                  Flend
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
