"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function SimpleFoodPreferencesPage() {
  const router = useRouter();
  const [foodInput, setFoodInput] = useState("");

  const handleGenerate = () => {
    if (foodInput.trim()) {
      router.push("/dashboard/timetable/loading");
    }
  };

  return (
    <div className="min-h-screen bg-app_bg flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-text1 mb-2">Food Preferences</h1>
        <p className="text-text2 mb-8">Tell us what foods you enjoy</p>

        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Enter your favorite food..."
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
            onPressEnter={handleGenerate}
            className="flex-1"
          />
          <button
            onClick={handleGenerate}
            className="bg-app_secondary text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center justify-center"
          >
            <PlusOutlined />
          </button>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-gray-400 text-gray-700 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
        >
          Generate Timetable
        </button>
      </div>
    </div>
  );
}

