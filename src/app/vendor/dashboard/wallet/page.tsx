"use client";

import React, { useState } from "react";
import {
    ArrowLeftOutlined,
    CheckCircleFilled,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Steps, Input, Select, Radio, Checkbox } from "antd";

const { Step } = Steps;
const { Option } = Select;

export default function VendorWalletPage() {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Wallet</h2>
                <div className="bg-green-50 rounded-xl p-6 border border-green-100 flex items-start gap-4">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                        <HeartIcon className="text-[#0a4031] text-2xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Quick Funds for Your Business</h3>
                        <p className="text-gray-600">Friendly, hassle-free financing when you need it most.</p>
                    </div>
                </div>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <Steps
                    current={currentStep}
                    labelPlacement="vertical"
                    items={[
                        { title: 'About You' },
                        { title: 'Your Needs' },
                        { title: 'Confirm' },
                    ]}
                />
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
                {currentStep === 0 && (
                    <div className="max-w-lg mx-auto py-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Tell us about your business</h3>
                        <p className="text-gray-500 mb-6">We need just a few details to get you started.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    How long have you been in business? <span className="text-red-500">*</span>
                                </label>
                                <Select placeholder="Select an option" className="w-full" size="large">
                                    <Option value="less-than-6">Less than 6 months</Option>
                                    <Option value="6-12">6 - 12 months</Option>
                                    <Option value="1-3">1 - 3 years</Option>
                                    <Option value="3+">3+ years</Option>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    What's your average monthly revenue? <span className="text-red-500">*</span>
                                </label>
                                <Input placeholder="How much do you make monthly?" size="large" prefix="₦" />
                            </div>

                            {/* Info Box */}
                            <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex gap-3">
                                <InfoCircleOutlined className="text-[#0a4031] mt-1" />
                                <p className="text-sm text-[#0a4031]">
                                    Don't worry! This information helps us tailor the perfect funding option for you. Businesses operating for more than 6 months typically qualify for larger amounts.
                                </p>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button size="large" onClick={() => { }}>Cancel</Button>
                                <Button type="primary" size="large" className="bg-[#0a4031] hover:!bg-[#083327]" onClick={nextStep}>
                                    Continue →
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="max-w-lg mx-auto py-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">How much do you need?</h3>
                        <p className="text-gray-500 mb-6">Let us know how we can help grow your business.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Funding Amount <span className="text-red-500">*</span>
                                </label>
                                <Input placeholder="e.g 500,000" size="large" prefix="₦" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Purpose of funds <span className="text-red-500">*</span>
                                </label>
                                <Select placeholder="Select purpose" className="w-full" size="large">
                                    <Option value="inventory">Inventory Restock</Option>
                                    <Option value="equipment">Equipment Purchase</Option>
                                    <Option value="marketing">Marketing & Ads</Option>
                                    <Option value="expansion">Business Expansion</Option>
                                </Select>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button size="large" onClick={prevStep}>Back</Button>
                                <Button type="primary" size="large" className="bg-[#0a4031] hover:!bg-[#083327]" onClick={nextStep}>
                                    Review Application
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="max-w-lg mx-auto py-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircleFilled className="text-[#0a4031] text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Application Received!</h3>
                        <p className="text-gray-500 mb-6">
                            Thanks for submitting your request. Check your email for next steps. Our team will review your application within 24 hours.
                        </p>
                        <Button type="primary" size="large" className="bg-[#0a4031] hover:!bg-[#083327]" onClick={() => setCurrentStep(0)}>
                            Back to Wallet
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Simple Heart Icon Component
function HeartIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={className}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    )
}
