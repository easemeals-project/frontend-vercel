"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/app/_components/DashboardSidebar";
import conts from "@/lib/conts";
import {
  HomeOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  BarChartOutlined,
  WalletOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  MenuOutlined,
  BellOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { IoChatbubbleOutline, IoWalletOutline } from "react-icons/io5";
import { BsBag, BsBarChart, BsCalendar4Event } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { Progress, Avatar, Badge } from "antd";

const VENDOR_MENU_ITEMS = [
  {
    name: "Overview",
    path: conts.paths.vendorDashboard,
    icon: <HomeOutlined />,
  },
  {
    name: "Orders Queue",
    path: conts.paths.vendorOrders,
    icon: <BsBag />,
  },
  {
    name: "Special Events",
    path: conts.paths.vendorEvents,
    icon: <BsCalendar4Event />,
  },
  {
    name: "Analytics",
    path: conts.paths.vendorAnalytics,
    icon: <BsBarChart />, // Or align-left icon like in image
  },
  {
    name: "Wallet",
    path: conts.paths.vendorWallet,
    icon: <IoWalletOutline />,
  },
  {
    name: "Profile Management",
    path: conts.paths.vendorProfile,
    icon: <FiUser />,
  },
  {
    name: "Support & FAQ",
    path: conts.paths.vendorSupport,
    icon: <IoChatbubbleOutline />,
  },
];

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Compliance Status Footer Component
  const menuFooter = (
      <div className="bg-gray-50 rounded-xl p-4 mt-2">
         <h4 className="text-orange-500 font-bold text-xs mb-1">Compliance Status</h4>
         <p className="text-xs text-gray-500 mb-2">NAFDAC verification in progress</p>
         <Progress 
           percent={60} 
           showInfo={false} 
           strokeColor="#f97316" 
           trailColor="#e5e7eb" 
           size="small" 
         />
      </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={VENDOR_MENU_ITEMS}
        title="EaseMeals"
        footer={menuFooter}
      />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top Header */}
        <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 text-xl"
            >
              <MenuOutlined />
            </button>
            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">
              EaseMeals
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-4">
               <Badge count={2} dot offset={[-2, 2]}>
                 <BellOutlined className="text-xl text-gray-600 cursor-pointer" />
               </Badge>
               <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar style={{ backgroundColor: '#4CAF50', verticalAlign: 'middle' }} size="large">
                    JD
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">John Doe</span>
               </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
           {children}
        </main>
      </div>
    </div>
  );
}
