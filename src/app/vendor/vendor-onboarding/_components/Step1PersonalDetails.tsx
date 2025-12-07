"use client";

import React from "react";
import { Input } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface Step1Props {
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

type FormField = {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "select" | "email" | "number";
  width: "full" | "half";
};

const FORM_FIELDS: FormField[] = [
  {
    id: "streetAddress",
    label: "Street Address",
    placeholder: "Enter your street address",
    type: "text",
    width: "full",
  },
  {
    id: "city",
    label: "City",
    placeholder: "Enter city",
    type: "text",
    width: "half",
  },
  {
    id: "state",
    label: "State/Province",
    placeholder: "Enter state",
    type: "text",
    width: "half",
  },
  {
    id: "zipCode",
    label: "Zip/Postal Code",
    placeholder: "Enter zip code",
    type: "text",
    width: "full",
  },
];

export default function Step1PersonalDetails({
  formData,
  setFormData,
}: Step1Props) {
  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  return (
    <>
      <div className="flex justify-between items-start pb-6 px-6">
        <div>
          <h2 className="text-xl font-bold text-black mb-1">
            Step 1: Personal Information
          </h2>
          <p className="text-text2 text-sm">
            Let&apos;s start with your basic information.
          </p>
        </div>
        <QuestionCircleOutlined className="text-gray-400 text-lg cursor-help" />
      </div>

      <form className="grid grid-cols-2 gap-6 px-6 pt-6 border-t-2 border-gray-200 ">
        {FORM_FIELDS.map((field) => (
          <div
            key={field.id}
            className={`${
              field.width === "full" ? "col-span-2" : "col-span-1"
            }`}
          >
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-text2 mb-2"
            >
              {field.label}
            </label>
            <Input
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className="h-12 rounded-lg border-gray-200 hover:border-app_primary focus:border-app_primary focus:shadow-none placeholder:text-gray-400 text-text1"
            />
          </div>
        ))}
      </form>
    </>
  );
}
