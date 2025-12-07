"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloseOutlined } from "@ant-design/icons";

import { ReactNode } from "react";

export interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  title?: string;
  footer?: ReactNode;
}

export default function DashboardSidebar({
  isOpen,
  onClose,
  menuItems,
  title = "Menu",
  footer
}: DashboardSidebarProps) {
  const pathname = usePathname();

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
        } lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen w-64 shrink-0 overflow-y-auto`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-app_primary">{title}</h2>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-900"
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
                          ? "bg-green-50 text-app_primary"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* FooterContent */}
          {footer && (
            <div className="mt-auto pt-4 border-t border-gray-100">
              {footer}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
