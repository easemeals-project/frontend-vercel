"use client";

import React, { useState } from "react";
import {
    CalendarOutlined,
    ShoppingOutlined,
    DollarOutlined,
    UserOutlined,
    StarOutlined,
    DownOutlined,
} from "@ant-design/icons";
import { Select, DatePicker, Table, Tag } from "antd";
import { Line, Pie, Column } from "@ant-design/charts";
import { BsCurrencyDollar, BsBag } from "react-icons/bs";

const { Option } = Select;

export default function VendorAnalyticsPage() {
    const [timeRange, setTimeRange] = useState("This Month");

    // Mock Data for Charts
    const monthlyPerformanceData = [
        { month: "Jan", orders: 38 },
        { month: "Feb", orders: 52 },
        { month: "Mar", orders: 61 },
        { month: "Apr", orders: 145 },
        { month: "May", orders: 48 },
        { month: "Jun", orders: 38 },
    ];

    const serviceBreakdownData = [
        { type: "Lunch Delivery", value: 45 },
        { type: "Dinner Delivery", value: 30 },
        { type: "Special Events", value: 15 },
        { type: "Breakfast", value: 10 },
    ];

    const topSellingItems = [
        {
            key: "1",
            item: "Jollof Rice with Chicken",
            orders: 42,
            revenue: "₦147,000",
            growth: "+ 18%",
        },
        {
            key: "2",
            item: "Egusi Soup with Pounded Yam",
            orders: 38,
            revenue: "₦171,000",
            growth: "+ 12%",
        },
        {
            key: "3",
            item: "Fried Rice with Beef",
            orders: 29,
            revenue: "₦101,500",
            growth: "+ 3%",
        },
        {
            key: "4",
            item: "Moi Moi",
            orders: 24,
            revenue: "₦24,000",
            growth: "+ 22%",
        },
    ];

    // Chart Configs
    const columnConfig = {
        data: monthlyPerformanceData,
        xField: "month",
        yField: "orders",
        color: "#0a4031",
        columnStyle: {
            radius: [4, 4, 0, 0],
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
    };

    const pieConfig = {
        appendPadding: 10,
        data: serviceBreakdownData,
        angleField: "value",
        colorField: "type",
        radius: 0.8,
        innerRadius: 0.6,
        label: {
            type: "inner",
            offset: "-30%",
            content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: "center",
            },
        },
        interactions: [{ type: "element-active" }],
    };

    const columns = [
        {
            title: "ITEM",
            dataIndex: "item",
            key: "item",
            render: (text: string) => <span className="font-medium text-gray-900">{text}</span>,
        },
        {
            title: "ORDERS",
            dataIndex: "orders",
            key: "orders",
        },
        {
            title: "REVENUE",
            dataIndex: "revenue",
            key: "revenue",
        },
        {
            title: "GROWTH",
            dataIndex: "growth",
            key: "growth",
            render: (text: string) => (
                <span className="text-[#0a4031] font-medium">{text}</span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                    <p className="text-gray-500 text-sm">Monitor your business performance and track growth</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-gray-100 rounded-lg p-1 flex items-center">
                        <span className="text-xs font-medium text-gray-500 px-2">Time Range:</span>
                        <Select
                            defaultValue="This Month"
                            variant="borderless"
                            className="min-w-[100px]"
                            onChange={setTimeRange}
                        >
                            <Option value="This Week">This Week</Option>
                            <Option value="This Month">This Month</Option>
                            <Option value="Last Month">Last Month</Option>
                            <Option value="This Year">This Year</Option>
                        </Select>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <CalendarOutlined /> Custom Range
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Orders"
                    value="125"
                    trend="+ 12.5%"
                    trendLabel="vs last month"
                    icon={<ShoppingOutlined className="text-[#0a4031]" />}
                    iconBg="bg-green-50"
                />
                <StatsCard
                    title="Total Revenue"
                    value="₦500,000"
                    trend="+ 8.2%"
                    trendLabel="vs last month"
                    icon={<BsCurrencyDollar className="text-orange-600" />}
                    iconBg="bg-orange-50"
                />
                <StatsCard
                    title="Average Order Value"
                    value="₦4,000"
                    trend="- 2.1%"
                    trendDown
                    trendLabel="vs last month"
                    icon={<div className="text-blue-600 font-bold text-lg">↗</div>}
                    iconBg="bg-blue-50"
                />
                <StatsCard
                    title="Customer Satisfaction"
                    value="4.8/5"
                    trend="+ 0.3"
                    trendLabel="vs last month"
                    icon={<StarOutlined className="text-yellow-600" />}
                    iconBg="bg-yellow-50"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-[60%_auto] gap-6">
                {/* Monthly Performance */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-1 h-5 bg-[#0a4031] rounded-full"></div>
                        Monthly Performance
                    </h3>
                    <div className="h-[300px]">
                        <Column {...columnConfig} />
                    </div>
                </div>

                {/* Service Breakdown */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                        Service Breakdown
                    </h3>
                    <div className="h-[300px]">
                        <Pie {...pieConfig} />
                    </div>
                </div>
            </div>

            {/* Top Selling Items */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Top Selling Items</h3>
                    <button className="text-[#0a4031] text-sm font-medium hover:underline">View All</button>
                </div>
                <Table
                    columns={columns}
                    dataSource={topSellingItems}
                    pagination={false}
                    className="no-border-table"
                />
            </div>
        </div>
    );
}

// --- Helper Components ---

function StatsCard({ title, value, trend, trendLabel, trendDown, icon, iconBg }: any) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <span className={`font-medium ${trendDown ? "text-red-500" : "text-[#0a4031]"}`}>
                    {trend}
                </span>
                <span className="text-gray-400">{trendLabel}</span>
            </div>
        </div>
    );
}
