"use client";

import React, { useState } from "react";
import { Button, Checkbox } from "antd";
import { QuestionCircleOutlined, CheckCircleFilled } from "@ant-design/icons";
import { DocFile } from "./Step4DocumentUpload";

interface Step7Props {
  formData: Record<string, string>;
  employmentStatus: string | null;
  documents: DocFile[];
  complianceMethod: "easemeals" | "own" | null;
  affidavitFile: File | null;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
}

export default function Step7Review({
  formData,
  employmentStatus,
  documents,
  complianceMethod,
  affidavitFile,
  onEditStep,
  onSubmit,
}: Step7Props) {
  const [confirmed, setConfirmed] = useState(false);

  const SectionRow = ({ label, value, stepId }: { label: string, value: string, stepId: number }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-lg transition-colors">
      <div className="mb-2 sm:mb-0">
        <p className="text-xs text-text2 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
      <button
        onClick={() => onEditStep(stepId)}
        className="text-app_primary text-xs font-semibold hover:text-app_primary/80 self-start sm:self-center cursor-pointer"
      >
        Edit
      </button>
    </div>
  );

  return (
    <>
      <div className="flex justify-between items-start pb-6 px-6">
        <div>
          <h2 className="text-xl font-bold text-black mb-1">
            Step 7: Review & Submit
          </h2>
          <p className="text-text2 text-sm">
            Review your information before submission.
          </p>
        </div>
        <QuestionCircleOutlined className="text-gray-400 text-lg cursor-help" />
      </div>

      <div className="px-6 pt-6 border-t-2 border-gray-200">
        {/* Application Summary Card */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Application Summary
          </h3>
          <p className="text-xs text-text2 mb-6">
            Review your information before submission.
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-2">
            
            <SectionRow 
              label="Full name" 
              value={`${formData['firstName'] || 'Abraham'} ${formData['lastName'] || 'Kuforiji'}`} // Mocking if empty for visual parity
              stepId={1} 
            />
            
            <SectionRow 
              label="Purpose" 
              value="Vendor" 
              stepId={1} 
            />

            <SectionRow 
              label="Employment Status" 
              value={employmentStatus ? employmentStatus.charAt(0).toUpperCase() + employmentStatus.slice(1) : "Self-employed"} 
              stepId={3} 
            />

            <SectionRow 
              label="Documents" 
              value={documents.length > 0 ? `${documents.length} uploaded` : "None uploaded"} 
              stepId={4} 
            />

            <SectionRow 
              label="Compliance" 
              value={complianceMethod ? "Application pending" : "None selected"} 
              stepId={5} 
            />

            <SectionRow 
              label="Affidavit" 
              value={affidavitFile ? "Uploaded" : "Not uploaded"} 
              stepId={6} 
            />

          </div>
        </div>

        {/* Confirmation */}
        <div className="mb-6">
          <Checkbox
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="text-sm text-gray-700 accent-app_primary"
          >
            I confirm that all information provided is accurate and complete.
          </Checkbox>
        </div>
      </div>
    </>
  );
}
