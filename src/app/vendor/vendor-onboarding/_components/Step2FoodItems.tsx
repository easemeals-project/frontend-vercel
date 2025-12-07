"use client";

import React, { useState } from "react";
import { Input } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface Step2Props {
  foodItems: string[];
  setFoodItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Step2FoodItems({
  foodItems,
  setFoodItems,
}: Step2Props) {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newItem.trim()) {
      e.preventDefault();
      if (!foodItems.includes(newItem.trim())) {
        setFoodItems([...foodItems, newItem.trim()]);
      }
      setNewItem("");
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setFoodItems(foodItems.filter((item) => item !== itemToRemove));
  };

  return (
    <>
      <div className="flex justify-between items-start pb-6 px-6">
        <div>
          <h2 className="text-xl font-bold text-black mb-1">
            Step 2: Food Items
          </h2>
          <p className="text-text2 text-sm">
            Select the food items you can cook.
          </p>
        </div>
        <QuestionCircleOutlined className="text-gray-400 text-lg cursor-help" />
      </div>

      <div className="px-6 pt-6 border-t-2 border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-bold text-text1 mb-2">
            What food can you cook?
          </label>
          <p className="text-xs text-text2 mb-3">
            Search from our list or add your own specialty dishes
          </p>
          <Input
            placeholder="Search or type to add new..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleAddItem}
            className="h-12 rounded-lg border-gray-200 hover:border-app_primary! focus:border-app_primary! focus:shadow-none placeholder:text-gray-200 text-text1"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-text1 mb-3">
            Your Menu ( {foodItems.length} items )
          </label>
          <div className="flex flex-wrap gap-3">
            {foodItems.map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 bg-app_primary/15 text-app_primary/60 px-4 py-2 rounded-full border-app_primary/50 border-2 text-sm font-medium"
              >
                {item}
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="text-app_primary/60 hover:text-app_primary/30 cursor-pointer transition-colors font-extrabold ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
            {foodItems.length === 0 && (
              <p className="text-gray-400 text-sm italic">
                No items added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
