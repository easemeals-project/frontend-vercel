"use client";

import React, { useState, useEffect } from "react";
import {
    UserOutlined,
    CameraOutlined,
    ClockCircleOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { Input, Button, TimePicker, Checkbox, Avatar, Form, message, Spin } from "antd";
import { BsShop } from "react-icons/bs";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_VENDOR_PROFILE } from "@/graphql/queries";
import { UPSERT_VENDOR_PROFILE, SET_BUSINESS_HOURS, UPDATE_VENDOR_PICTURE } from "@/graphql/mutations";
import {
    GetMyVendorProfileResult,
    UpsertVendorProfileResult,
    UpsertVendorProfileVariables,
    SetBusinessHoursResult,
    SetBusinessHoursVariables,
    UpdateVendorPictureResult,
    UpdateVendorPictureVariables,
    Vendor
} from "@/lib/types";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function VendorProfileManagementPage() {
    const [activeTab, setActiveTab] = useState("1");

    const { data, loading, error, refetch } = useQuery<GetMyVendorProfileResult>(GET_MY_VENDOR_PROFILE);

    if (loading) return <div className="flex justify-center p-12"><Spin size="large" /></div>;
    if (error) return <div className="p-12 text-red-500 text-center">Error loading profile: {error.message}</div>;

    const vendor = data?.myVendorProfile;

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
                {activeTab === "1" ? (
                    <GeneralProfileForm vendor={vendor} onUpdate={refetch} />
                ) : (
                    <OperatingHoursForm vendor={vendor} onUpdate={refetch} />
                )}
            </div>
        </div>
    );
}

function GeneralProfileForm({ vendor, onUpdate }: { vendor?: Vendor; onUpdate: () => void }) {
    const [form] = Form.useForm();
    const [upsertProfile, { loading: saving }] = useMutation<UpsertVendorProfileResult, UpsertVendorProfileVariables>(UPSERT_VENDOR_PROFILE);
    const [updatePicture, { loading: uploading }] = useMutation<UpdateVendorPictureResult, UpdateVendorPictureVariables>(UPDATE_VENDOR_PICTURE);

    useEffect(() => {
        if (vendor) {
            form.setFieldsValue({
                businessName: vendor.businessName,
                ownerName: vendor.ownerName,
                email: vendor.email,
                phone: vendor.phone,
                address: vendor.address,
                description: vendor.description,
            });
        }
    }, [vendor, form]);

    const onFinish = async (values: any) => {
        try {
            await upsertProfile({
                variables: {
                    input: {
                        businessName: values.businessName,
                        ownerName: values.ownerName,
                        email: values.email,
                        phone: values.phone,
                        address: values.address,
                        description: values.description,
                    }
                }
            });
            message.success("Profile updated successfully");
            onUpdate();
        } catch (err: any) {
            message.error("Failed to update profile: " + err.message);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await updatePicture({ variables: { file } });
            message.success("Picture updated successfully");
            onUpdate();
        } catch (err: any) {
            message.error("Failed to upload picture: " + err.message);
        }
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                    <div className="relative group">
                        <Avatar
                            size={120}
                            src={vendor?.pictureURL}
                            icon={!vendor?.pictureURL && <UserOutlined />}
                            className="bg-gray-100 text-gray-400"
                        />
                        <label className="absolute bottom-0 right-0 bg-[#0a4031] w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white cursor-pointer hover:bg-[#083327] transition-colors">
                            <CameraOutlined />
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 text-center max-w-[150px]">
                        Allowed formats: JPG, PNG. Max size: 2MB.
                    </p>
                    {uploading && <Spin size="small" />}
                </div>

                {/* Form Fields */}
                <div className="flex-1">
                    <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item name="businessName" label="Business Name" rules={[{ required: true }]}>
                                <Input size="large" prefix={<BsShop className="text-gray-400" />} />
                            </Form.Item>
                            <Form.Item name="ownerName" label="Owner Name" rules={[{ required: true }]}>
                                <Input size="large" prefix={<UserOutlined className="text-gray-400" />} />
                            </Form.Item>
                            <Form.Item name="email" label="Email">
                                <Input size="large" disabled />
                            </Form.Item>
                            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                                <Input size="large" prefix={<span className="text-gray-400 text-xs">🇳🇬</span>} />
                            </Form.Item>
                        </div>

                        <Form.Item name="address" label="Business Address" rules={[{ required: true }]}>
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item name="description" label="Business Description">
                            <TextArea rows={4} showCount maxLength={500} />
                        </Form.Item>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />} loading={saving} className="bg-[#0a4031] hover:!bg-[#083327]">
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

function OperatingHoursForm({ vendor, onUpdate }: { vendor?: Vendor; onUpdate: () => void }) {
    const [setHours, { loading: saving }] = useMutation<SetBusinessHoursResult, SetBusinessHoursVariables>(SET_BUSINESS_HOURS);
    const [form] = Form.useForm();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    useEffect(() => {
        if (vendor?.hours) {
            const values: any = {};
            vendor.hours.forEach(h => {
                const dayName = days[h.dayOfWeek];
                values[`open_${dayName}`] = h.isOpen;
                values[`time_${dayName}`] = h.isOpen ? [dayjs(h.openTime, "HH:mm"), dayjs(h.closeTime, "HH:mm")] : null;
            });
            form.setFieldsValue(values);
        }
    }, [vendor, form]);

    const handleSave = async (values: any) => {
        const hoursInput = days.map((day, index) => {
            const isOpen = values[`open_${day}`] || false;
            const times = values[`time_${day}`];
            return {
                dayOfWeek: index,
                isOpen,
                openTime: isOpen && times ? times[0].format("HH:mm") : "09:00",
                closeTime: isOpen && times ? times[1].format("HH:mm") : "18:00",
            };
        });

        try {
            await setHours({ variables: { hours: hoursInput } });
            message.success("Operating hours saved");
            onUpdate();
        } catch (err: any) {
            message.error("Failed to save hours: " + err.message);
        }
    };

    return (
        <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Operating Hours</h3>

            <Form form={form} onFinish={handleSave} className="space-y-4">
                {days.map((day) => (
                    <div key={day} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                        <div className="w-28 font-medium text-gray-700">{day}</div>
                        <Form.Item name={`open_${day}`} valuePropName="checked" noStyle>
                            <Checkbox>Open</Checkbox>
                        </Form.Item>
                        <Form.Item
                            noStyle
                            shouldUpdate={(prev, curr) => prev[`open_${day}`] !== curr[`open_${day}`]}
                        >
                            {({ getFieldValue }) => (
                                <div className="flex-1 flex gap-4 items-center">
                                    <Form.Item name={`time_${day}`} noStyle>
                                        <TimePicker.RangePicker
                                            className="w-full max-w-xs"
                                            format="h:mm a"
                                            disabled={!getFieldValue(`open_${day}`)}
                                        />
                                    </Form.Item>
                                </div>
                            )}
                        </Form.Item>
                    </div>
                ))}

                <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                    <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />} loading={saving} className="bg-[#0a4031] hover:!bg-[#083327]">
                        Save Schedule
                    </Button>
                </div>
            </Form>
        </div>
    );
}
