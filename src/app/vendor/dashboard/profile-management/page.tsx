"use client";

import React, { useState } from "react";
import {
    UserOutlined,
    CameraOutlined,
    ClockCircleOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { Input, Button, Tabs, TimePicker, Checkbox, Avatar, Upload, Form } from "antd";
import { BsShop } from "react-icons/bs";

const { TextArea } = Input;
const { RangePicker } = TimePicker;

export default function VendorProfileManagementPage() {
    const [activeTab, setActiveTab] = useState("1");

    const items = [
        {
            key: "1",
            label: (
                <span className="flex items-center gap-2">
                    <UserOutlined /> General
                </span>
            ),
            children: <GeneralProfileForm />,
        },
        {
            key: "2",
            label: (
                <span className="flex items-center gap-2">
                    <ClockCircleOutlined /> Hours
                </span>
            ),
            children: <OperatingHoursForm />,
        },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Profile Management</h2>
                    <p className="text-gray-500 text-sm">Update your vendor profile information and settings.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "1" ? "bg-[#0a4031] text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"}`}
                        onClick={() => setActiveTab("1")}
                    >
                        General
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "2" ? "bg-[#0a4031] text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"}`}
                        onClick={() => setActiveTab("2")}
                    >
                        Hours
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {activeTab === "1" ? <GeneralProfileForm /> : <OperatingHoursForm />}
            </div>
        </div>
    );
}

function GeneralProfileForm() {
    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                    <div className="relative group">
                        <Avatar size={120} icon={<UserOutlined />} className="bg-gray-100 text-gray-400" />
                        <div className="absolute bottom-0 right-0 bg-[#0a4031] w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white cursor-pointer hover:bg-[#083327] transition-colors">
                            <CameraOutlined />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center max-w-[150px]">
                        Allowed formats: JPG, PNG. Max size: 2MB.
                    </p>
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                            <Input size="large" defaultValue="John's Kitchen" prefix={<BsShop className="text-gray-400" />} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                            <Input size="large" defaultValue="John Doe" prefix={<UserOutlined className="text-gray-400" />} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <Input size="large" defaultValue="john@example.com" disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <Input size="large" defaultValue="+2348012345678" prefix={<span className="text-gray-400 text-xs">🇳🇬</span>} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                        <Input size="large" defaultValue="123 Lagos Street, Ikeja, Lagos" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                        <TextArea
                            rows={4}
                            defaultValue="We specialize in authentic Nigerian cuisine with a modern twist."
                            showCount
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-400 mt-1">Brief description of your food business. This will be visible to customers.</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <Button type="primary" size="large" icon={<SaveOutlined />} className="bg-[#0a4031] hover:!bg-[#083327]">
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OperatingHoursForm() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Operating Hours</h3>

            <div className="space-y-4">
                {days.map((day) => (
                    <div key={day} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                        <div className="w-28 font-medium text-gray-700">{day}</div>
                        <Checkbox defaultChecked={day !== "Sunday"}>Open</Checkbox>
                        <div className="flex-1 flex gap-4 items-center">
                            <TimePicker.RangePicker className="w-full max-w-xs" format="h:mm a" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                <Button type="primary" size="large" icon={<SaveOutlined />} className="bg-[#0a4031] hover:!bg-[#083327]">
                    Save Schedule
                </Button>
            </div>
        </div>
    );
}
