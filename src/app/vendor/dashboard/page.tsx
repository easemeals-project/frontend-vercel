"use client";

import React from "react";
import {
  ShoppingOutlined,
  UserOutlined,
  StarOutlined,
  CheckCircleFilled,
  CalendarOutlined,
  RightOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Button, Progress, Tag } from "antd";
import Link from "next/link";
import { BsCurrencyDollar } from "react-icons/bs";
import { FiCheckCircle } from "react-icons/fi";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { FiClipboard } from "react-icons/fi";

export default function VendorDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      </div>

      {/* Welcome & Stats Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Welcome, John!
            </h3>
            <p className="text-gray-500 text-sm">
              Here's what's happening with your vendor account today.
            </p>
          </div>
          <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 mt-2 md:mt-0">
            <ClockCircleOutlined /> Pending Approval
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<ShoppingOutlined className="text-[#0a4031]! text-lg" />}
            label="Orders"
            value="15"
            icon_bg="bg-green-50"
            bg="bg-gray-50"
          />
          <StatCard
            icon={<BsCurrencyDollar className="text-orange-600! text-lg" />}
            label="Revenue"
            value="₦24.5K"
            icon_bg="bg-orange-50"
            bg="bg-gray-50"
          />
          <StatCard
            icon={<UserOutlined className="text-blue-600! text-lg" />}
            label="Customers"
            value="42"
            icon_bg="bg-blue-50"
            bg="bg-gray-50"
          />
          <StatCard
            icon={<StarOutlined className="text-yellow-600! text-lg" />}
            label="Rating"
            value="4.8/5"
            icon_bg="bg-yellow-50"
            bg="bg-gray-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[65%_auto] gap-4">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Approval Status */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <SafetyCertificateOutlined className="text-[#0a4031]" /> Approval Status
              </h3>
              <Link href="#" className="text-[#0a4031] text-xs font-semibold hover:underline flex items-center gap-1">
                View Details <RightOutlined size={10} />
              </Link>
            </div>

            <div className="space-y-4 mb-6">
              <ProgressBar label="Profile completion" percent={80} />
              <ProgressBar label="Document verification" percent={100} />
              <ProgressBar label="NAFDAC compliance" percent={60} color="orange" />
            </div>

            {/* Callout */}
            <div className="bg-gray-100 rounded-lg p-4 border border-orange-100">
              <div className="flex items-start gap-3">
                <ExclamationCircleOutlined className="text-orange-500! text-lg mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Next Step: Complete NAFDAC Verification</h4>
                  <p className="text-xs text-gray-500 mb-3">Your sample pickup has been scheduled. NAFDAC will contact you for inspection within 5-7 business days.</p>
                  <Button type="primary" className="bg-orange-500! hover:bg-orange-600! border-none h-8 text-xs font-semibold shadow-none">
                    View Compliance Status
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900">Recent Activity</h3>
              <Link href="#" className="text-[#0a4031] text-xs font-semibold hover:underline flex items-center gap-1">
                View all <RightOutlined size={10} />
              </Link>
            </div>

            <div className="space-y-6">
              <ActivityItem
                title="NAFDAC sample pickup scheduled"
                time="Today, 10:30 AM"
                status="Completed"
                statusColor="green"
              />
              <ActivityItem
                title="Compliance payment processed"
                time="Yesterday, 2:15 PM"
                status="Completed"
                statusColor="green"
              />
              <ActivityItem
                title="Document verification"
                time="Jun 12, 2023"
                status="Approved"
                statusColor="blue"
              />
              <ActivityItem
                title="New customer review received"
                time="Jun 10, 2023"
                status="New"
                statusColor="yellow"
              />
              <ActivityItem
                title="Menu items updated"
                time="Jun 8, 2023"
                status="Completed"
                statusColor="green"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Next Steps */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-[#0a4031]" /> Next Steps
            </h3>
            <div className="space-y-3">
              <StepItem label="Complete registration" completed />
              <StepItem label="Upload required documents" completed />
              <StepItem label="Complete NAFDAC verification" active />
              <StepItem label="Add menu items to your store" number={4} />
              <StepItem label="Set up payment methods" number={5} />
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarOutlined className="text-[#0a4031]" /> Upcoming Events
            </h3>
            <div className="space-y-4">
              <EventItem
                icon={<FiClipboard className="text-orange-500!" />}
                bg="bg-orange-50"
                title="NAFDAC Inspection"
                date="Jun 20, 2023 at 10:00 AM"
              />
              <EventItem
                icon={<FaRegUserCircle className="text-blue-500!" />}
                bg="bg-blue-50"
                title="Food Safety Training"
                date="Jun 25, 2023 at 2:00 PM"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 text-center">
              <Link href="#" className="text-[#0a4031] text-xs font-semibold flex items-center justify-center gap-1 hover:underline">
                View Calendar <RightOutlined />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <QuickLinkButton icon={<ShoppingOutlined />} label="Orders" />
              <QuickLinkButton icon={<UserOutlined />} label="Profile" />
              <QuickLinkButton icon={<BarChartOutlined />} label="Analytics" />
              <QuickLinkButton icon={<QuestionCircleOutlined />} label="Support" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function StatCard({ icon, icon_bg, label, value, bg }: { icon: React.ReactNode, icon_bg: string, label: string, value: string, bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-4 flex items-center gap-3`}>
      <div className={`${icon_bg} w-10 h-10 rounded-md flex items-center justify-center shadow-sm shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ProgressBar({ label, percent, color = "green" }: { label: string, percent: number, color?: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-xs font-bold text-gray-900">{percent}%</span>
      </div>
      <Progress
        percent={percent}
        showInfo={false}
        strokeColor={color === "orange" ? "#f97316" : "#22c55e"}
        trailColor="#f3f4f6"
        size="default"
      />
    </div>
  );
}

function ActivityItem({ title, time, status, statusColor }: { title: string, time: string, status: string, statusColor: string }) {
  const badgeColors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  // Icon selection based on statusColor/Title to match simplified image interpretation
  let IconComponent = <FiCheckCircle className="text-green-500 text-lg" />;
  if (statusColor === "green" || title.includes("verification")) {
    IconComponent = <div className="p-1 rounded-full bg-blue-100"><FiCheckCircle className="text-blue-500" /></div>; // Fallback
  }

  if (title.includes("NAFDAC") || title.includes("Compliance") || title.includes("Menu")) {
    IconComponent = <FiCheckCircle className="text-green-500" />;
  }
  if (title.includes("Document")) {
    IconComponent = <FiCheckCircle className="text-blue-500" />;
  }
  if (title.includes("review")) {
    IconComponent = <AiOutlineExclamationCircle className="text-yellow-500!" />;
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${badgeColors[statusColor]}`}>
          {IconComponent}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 mb-0.5">{title}</p>
          <p className="text-xs text-gray-400">{time}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${badgeColors[statusColor]}`}>
        {status}
      </span>
    </div>
  );
}

function StepItem({ label, completed, active, number }: { label: string, completed?: boolean, active?: boolean, number?: number }) {
  return (
    <div className="flex items-center gap-2">
      {completed ? (
        <FiCheckCircle className="text-green-500" />
      ) : active ? (
        <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shadow-sm ring-2 ring-orange-100">
          {number || "3"}
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs">
          {number}
        </div>
      )}
      <span className={`text-sm ${completed ? "text-gray-400 line-through decoration-gray-400" : active ? "text-gray-900 font-bold" : "text-gray-500"}`}>
        {label}
      </span>
    </div>
  );
}

function EventItem({ icon, bg, title, date }: { icon: React.ReactNode, bg: string, title: string, date: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white">
      <div className={`${bg} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900 mb-0.5">{title}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  );
}

function QuickLinkButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex flex-col items-center justify-center py-6 px-4 rounded-xl border border-gray-100 hover:border-green-500 hover:shadow-sm transition-all bg-white group h-32">
      <span className="text-2xl text-green-600 mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">
        {label}
      </span>
    </button>
  );
}
