"use client";

import React, { useState } from "react";
import { ArrowRightOutlined, LeftOutlined, CheckOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import conts from "@/lib/conts";
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

  const router = useRouter();

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
    // In a real app, we would send this data to the backend here.
    // For now, we simulate a successful submission and redirect.

    // Optionally set a flag that onboarding is complete
    localStorage.setItem("vendorOnboardingCompleted", "true");

    router.push(conts.paths.vendorDashboard);
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
    <div className="relative min-h-screen bg-white overflow-hidden flex flex-col items-center py-10 px-4 font-sans text-gray-800">

      {/* Background Blobs (Matching HeroSection) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] rounded-full blur-[80px] lg:blur-[100px] opacity-10 bg-gradient-to-br from-[#0a4031] to-emerald-600 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] rounded-full blur-[80px] lg:blur-[100px] opacity-10 bg-[#0a4031] animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-10 mt-10">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-[#0a4031]">
          Vendor <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a4031] to-emerald-600">Onboarding</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
          Join our network of premium vendors. Complete the steps below to start selling on EaseMeals.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 max-w-3xl w-full flex items-center justify-between mb-12 px-4">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-all duration-300 ${isActive
                    ? "bg-[#0a4031] text-white shadow-lg scale-110" // Active: Filled Deep Green
                    : isCompleted
                      ? "bg-[#0a4031] text-white" // Completed: Filled Deep Green with tick
                      : "bg-white border md:border-2 border-gray-200 text-gray-300" // Inactive: White with gray border
                    }`}
                >
                  {isCompleted ? <CheckOutlined /> : step.id}
                </div>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded-full transition-colors duration-500 ${currentStep > step.id ? "bg-[#0a4031]" : "bg-gray-200"
                    }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 bg-white shadow-xl rounded-2xl border border-gray-100 py-10 px-8 max-w-3xl w-full mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="relative z-10 max-w-3xl w-full flex justify-between items-center">
        <Button
          onClick={handleBack}
          className="h-10 px-6 rounded-md border border-gray-300 text-gray-600 hover:text-[#0a4031] hover:border-[#0a4031] bg-white flex items-center gap-2 font-medium transition-all"
          disabled={currentStep === 1}
        >
          <LeftOutlined className="text-xs" />
          Back
        </Button>
        <Button
          onClick={currentStep === STEPS.length ? handleSubmit : handleNext}
          type="primary"
          className="h-10 px-6 rounded-md bg-[#0a4031] hover:!bg-[#083327] border-none flex items-center gap-2 font-medium shadow-md transition-all"
        >
          {currentStep === STEPS.length ? "Submit" : "Next"}
          <ArrowRightOutlined className="text-xs" />
        </Button>
      </div>
    </div>
  );
}
