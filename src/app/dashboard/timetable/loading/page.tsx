"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "antd";
import conts from "@/lib/conts";

const LOADING_TIME = 14; // seconds
const STAGES = [
  "Optimizing for nutrition and variety...",
  "Finalizing your personalized timetable...",
  "Optimizing for nutrition and variety...",
];

export default function MealPlanLoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (LOADING_TIME * 10));
        if (newProgress >= 100) {
          clearInterval(interval);
          // Navigate to timetable after loading
          setTimeout(() => {
            router.push(conts.paths.timetable);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    // Update stage based on progress
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (progress < 30) return 0;
        if (progress < 70) return 1;
        return 2;
      });
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(stageInterval);
    };
  }, [router, progress]);

  return (
    <div className="min-h-screen bg-app_bg flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Circular Icon Placeholder */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-app_primary bg-white flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-app_primary"></div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-text1 mb-4">
          Creating Your Meal Plan
        </h1>

        {/* Subtitle */}
        <p className="text-text2 mb-6">{STAGES[currentStage]}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <Progress
            percent={Math.round(progress)}
            strokeColor="#4CAF50"
            showInfo={false}
            className="mb-2"
          />
        </div>

        {/* Estimated Time */}
        <p className="text-sm text-text2 mb-8">
          This will take about {LOADING_TIME} seconds
        </p>

        {/* Tip */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-text2 italic">
            "Did you know? Planning meals in advance can reduce food waste by
            up to 33% and save you money on groceries."
          </p>
        </div>
      </div>
    </div>
  );
}

