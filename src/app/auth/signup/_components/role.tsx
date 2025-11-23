"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import conts from "@/lib/conts";
import { UserRole } from "@/lib/types";

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.shopper);

  const handleNext = () => {
    if (selectedRole) {
      router.push(`${conts.paths.signup}?role=${selectedRole}`);
    }
  };

  const roles: Array<{
    value: UserRole;
    title: string;
    titleMobile: string;
    description: string;
  }> = [
    {
      value: UserRole.shopper,
      title: "Shopper",
      titleMobile: "Shopper",
      description: "I want to buy meals",
    },
    {
      value: UserRole.vendor,
      title: "Vendor",
      titleMobile: "Vendor",
      description: "I want to sell meals",
    },
    {
      value: UserRole.chef,
      title: "Private Chef",
      titleMobile: "Chef",
      description: "I want to cook meals",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 lg:p-12 w-full min-h-screen bg-white">
      <div className="w-full flex flex-col gap-y-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-app_primary">Ease</span>
            <span className="text-app_secondary">Meal </span>
            <span className="text-app_primary">Vendor Onboarding</span>
          </h1>
          <p className="text-text2 text-sm">
            Complete the following steps to set up your vendor account.
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg bg-white border border-gray-200 rounded-lg">
          {/* Step Information */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-text1">
                  Step 1: Purpose
                </h2>
                <QuestionCircleOutlined className="text-gray-400 text-lg cursor-pointer" />
              </div>
              <p className="text-text2 text-sm">
                Tell us how you plan to use EaseMeals.
              </p>
            </div>
          </div>

          {/* Question */}
          <div className="flex items-center gap-2 pb-6 border-b border-gray-200">
            <h3 className="text-base font-normal text-text1">
              What is your primary purpose on EaseMeals?
            </h3>
            <QuestionCircleOutlined className="text-gray-400 text-base cursor-pointer" />
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-8">
            {roles.map((role) => {
              const isSelected = selectedRole === role.value;
              return (
                <div
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all bg-white ${
                    isSelected
                      ? "border-app_primary"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {/* Radio Button */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-400 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="font-bold text-text1 mb-1">
                        <span className="hidden md:inline">{role.title}</span>
                        <span className="md:hidden">{role.titleMobile}</span>
                      </h4>
                      <p className="text-sm text-text2">{role.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-text1 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <ArrowLeftOutlined />
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2.5 cursor-pointer rounded-lg text-white bg-app_primary hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              Next
              <ArrowRightOutlined />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
