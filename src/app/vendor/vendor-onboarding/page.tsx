"use client";

import React, { useState } from "react";
import { ArrowRightOutlined, LeftOutlined, CheckOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Step1PersonalDetails from "./_components/Step1PersonalDetails";
import Step2FoodItems from "./_components/Step2FoodItems";
import Step3BusinessDetails from "./_components/Step3BusinessDetails";

import Step4DocumentUpload, { DocFile } from "./_components/Step4DocumentUpload";
import Step5Compliance from "./_components/Step5Compliance";
import Step6Affidavit from "./_components/Step6Affidavit";
import Step7Review from "./_components/Step7Review";

// --- Types ---
type OnboardingStep = {
  id: number;
  title: string;
};

// --- Constants for Steps ---
const STEPS: OnboardingStep[] = [
  { id: 1, title: "Personal Information" },
  { id: 2, title: "Food Items" },
  { id: 3, title: "Business Details" },
  { id: 4, title: "Document Upload" },
  { id: 5, title: "Compliance" },
  { id: 6, title: "Affidavit" },
  { id: 7, title: "Review & Submit" },
];

export default function VendorOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Step 2 State
  const [foodItems, setFoodItems] = useState<string[]>([
    "Pizza",
    "Burger",
    "Curry",
  ]);

  // Step 3 State
  const [employmentStatus, setEmploymentStatus] = useState<string | null>(null);
  const [incomeRange, setIncomeRange] = useState<number[]>([500000]);

  // Step 4 State
  const [documents, setDocuments] = useState<DocFile[]>([]);

  // Step 5 State
  const [complianceMethod, setComplianceMethod] = useState<
    "easemeals" | "own" | null
  >(null);

  // Step 6 State
  const [affidavitFile, setAffidavitFile] = useState<File | null>(null);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEditStep = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleSubmit = () => {
    console.log("Submitting Vendor Application...", {
      formData,
      foodItems,
      employmentStatus,
      incomeRange,
      documents,
      complianceMethod,
      affidavitFile
    });
    // Add submission logic here
  };

  // --- Render Step Content ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalDetails formData={formData} setFormData={setFormData} />
        );
      case 2:
        return (
          <Step2FoodItems foodItems={foodItems} setFoodItems={setFoodItems} />
        );
      case 3:
        return (
          <Step3BusinessDetails
            employmentStatus={employmentStatus}
            setEmploymentStatus={setEmploymentStatus}
            incomeRange={incomeRange}
            setIncomeRange={setIncomeRange}
          />
        );
      case 4:
        return (
          <Step4DocumentUpload
            documents={documents}
            setDocuments={setDocuments}
          />
        );
      case 5:
        return (
          <Step5Compliance
            complianceMethod={complianceMethod}
            setComplianceMethod={setComplianceMethod}
          />
        );
      case 6:
        return (
          <Step6Affidavit
            affidavitFile={affidavitFile}
            setAffidavitFile={setAffidavitFile}
          />
        );
      case 7:
        return (
          <Step7Review 
            formData={formData}
            employmentStatus={employmentStatus}
            documents={documents}
            complianceMethod={complianceMethod}
            affidavitFile={affidavitFile}
            onEditStep={handleEditStep}
            onSubmit={handleSubmit}
          />
        );
      default:
        return <div>Step {currentStep} content coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans text-text1">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-app_primary">Ease</span>
          <span className="text-app_secondary">Meal </span>
          <span className="text-app_primary">Vendor Onboarding</span>
        </h1>
        <p className="text-text2 text-sm">
          Complete the following steps to set up your vendor account
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl w-full flex items-center justify-between mb-10 px-4">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  isActive
                    ? "bg-white border text-app_primary border-app_primary" // Active step style updated to match image (Green text/border, white bg)? No, usually active is specific.
                    // Image shows: Step 1 & 2 are Green circles with White ticks (Completed).
                    // Step 3 is White circle with Green border and Green number (Active).
                    // Next steps are White circles with Grey border/text.
                    : isCompleted
                    ? "bg-app_primary text-white"
                    : "bg-white border text-gray-300 border-gray-300"
                } ${isActive ? "!border-app_primary !text-app_primary" : ""}`}
              >
                {isCompleted ? <CheckOutlined /> : step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    currentStep > step.id ? "bg-app_primary" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-8 max-w-2xl w-full mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-2xl w-full flex justify-between items-center">
        <Button
          onClick={handleBack}
          className="h-10 px-6 rounded-lg border-gray-200 text-gray-500 hover:text-text1 hover:border-gray-300 bg-transparent flex items-center gap-2 font-medium"
          disabled={currentStep === 1}
        >
          <LeftOutlined className="text-xs" />
          Back
        </Button>
        <Button
          onClick={currentStep === STEPS.length ? handleSubmit : handleNext}
          type="primary"
          className="h-10 px-6 rounded-lg bg-app_primary! hover:bg-app_primary/90! border-none flex items-center gap-2 font-medium"
        >
          {currentStep === STEPS.length ? "Submit" : "Next"}
          {currentStep !== STEPS.length && <ArrowRightOutlined className="text-xs" />}
        </Button>
      </div>
    </div>
  );
}
