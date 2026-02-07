"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  BarChartOutlined,
  WalletOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  MenuOutlined,
  BellOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Progress } from "antd";
import conts from "@/lib/conts";

// Menu Items Configuration
const VENDOR_MENU_ITEMS = [
  {
    name: "Overview",
    path: conts.paths.vendorDashboard,
    icon: <HomeOutlined />,
  },
  {
    name: "Orders Queue",
    path: conts.paths.vendorOrders,
    icon: <ShoppingOutlined />,
  },
  {
    name: "Special Events",
    path: "/vendor/dashboard/special-events", // Updated path
    icon: <CalendarOutlined />,
  },
  {
    name: "Analytics",
    path: "/vendor/dashboard/analytics", // Updated path
    icon: <BarChartOutlined />,
  },
  {
    name: "Wallet",
    path: "/vendor/dashboard/wallet", // Updated path
    icon: <WalletOutlined />,
  },
  {
    name: "Profile Management",
    path: "/vendor/dashboard/profile-management", // Updated path
    icon: <UserOutlined />,
  },
  {
    name: "Support & FAQ",
    path: "/vendor/dashboard/support", // Updated path
    icon: <QuestionCircleOutlined />,
  },
];

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Compliance Status Footer Component
  const menuFooter = (
    <div className="bg-gray-50 rounded-xl p-4 mt-4 mx-4 mb-4">
      <h4 className="text-orange-500 font-bold text-xs mb-1">Compliance Status</h4>
      <p className="text-[10px] text-gray-500 mb-2">NAFDAC verification in progress</p>
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
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen w-64 shrink-0 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6">
          <h1 className="text-xl font-bold text-[#0a4031]">EaseMeals</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-900"
          >
            <CloseOutlined />
          </button>
        </div>

        <p className="px-6 text-xs text-gray-400 font-medium mb-2">Vendor Dashboard</p>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4">
          <ul className="space-y-1">
            {VENDOR_MENU_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                      ? "bg-[#0a4031]/5 text-[#0a4031] font-bold border-r-4 border-[#0a4031]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {menuFooter}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 text-xl"
            >
              <MenuOutlined />
            </button>
            <h2 className="text-lg font-bold text-[#0a4031] hidden sm:block">
              {VENDOR_MENU_ITEMS.find(i => i.path === pathname)?.name || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Badge count={2} dot offset={[-2, 2]} color="#f97316">
              <BellOutlined className="text-xl text-gray-500 cursor-pointer hover:text-gray-700" />
            </Badge>

            <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-100">
              <Avatar style={{ backgroundColor: '#0a4031', verticalAlign: 'middle' }}>
                JD
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900 leading-none">John Doe</p>
                <span className="text-[10px] text-gray-400">Vendor</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
