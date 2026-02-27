"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Spin } from "antd";

const FoodPreferencesFull = dynamic(() => import("./_components/FoodPreferencesFull"), {
  ssr: false,
});

export default function FoodPreferencesPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-app_bg"><Spin size="large" /></div>}>
      <FoodPreferencesFull />
    </Suspense>
  );
}
