"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  WalletOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CloseOutlined } from "@ant-design/icons";
import conts from "@/lib/conts";
import { SidebarProps } from "@/lib/types";

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Timetable",
      path: conts.paths.timetable,
      icon: <CalendarOutlined />,
    },
    {
      name: "Vendors",
      path: conts.paths.vendors,
      icon: <ShopOutlined />,
    },
    {
      name: "Schedule",
      path: conts.paths.schedule,
      icon: <ClockCircleOutlined />,
    },
    {
      name: "Wallet",
      path: conts.paths.wallet,
      icon: <WalletOutlined />,
    },
    {
      name: "Event",
      path: conts.paths.event,
      icon: <CalendarOutlined />,
    },
    {
      name: "Profile",
      path: conts.paths.profile,
      icon: <UserOutlined />,
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 opacity-50 bg-black z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:h-screen w-64`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-text1">Menu</h2>
            <button
              onClick={onClose}
              className="lg:hidden text-text2 hover:text-text1"
            >
              <CloseOutlined />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-orange-100 text-app_secondary"
                          : "text-text2 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <p className="text-sm text-text2 text-center">Weekly Meal Plan</p>
          </div>
        </div>
      </aside>
    </>
  );
}
