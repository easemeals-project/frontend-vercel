"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_MY_ORDER } from "@/graphql/queries";
import { GetMyOrderResult } from "@/lib/types";
import {
    Steps,
    Spin,
    Card,
    Descriptions,
    List,
    Button,
    Tag,
    Result,
    Divider,
} from "antd";
import {
    LeftOutlined,
    ShoppingCartOutlined,
    EnvironmentOutlined,
    ScheduleOutlined,
    CheckCircleOutlined,
    CarOutlined,
    SolutionOutlined,
} from "@ant-design/icons";
import Sidebar from "../../_components/Sidebar";

export default function OrderTrackingPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id) : 0;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { data, loading, error } = useQuery<GetMyOrderResult>(GET_MY_ORDER, {
        variables: { id: orderId },
        skip: !orderId,
    });

    const order = data?.myOrder;

    const getStepStatus = (currentStatus: string) => {
        const steps = ["PENDING", "SHIPPED", "DELIVERED"];
        const currentIndex = steps.indexOf(currentStatus);
        return currentIndex;
    };

    const currentStep = order ? getStepStatus(order.status) : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-app_bg flex items-center justify-center">
                <Spin size="large" tip="Loading order details..." />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-app_bg flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col p-8">
                    <Button icon={<LeftOutlined />} onClick={() => router.back()} className="w-fit mb-4">Back to Orders</Button>
                    <Result status="404" title="Order not found" subTitle="The order you are looking for does not exist or you do not have permission to view it." />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app_bg flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white sticky shadow-sm p-4 lg:p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button icon={<LeftOutlined />} onClick={() => router.back()} type="text" />
                            <h1 className="text-2xl font-bold text-text1">Order #{order.orderNumber}</h1>
                            <Tag color={order.status === "DELIVERED" ? "green" : "blue"}>{order.status}</Tag>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-5xl mx-auto space-y-6">

                        {/* Tracking Progress */}
                        <Card className="rounded-2xl shadow-sm border-gray-100">
                            <Steps current={currentStep} className="p-4">
                                <Steps.Step title="Order Placed" description={new Date(order.createdAt).toLocaleDateString()} icon={<SolutionOutlined />} />
                                <Steps.Step title="Shipped" description={order.shippedAt ? new Date(order.shippedAt || "").toLocaleDateString() : "Pending"} icon={<CarOutlined />} />
                                <Steps.Step title="Delivered" description={order.deliveredAt ? new Date(order.deliveredAt || "").toLocaleDateString() : "Pending"} icon={<CheckCircleOutlined />} />
                            </Steps>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Order Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card title="Items" className="rounded-2xl shadow-sm border-gray-100">
                                    <List
                                        dataSource={order.orderItems}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<ShoppingCartOutlined className="text-2xl text-app_secondary" />}
                                                    title={<span className="font-semibold">{item.meal.name}</span>}
                                                    description={`Qty: ${item.quantity} x $${item.price.toFixed(2)}`}
                                                />
                                                <div className="font-bold text-text1">${(item.quantity * item.price).toFixed(2)}</div>
                                            </List.Item>
                                        )}
                                    />
                                    <Divider />
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Total</span>
                                        <span>${order.totalPrice.toFixed(2)}</span>
                                    </div>
                                </Card>
                            </div>

                            {/* Delivery Info */}
                            <div className="lg:col-span-1 space-y-6">
                                <Card title="Delivery Details" className="rounded-2xl shadow-sm border-gray-100">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-text2 text-sm flex items-center gap-2 mb-1"><EnvironmentOutlined /> Delivery Address</div>
                                            <div className="font-medium text-text1">{order.deliveryAddress || "N/A"}</div>
                                        </div>
                                        <div>
                                            <div className="text-text2 text-sm flex items-center gap-2 mb-1"><ScheduleOutlined /> Estimated Delivery</div>
                                            <div className="font-medium text-text1">{new Date(order.deliveryDate).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="rounded-2xl shadow-sm border-gray-100 bg-blue-50">
                                    <h3 className="font-bold text-blue-800 mb-2">Need Help?</h3>
                                    <p className="text-sm text-blue-600 mb-4">If you have any issues with your order, please contact our support team.</p>
                                    <Button type="primary" ghost className="bg-white">Contact Support</Button>
                                </Card>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
