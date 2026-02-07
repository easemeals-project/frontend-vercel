"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    MenuOutlined,
    SearchOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import { Input, Tag, Button, List, Spin } from "antd";
import Sidebar from "../_components/Sidebar";
import { useQuery } from "@apollo/client/react";
import { GET_MY_ORDERS } from "@/graphql/queries";
import { GetMyOrdersResult, Order } from "@/lib/types";

export default function MyOrdersPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    const { data, loading } = useQuery<GetMyOrdersResult>(GET_MY_ORDERS);

    // Filter logic could be added here
    const orders = data?.myOrders || [];
    const filteredOrders = orders.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchText.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return "green";
            case "SHIPPED":
                return "blue";
            case "PENDING":
                return "orange";
            case "CANCELLED":
                return "red";
            default:
                return "default";
        }
    };

    return (
        <div className="min-h-screen bg-app_bg flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white sticky shadow-sm p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-text1"
                            >
                                <MenuOutlined className="text-xl" />
                            </button>
                            <h1 className="text-2xl font-bold text-text1">My Orders</h1>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100/50 max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-6">
                            <Input
                                prefix={<SearchOutlined className="text-text2" />}
                                placeholder="Search order ID"
                                className="max-w-md"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-12">
                                <Spin size="large" />
                            </div>
                        ) : (
                            <List
                                itemLayout="horizontal"
                                dataSource={filteredOrders}
                                renderItem={(order) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                key="view"
                                                type="link"
                                                onClick={() =>
                                                    router.push(`/shopper/dashboard/orders/${order.id}`)
                                                }
                                            >
                                                View Details
                                            </Button>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-lg text-text1">
                                                        Order #{order.orderNumber}
                                                    </span>
                                                    <Tag color={getStatusColor(order.status)}>
                                                        {order.status}
                                                    </Tag>
                                                </div>
                                            }
                                            description={
                                                <div className="flex flex-col gap-1 mt-1">
                                                    <div className="text-text2 flex items-center gap-2">
                                                        <CalendarOutlined /> Placed on {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-text1 font-medium">
                                                        Total: ${order.totalPrice.toFixed(2)}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                        {!loading && filteredOrders.length === 0 && (
                            <div className="text-center py-12 text-text2">No orders found.</div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
