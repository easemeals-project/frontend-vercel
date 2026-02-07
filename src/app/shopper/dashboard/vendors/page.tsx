"use client";

import { useState, useEffect } from "react";
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
import { useQuery } from "@apollo/client/react";
import { GET_VENDORS } from "@/graphql/queries";
import { GetVendorsResult, Vendor } from "@/lib/types";
import { Spin } from "antd";

const categories = [
  "All Vendors",
  "Nigerian",
  "Continental",
  "Healthy",
  "Fast Food",
];

const mockImages = [
  "/home/1.png",
  "/home/2.png",
  "/home/3.png",
  "/home/4.png",
];

export default function VendorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Vendors");
  const [searchText, setSearchText] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { data, loading, error } = useQuery<GetVendorsResult>(GET_VENDORS);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => console.log("Geolocation error or denied")
      );
    }
  }, []);

  const calculateDistance = (lat1?: number, lng1?: number) => {
    if (!userLocation || !lat1 || !lng1) return "N/A";
    const R = 6371; // km
    const dLat = ((userLocation.lat - lat1) * Math.PI) / 180;
    const dLon = ((userLocation.lng - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((userLocation.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return `${d.toFixed(1)} km`;
  };

  const getDayName = (day: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day];
  }

  const mapBackendToUI = (vendors: Vendor[]) => {
    return vendors.map((v, index) => {
      // Find if open today
      const today = new Date().getDay();
      const hour = v.hours.find(h => h.dayOfWeek === today);
      const isOpen = hour ? hour.isOpen : false;

      return {
        ...v,
        image: v.pictureURL && v.pictureURL.startsWith('http') ? v.pictureURL : mockImages[index % mockImages.length], // Fallback/Mock image logic
        rating: 4.5, // Mock rating as backend doesn't have it yet
        reviews: 10 + index * 5, // Mock reviews
        distance: calculateDistance(v.latitude, v.longitude),
        deliveryTime: "30-45 min", // Mock
        cuisine: v.description || "Variety",
        scheduled: isOpen,
        scheduleInfo: isOpen ? `Open ${hour?.openTime} - ${hour?.closeTime}` : "Closed Today",
      };
    });
  };

  const vendors = data?.vendors ? mapBackendToUI(data.vendors) : [];

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch = v.businessName.toLowerCase().includes(searchText.toLowerCase()) ||
      v.cuisine.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = activeCategory === "All Vendors" || v.cuisine.toLowerCase().includes(activeCategory.toLowerCase()); // Simple loose matching
    return matchesSearch && matchesCategory;
  });

  const scheduledVendors = filteredVendors.filter(v => v.scheduled);

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
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-text1 focus:outline-none focus:ring-2 focus:ring-app_primary/20 focus:border-app_primary transition-all placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === category
                      ? "bg-app_secondary text-white shadow-sm"
                      : "bg-gray-100 text-text2 hover:bg-gray-200"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center p-12"><Spin size="large" /></div>
            ) : error ? (
              <div className="text-center text-red-500">Failed to load vendors: {error.message}</div>
            ) : (
              <>
                {/* Scheduled Vendors (Open Today) */}
                {scheduledVendors.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-text1 mb-4">
                      Open Today
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {scheduledVendors.map((vendor) => (
                        <div
                          key={vendor.id}
                          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                        >
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={vendor.image || "/placeholder.png"}
                              alt={vendor.businessName}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {vendor.scheduled && (
                              <div
                                className={`absolute top-0 left-0 px-3 py-1 rounded-br-full text-xs font-bold text-white bg-app_primary`}
                              >
                                {vendor.scheduleInfo}
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-lg font-bold text-text1">
                                {vendor.businessName}
                              </h3>
                            </div>
                            <p className="text-sm text-text2 mb-3">
                              {vendor.cuisine}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-text2 border-t border-gray-50 pt-3">
                              <div className="flex items-center gap-1.5">
                                <StarFilled className="text-yellow-400! text-sm" />
                                <span className="font-bold text-text1">
                                  {vendor.rating}
                                </span>
                                <span className="text-gray-400">
                                  ({vendor.reviews})
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ClockCircleOutlined className="text-gray-400" />
                                <span>{vendor.deliveryTime}</span>
                              </div>
                              <div className="flex items-center ml-auto">
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
                    {filteredVendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={vendor.image || "/placeholder.png"}
                            alt={vendor.businessName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold text-text1">
                              {vendor.businessName}
                            </h3>
                          </div>
                          <p className="text-sm text-text2 mb-3">
                            {vendor.cuisine}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-text2 border-t border-gray-50 pt-3">
                            <div className="flex items-center gap-1.5">
                              <StarFilled className="text-yellow-400! text-sm" />
                              <span className="font-bold text-text1">
                                {vendor.rating}
                              </span>
                              <span className="text-gray-400">
                                ({vendor.reviews})
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <ClockCircleOutlined className="text-gray-400" />
                              <span>{vendor.deliveryTime}</span>
                            </div>
                            <div className="flex items-center text-xs text-text2 ml-auto">
                              <EnvironmentOutlined className="text-gray-400" />
                              <span>{vendor.distance}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredVendors.length === 0 && (
                      <div className="col-span-full text-center py-10 text-gray-500">No vendors found</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
