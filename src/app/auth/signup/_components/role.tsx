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
    <>
      <div className="w-full flex flex-col items-center gap-y-8 max-w-4xl">
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
        <div className="w-full bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/50">
          {/* Step Information */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
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
          <div className="flex items-center gap-2 pb-6">
            <h3 className="text-base font-normal text-text1">
              What is your primary purpose on EaseMeals?
            </h3>
            <QuestionCircleOutlined className="text-gray-400 text-base cursor-pointer" />
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {roles.map((role) => {
              const isSelected = selectedRole === role.value;
              return (
                <div
                  key={role.value}
                  onClick={() => {
                    setSelectedRole(role.value);
                    router.push(`${conts.paths.signup}?role=${role.value}`);
                  }}
                  className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all ${isSelected
                    ? "border-app_primary bg-green-50 shadow-md scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-app_primary hover:shadow-md"
                    }`}
                >
                  {/* Radio Button */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected
                        ? "border-app_primary bg-app_primary"
                        : "border-gray-300 bg-transparent"
                        }`}
                    >
                      {isSelected && (
                        <div className="w-2 rounded-full bg-white"></div>
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
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-text1 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeftOutlined />
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
