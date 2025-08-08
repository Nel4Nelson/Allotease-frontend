"use client";
import React from "react";
import { Toaster } from "react-hot-toast";

export function CustomToast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: "glassmorphism-toast",
        style: {
          borderRadius: "16px",
          background: "rgba(242, 244, 247, 0.60)",
          boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.04)",
          backdropFilter: "blur(83.3499984741211px)",
          border: "none",
          color: "#1F2024",
          fontFamily: "var(--font-source-sans), sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          padding: "16px 20px",
          position: "relative",
          overflow: "hidden",
          minWidth: "320px",
          maxWidth: "450px",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "rgba(16, 185, 129, 0.1)",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "rgba(239, 68, 68, 0.1)",
          },
        },
        loading: {
          iconTheme: {
            primary: "#FF5B06",
            secondary: "rgba(255, 91, 6, 0.1)",
          },
        },
      }}
      containerStyle={{
        top: 20,
        right: 20,
      }}
    />
  );
}
