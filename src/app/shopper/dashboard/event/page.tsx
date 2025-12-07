"use client";

import { useState } from "react";
import { Card, Input, Checkbox, Slider, Select, DatePicker, TimePicker } from "antd";
import {
  MenuOutlined,
  DownloadOutlined,
  ReloadOutlined,
  StarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Sidebar from "../_components/Sidebar";

const eventTypes = [
  { name: "Birthday Party", icon: "🎂" },
  { name: "Wedding", icon: "💒" },
  { name: "Corporate Event", icon: "🏢" },
  { name: "Anniversary", icon: "🎁" },
  { name: "Graduation", icon: "🎓" },
  { name: "Other", icon: "✨" },
];

const mealPreferences = [
  "Breakfast",
  "Brunch",
  "Lunch",
  "Dinner",
  "Cocktail Hour",
  "Desserts",
];

export default function EventPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [numberOfGuests, setNumberOfGuests] = useState(10);

  const handleMealToggle = (meal: string) => {
    if (selectedMeals.includes(meal)) {
      setSelectedMeals(selectedMeals.filter((m) => m !== meal));
    } else {
      setSelectedMeals([...selectedMeals, meal]);
    }
  };

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
            Special Event
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
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Banner */}
            <div className="bg-[#FF8A65] rounded-xl p-8 text-white shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <StarOutlined className="text-2xl" />
                <h2 className="text-2xl font-bold">Plan Your Special Event</h2>
              </div>
              <p className="opacity-90">
                Let us help you create unforgettable culinary experiences for your special occasions
              </p>
            </div>

            {/* Event Type */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-text1 mb-4">Event Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {eventTypes.map((type) => (
                  <button
                    key={type.name}
                    onClick={() => setSelectedEventType(type.name)}
                    className={`p-6 border rounded-xl transition-all flex flex-col items-center justify-center gap-3 h-32 ${
                      selectedEventType === type.name
                        ? "border-app_secondary bg-orange-50 ring-1 ring-app_secondary"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <span className="text-sm font-medium text-text1">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-text1 mb-6">Event Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-medium text-text1 mb-2">
                    Event Date *
                  </label>
                  <DatePicker
                    placeholder="mm/dd/yyyy"
                    className="w-full h-11 rounded-lg border-gray-300"
                    suffixIcon={<CalendarOutlined className="text-text2" />}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text1 mb-2">
                    Event Time *
                  </label>
                  <TimePicker
                    placeholder="--:--"
                    className="w-full h-11 rounded-lg border-gray-300"
                    suffixIcon={<ClockCircleOutlined className="text-text2" />}
                    format="HH:mm"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-text1 mb-2">
                  Number of Guests
                </label>
                <div className="flex items-center gap-6">
                  <Slider
                    min={1}
                    max={500}
                    value={numberOfGuests}
                    onChange={setNumberOfGuests}
                    className="flex-1"
                    trackStyle={{ backgroundColor: '#1890ff', height: 6 }}
                    handleStyle={{ borderColor: '#1890ff', backgroundColor: '#1890ff', width: 16, height: 16, marginTop: -5 }}
                    railStyle={{ backgroundColor: '#e5e7eb', height: 6 }}
                  />
                  <div className="bg-gray-100 px-4 py-2 rounded-lg min-w-[60px] text-center font-semibold text-text1">
                    {numberOfGuests}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-text1 mb-2">
                  Event Location
                </label>
                <Input
                  placeholder="Enter event venue or address"
                  prefix={<EnvironmentOutlined className="text-gray-400 mr-2" />}
                  className="h-11 rounded-lg border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text1 mb-2">
                  Budget Range
                </label>
                <Select
                  placeholder="Select budget range"
                  className="w-full h-11 rounded-lg"
                  options={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                  ]}
                />
              </div>
            </div>

            {/* Meal Preferences */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-text1 mb-4">Meal Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mealPreferences.map((meal) => (
                  <div
                    key={meal}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleMealToggle(meal)}
                  >
                    <Checkbox
                      checked={selectedMeals.includes(meal)}
                      className="scale-110"
                    />
                    <span className="text-sm text-text1">{meal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Requirements */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-text1 mb-4">
                Special Requirements
              </h3>
              <Input.TextArea
                placeholder="Any dietary restrictions, allergies, or special requests?"
                rows={4}
                className="rounded-lg border-gray-300 resize-none p-3"
              />
            </div>

            {/* Find Vendors Button */}
            <button
              className="w-full bg-[#FF7043] hover:bg-[#F4511E] text-white py-4 rounded-lg text-lg font-bold shadow-sm transition-colors"
            >
              Find Vendors for My Event
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

