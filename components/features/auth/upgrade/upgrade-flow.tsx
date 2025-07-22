"use client";
import React from "react";
import { AuthLayout } from "../shared";
import { Upgrade } from "./upgrade";

export function UpgradeFlow() {
  return (
    <AuthLayout
      title="Upgrade account"
      showBackButton={true}
      onBack={undefined}
    >
      <Upgrade />
    </AuthLayout>
  );
}
