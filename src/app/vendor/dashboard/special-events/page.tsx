"use client";

import React, { useState } from "react";
import {
    CalendarOutlined,
    PlusOutlined,
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
    MoreOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Input, Button, Dropdown, MenuProps, Tag, Avatar } from "antd";
import { BsCalendar4Event } from "react-icons/bs";

const { Search } = Input;

// Mock Data
const events = [
    {
        id: 1,
        title: "Weekend House Party Package",
        date: "Jun 24 - Aug 31, 2023",
        description: "Perfect for weekend gatherings with friends. Includes a variety of finger foods, small chops, and main dishes.",
        price: "₦58,000",
        people: "5-10 people",
        orders: 39,
        revenue: "₦580,000",
        status: "Active",
        image: "/images/events/party.jpg", // Placeholder
    },
    {
        id: 2,
        title: "Corporate Lunch Package",
        date: "Jun 15 - Jun 30, 2023",
        description: "Professional catering service for office meetings and corporate events. Includes main dishes, sides, and desserts.",
        price: "₦45,000",
        people: "10-15 people",
        orders: 45,
        revenue: "₦675,000",
        status: "Active",
        image: "/images/events/corporate.jpg", // Placeholder
    },
    {
        id: 3,
        title: "Birthday Party Special",
        date: "Jun 1 - Jul 31, 2023",
        description: "Make your birthday celebration special with our curated menu including appetizers, main course, and a complimentary cake.",
        price: "₦30,000",
        people: "10-12 people",
        orders: 30,
        revenue: "₦100,000",
        status: "Active",
        image: "/images/events/birthday.jpg", // Placeholder
    },
    {
        id: 4,
        title: "Baby Shower Celebration",
        date: "Jun 10 - Jul 10, 2023",
        description: "Celebrate the upcoming arrival with our specially curated menu featuring finger foods, pastries, and refreshing beverages.",
        price: "₦18,000",
        people: "15-20 people",
        orders: 48,
        revenue: "₦120,000",
        status: "Active",
        image: "/images/events/baby-shower.jpg", // Placeholder
    },
];

export default function VendorSpecialEventsPage() {
    const [filterStatus, setFilterStatus] = useState("All");

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: "Edit Event",
        },
        {
            key: "2",
            label: "Duplicate",
        },
        {
            key: "3",
            label: "Deactivate",
            danger: true,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Special Events</h2>
                    <p className="text-gray-500 text-sm">Create and manage special offers for occasions like birthday parties, baby showers, or catering events.</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} className="bg-[#0a4031] hover:!bg-[#083327]">
                    Create New Event
                </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <StatItem label="Active Events" value="4" subtext="Current running special events" />
                <StatItem label="Upcoming Events" value="2" subtext="Scheduled to start soon" />
                <StatItem label="Total Revenue" value="₦445,250.00" subtext="From all special events this month" />
                <StatItem label="Bookings Accepted" value="18" subtext="Total events booked this month" />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex-1">
                    <Search placeholder="Search events..." allowClear />
                </div>
                <div className="flex gap-2">
                    <Button icon={<FilterOutlined />}>All Categories</Button>
                    <Button icon={<FilterOutlined />}>Filter</Button>
                    <Button icon={<SortAscendingOutlined />}>Sort by: Recent</Button>
                </div>
            </div>

            {/* Events List */}
            <div className="space-y-4">
                {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row">
                            {/* Image Placeholder */}
                            <div className="w-full md:w-48 h-48 bg-gray-200 shrink-0 relative">
                                {/* Replace with actual Image component */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <BsCalendar4Event className="text-4xl" />
                                </div>
                                <div className="absolute top-2 left-2">
                                    <Tag color="success">{event.status}</Tag>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                                        <Dropdown menu={{ items }} placement="bottomRight">
                                            <Button type="text" icon={<MoreOutlined />} className="text-gray-400" />
                                        </Dropdown>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                                        <CalendarOutlined /> {event.date}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-50">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Price</p>
                                        <p className="text-sm font-bold text-gray-900">{event.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Person</p>
                                        <p className="text-sm font-bold text-gray-900">{event.people}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Orders</p>
                                        <p className="text-sm font-bold text-gray-900">{event.orders}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Revenue</p>
                                        <p className="text-sm font-bold text-gray-900">{event.revenue}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/50 min-w-[150px]">
                                <Button type="primary" className="bg-[#0a4031] hover:!bg-[#083327] w-full mb-2">Accept Booking</Button>
                                <Button type="text" className="text-blue-600 hover:text-blue-700 w-full text-xs">View Menu Details</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatItem({ label, value, subtext }: { label: string, value: string, subtext: string }) {
    return (
        <div className="p-2">
            <p className="text-xs text-gray-500 mb-1 font-medium">{label}</p>
            <h4 className="text-xl font-bold text-gray-900 mb-1">{value}</h4>
            <p className="text-[10px] text-gray-400">{subtext}</p>
        </div>
    );
}
