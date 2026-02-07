"use client";

import React, { useState } from "react";
import {
    ClockCircleOutlined,
    MessageOutlined,
    CheckOutlined,
    CloseOutlined,
    FilterOutlined
} from "@ant-design/icons";
import { Button, Input, Tag, Divider } from "antd";

// --- Types ---
type OrderItem = {
    name: string;
    quantity: number;
    price: number;
};

type Order = {
    id: string;
    customerName: string;
    timeAgo: string;
    status: "pending" | "active" | "completed" | "cancelled";
    items: OrderItem[];
    total: number;
    isNew?: boolean;
};

// --- Mock Data ---
const MOCK_ORDERS: Order[] = [
    {
        id: "ORD-1234",
        customerName: "Aisha Mohammed",
        timeAgo: "10 minutes ago",
        status: "pending",
        isNew: true,
        items: [
            { name: "Jollof Rice with Chicken", quantity: 2, price: 3500 },
            { name: "Moin Moin", quantity: 1, price: 1000 },
        ],
        total: 8000,
    },
    {
        id: "ORD-1235",
        customerName: "Emmanuel Okonkwo",
        timeAgo: "15 minutes ago",
        status: "pending",
        isNew: true,
        items: [
            { name: "Egusi Soup with Pounded Yam", quantity: 1, price: 4500 },
            { name: "Zobo Drink", quantity: 2, price: 800 },
        ],
        total: 6100,
    },
    {
        id: "ORD-1238",
        customerName: "Sarah Johnson",
        timeAgo: "20 minutes ago",
        status: "pending",
        isNew: true,
        items: [
            { name: "Fried Rice with Beef", quantity: 1, price: 3500 },
            { name: "Chapman", quantity: 1, price: 1200 },
        ],
        total: 4700,
    },
];

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

    // --- Handlers ---
    const handleAccept = (orderId: string) => {
        // In real app: API call to update status
        setOrders(orders.filter(o => o.id !== orderId));
        console.log(`Accepted Order ${orderId}`);
    };

    const handleDecline = (orderId: string) => {
        // In real app: API call to update status
        setOrders(orders.filter(o => o.id !== orderId));
        console.log(`Declined Order ${orderId}`);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0a4031]">Orders Queue</h1>
                    <p className="text-gray-500 text-sm">Manage incoming orders in real-time</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 shadow-sm flex items-center gap-2">
                        Filter by: <span className="text-[#0a4031] font-bold">All Orders</span> <FilterOutlined />
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Pending Orders</h2>
                    <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-full">{orders.length} New</span>
                </div>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="border border-gray-100 rounded-xl p-5 hover:border-[#0a4031]/30 transition-all hover:shadow-md bg-white group"
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900">{order.id}</span>
                                            {order.isNew && (
                                                <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-yellow-200">New</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            From: <span className="font-medium text-gray-700">{order.customerName}</span>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <ClockCircleOutlined className="text-[10px]" />
                                                <span>Ordered: {order.timeAgo}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-lg text-[#0a4031]">₦{order.total.toLocaleString()}</div>
                                    <div className="text-xs text-gray-400">{order.items.length} items</div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="bg-gray-50/50 rounded-lg p-3 mb-4 space-y-2">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order Items</div>
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-gray-700"><span className="font-bold text-gray-900 mr-2">{item.quantity}x</span> {item.name}</span>
                                        <span className="text-gray-500 font-medium">₦{item.price.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <Divider className="my-4" />

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <Button
                                    icon={<MessageOutlined />}
                                    className="w-full sm:w-auto text-gray-500 border-gray-200 hover:text-[#0a4031] hover:border-[#0a4031]"
                                >
                                    Chat with Customer
                                </Button>

                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Button
                                        danger
                                        className="flex-1 sm:flex-none border-red-200 text-red-500 bg-red-50 hover:bg-red-100 hover:border-red-300 font-bold"
                                        onClick={() => handleDecline(order.id)}
                                    >
                                        Decline
                                    </Button>
                                    <Button
                                        type="primary"
                                        className="flex-1 sm:flex-none bg-[#0a4031] hover:!bg-[#083327] font-bold border-none"
                                        onClick={() => handleAccept(order.id)}
                                    >
                                        Accept Order
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {orders.length === 0 && (
                        <div className="text-center py-20">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckOutlined className="text-2xl text-gray-300" />
                            </div>
                            <h3 className="text-gray-900 font-bold mb-1">No Pending Orders</h3>
                            <p className="text-gray-500 text-sm">You're all caught up! New orders will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
