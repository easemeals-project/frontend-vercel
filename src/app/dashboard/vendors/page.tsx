"use client";

import { useState } from "react";
import { Card, Input, Tag } from "antd";
import {
  MenuOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  StarFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Sidebar from "../_components/Sidebar";
import Image from "next/image";

const vendors = [
  {
    id: 1,
    name: "Mama Put Kitchen",
    cuisine: "Nigerian",
    rating: 4.8,
    reviews: 234,
    deliveryTime: "30-45 min",
    distance: "2.3 km",
    image: "/home/1.png",
    scheduled: true,
    scheduleInfo: "Monday / Dinner",
    scheduleColor: "bg-[#F4511E]", // Orange for Dinner/Lunch
  },
  {
    id: 2,
    name: "Healthy Bites",
    cuisine: "Healthy",
    rating: 4.9,
    reviews: 189,
    deliveryTime: "25-35 min",
    distance: "1.8 km",
    image: "/home/2.png",
    scheduled: true,
    scheduleInfo: "Monday / Lunch",
    scheduleColor: "bg-[#00C853]", // Green for Lunch
  },
  {
    id: 3,
    name: "Jollof Express",
    cuisine: "Nigerian",
    rating: 4.7,
    reviews: 312,
    deliveryTime: "35-50 min",
    distance: "3.1 km",
    image: "/home/3.png",
    scheduled: false,
  },
  {
    id: 4,
    name: "The Green Bowl",
    cuisine: "Healthy",
    rating: 4.6,
    reviews: 156,
    deliveryTime: "20-30 min",
    distance: "1.5 km",
    image: "/home/4.png",
    scheduled: false,
  },
];

const categories = ["All Vendors", "Nigerian", "Continental", "Healthy", "Fast Food"];

export default function VendorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Vendors");

  const scheduledVendors = vendors.filter((v) => v.scheduled);
  const allVendors = vendors;

  return (
    <div className="min-h-screen bg-app_bg flex font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-text1 hover:text-app_primary transition-colors"
            >
              <MenuOutlined className="text-xl" />
            </button>
            <div className="hidden lg:block w-6" />
          </div>
          
          <h1 className="text-xl font-bold text-text1 absolute left-1/2 transform -translate-x-1/2">
            Food Vendor
          </h1>

          <div className="flex items-center gap-4">
            <button className="text-text2 hover:text-text1 transition-colors">
              <DownloadOutlined className="text-xl" />
            </button>
            <button className="text-text2 hover:text-text1 transition-colors">
              <ReloadOutlined className="text-xl" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="relative">
                <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search for vendors, cuisines, or dishes..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-text1 focus:outline-none focus:ring-2 focus:ring-app_primary/20 focus:border-app_primary transition-all placeholder-gray-400"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === category
                        ? "bg-app_secondary text-white shadow-sm"
                        : "bg-gray-100 text-text2 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheduled Vendors */}
            {scheduledVendors.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-text1 mb-4">
                  Your Scheduled Vendors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {scheduledVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={vendor.image}
                          alt={vendor.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {vendor.scheduled && (
                          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${vendor.scheduleColor}`}>
                            {vendor.scheduleInfo}
                          </div>
                        )}
                        {vendor.scheduled && (
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#F4511E] flex items-center gap-1">
                            <ClockCircleOutlined />
                            1hr 20mins
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-lg font-bold text-text1">
                            {vendor.name}
                          </h3>
                        </div>
                        <p className="text-sm text-text2 mb-3">{vendor.cuisine}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-text2 border-t border-gray-50 pt-3">
                          <div className="flex items-center gap-1.5">
                            <StarFilled className="text-yellow-400 text-sm" />
                            <span className="font-bold text-text1">{vendor.rating}</span>
                            <span className="text-gray-400">({vendor.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ClockCircleOutlined className="text-gray-400" />
                            <span>{vendor.deliveryTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <EnvironmentOutlined className="text-gray-400" />
                            <span>{vendor.distance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Vendors */}
            <div>
              <h2 className="text-lg font-bold text-text1 mb-4">All Vendors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={vendor.image}
                        alt={vendor.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-text1">
                          {vendor.name}
                        </h3>
                      </div>
                      <p className="text-sm text-text2 mb-3">{vendor.cuisine}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-text2 border-t border-gray-50 pt-3">
                        <div className="flex items-center gap-1.5">
                          <StarFilled className="text-yellow-400 text-sm" />
                          <span className="font-bold text-text1">{vendor.rating}</span>
                          <span className="text-gray-400">({vendor.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ClockCircleOutlined className="text-gray-400" />
                          <span>{vendor.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <EnvironmentOutlined className="text-gray-400" />
                          <span>{vendor.distance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

