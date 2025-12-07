"use client";

import React from "react";
import { Button, Checkbox } from "antd";
import { QuestionCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";

interface Step5Props {
  complianceMethod: "easemeals" | "own" | null;
  setComplianceMethod: (value: "easemeals" | "own" | null) => void;
}

export default function Step5Compliance({
  complianceMethod,
  setComplianceMethod,
}: Step5Props) {
  return (
    <>
      <div className="flex justify-between items-start pb-6 px-6">
        <div>
          <h2 className="text-xl font-bold text-black mb-1">
            Step 5: Compliance
          </h2>
          <p className="text-text2 text-sm">
            Complete regulatory compliance requirements.
          </p>
        </div>
        <QuestionCircleOutlined className="text-gray-400 text-lg cursor-help" />
      </div>

      <div className="px-6 pt-6 border-t-2 border-gray-200">
        {/* Warning Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-md">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-yellow-400 text-lg mt-0.5 mr-3 shrink-0" />
            <p className="text-sm text-yellow-700 font-medium leading-5">
              NAFDAC and NDLEA compliance is required for all food vendors on
              EaseMeals.
            </p>
          </div>
        </div>

        {/* Compliance Options Section */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Compliance Options
          </h3>
          <p className="text-xs text-text2 mb-6">
            Choose how you want to proceed with regulatory compliance.
          </p>

          <div className="space-y-4">
            {/* NAFDAC Option */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-gray-100 gap-4">
              <span className="text-sm font-medium text-gray-700">
                NAFDAC Registration
              </span>
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    Apply through EaseMeals
                  </span>
                  <span className="text-gray-900 font-bold text-sm bg-gray-100 px-2 py-1 rounded">
                    ₦25,000
                  </span>
                </div>
                <Button className="bg-app_primary! hover:bg-app_primary/90! border-none text-white! font-medium rounded-lg px-4 h-9 text-xs">
                  Apply Now
                </Button>
              </div>
            </div>

            {/* NDLEA Option */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-gray-100 gap-4">
              <span className="text-sm font-medium text-gray-700">
                NDLEA Clearance
              </span>
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    Apply through EaseMeals
                  </span>
                  <span className="text-gray-900 font-bold text-sm bg-gray-100 px-2 py-1 rounded">
                    ₦15,000
                  </span>
                </div>
                <Button className="bg-app_primary! hover:bg-app_primary/90! border-none text-white! font-medium rounded-lg px-4 h-9 text-xs">
                  Apply Now
                </Button>
              </div>
            </div>

            {/* Already Registered Option */}
            <div className="flex items-start sm:items-center gap-3 pt-4">
              <Checkbox
                checked={complianceMethod === "own"}
                onChange={(e) =>
                  setComplianceMethod(e.target.checked ? "own" : null)
                }
                className="text-sm text-gray-700 accent-app_primary mt-0.5 sm:mt-0"
              >
                I already have NAFDAC/NDLEA registration
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
