"use client";

import React from "react";
import { Select, Slider, ConfigProvider } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface Step3Props {
  employmentStatus: string | null;
  setEmploymentStatus: (value: string) => void;
  incomeRange: number[];
  setIncomeRange: (value: number[]) => void;
}

export default function Step3BusinessDetails({
  employmentStatus,
  setEmploymentStatus,
  incomeRange,
  setIncomeRange,
}: Step3Props) {
  return (
    <>
      <div className="flex justify-between items-start pb-6 px-6">
        <div>
          <h2 className="text-xl font-bold text-black mb-1">
            Step 3: Business Details
          </h2>
          <p className="text-text2 text-sm">
            Tell us about your business status.
          </p>
        </div>
        <QuestionCircleOutlined className="text-gray-400 text-lg cursor-help" />
      </div>

      <div className="px-6 pt-6 border-t-2 border-gray-200 space-y-6">
        {/* Employment Status */}
        <div>
          <label className="block text-sm font-bold text-text1 mb-3">
            Employment Status
          </label>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#4CAF50",
                colorBorder: "#4CAF50",
              },
              components: {
                Select: {
                  colorBorder: "#4CAF50",
                  colorPrimaryHover: "#4CAF50",
                  optionSelectedBg: "#E8F5E9",
                },
              },
            }}
          >
            <Select
              placeholder="Select status"
              size="large"
              className="w-full"
              value={employmentStatus}
              onChange={setEmploymentStatus}
              options={[
                { value: "full-time", label: "Full Time" },
                { value: "part-time", label: "Part Time" },
                { value: "contract", label: "Contract" },
                { value: "freelance", label: "Freelance" },
              ]}
              style={{ borderColor: "#4CAF50" }}
            />
          </ConfigProvider>
        </div>

        {/* Monthly Income Range */}
        <div>
          <label className="block text-sm font-bold text-text1">
            Monthly Income Range (₦)
          </label>
          <div className="px-2">
            <Slider
              range
              min={10000}
              max={1000000}
              step={10000}
              defaultValue={[500000]}
              value={incomeRange as [number, number]}
              onChange={(value) => setIncomeRange(value as number[])}
              tooltip={{
                formatter: (value) => `₦${value?.toLocaleString()}`,
                open: true,
              }}
              marks={{
                10000: {
                  style: { fontSize: "12px", color: "#9CA3AF" },
                  label: "₦10,000",
                },
                1000000: {
                  style: { fontSize: "12px", color: "#9CA3AF" },
                  label: "₦1,000,000+",
                },
              }}
              styles={{
                track: { backgroundColor: "#4CAF50" },
                rail: { backgroundColor: "#E5E7EB" },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
