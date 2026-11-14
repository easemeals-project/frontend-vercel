"use client";
import React, { useState, useEffect } from "react";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { ADD_ADDRESS } from "@/graphql/mutations";
import { REVERSE_GEOCODE, SEARCH_ADDRESSES } from "@/graphql/queries";
import {
    WeeklyMealPlan,
    AddAddressResult,
    AddAddressVariables,
    ReverseGeocodeResult,
    ReverseGeocodeVariables,
    SearchAddressesResult,
    SearchAddressesVariables,
} from "@/lib/types/graphql";
import {
    generateICal,
    downloadICal,
    generateGoogleCalendarLinks,
    generateOutlookLinks,
} from "@/lib/utils/calendar";

interface CalendarExportModalProps {
    open: boolean;
    onClose: () => void;
    weeklyPlan: WeeklyMealPlan | null;
}

type CalendarId = "google" | "notion" | "outlook" | "apple";

const CALENDAR_OPTIONS: {
    id: CalendarId;
    name: string;
    subtitle: string;
    Icon: () => React.ReactElement;
}[] = [
    {
        id: "google",
        name: "Google Calendar",
        subtitle: "Sync events and get notifications",
        Icon: () => (
            <div className="w-9 h-9 rounded-full bg-[#EBF3FE] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <text x="12" y="18" textAnchor="middle" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">31</text>
                </svg>
            </div>
        ),
    },
    {
        id: "notion",
        name: "Notion",
        subtitle: "Add to your workspace database",
        Icon: () => (
            <div className="w-9 h-9 rounded-full bg-[#F4F4F5] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#27272A]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <line x1="8" y1="8" x2="16" y2="8" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="8" y1="16" x2="13" y2="16" />
                </svg>
            </div>
        ),
    },
    {
        id: "outlook",
        name: "Outlook",
        subtitle: "Microsoft calendar integration",
        Icon: () => (
            <div className="w-9 h-9 rounded-full bg-[#EBF3FE] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#0078D4]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <polyline points="3 7 12 13 21 7" />
                </svg>
            </div>
        ),
    },
    {
        id: "apple",
        name: "Apple Calendar",
        subtitle: "iCloud calendar integration",
        Icon: () => (
            <div className="w-9 h-9 rounded-full bg-[#F4F4F5] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#18181B]" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.96 6.33c.67-.81 1.12-1.94 1-3.08-.96.04-2.13.64-2.82 1.45-.61.7-.15 1.85-1.01 2.97 1.08.08 2.16-.53 2.83-1.34z" />
                </svg>
            </div>
        ),
    },
];

export default function CalendarExportModal({ open, onClose, weeklyPlan }: CalendarExportModalProps) {
    const [selected, setSelected] = useState<CalendarId>("google");
    const [connecting, setConnecting] = useState(false);
    const [showDayPicker, setShowDayPicker] = useState(false);

    // Delivery Address State
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({});
    const [locating, setLocating] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [addAddress] = useMutation<AddAddressResult, AddAddressVariables>(ADD_ADDRESS);
    const [reverseGeocode] = useLazyQuery<ReverseGeocodeResult, ReverseGeocodeVariables>(REVERSE_GEOCODE);
    const [searchAddresses] = useLazyQuery<SearchAddressesResult, SearchAddressesVariables>(SEARCH_ADDRESSES);

    useEffect(() => {
        if (!open) return;
        try {
            const cached = localStorage.getItem("easemeals_profile_addresses");
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const def = parsed.find((a: any) => a.isDefault) || parsed[0];
                    if (def?.fullAddress && !deliveryAddress) {
                        setDeliveryAddress(def.fullAddress);
                    }
                }
            }
        } catch {}
    }, [open]);

    const persistAddressIfNeeded = async (addrText: string, lat?: number, lon?: number) => {
        const trimmed = addrText.trim();
        if (!trimmed) return;
        try {
            const cached = localStorage.getItem("easemeals_profile_addresses");
            const existing: any[] = cached ? JSON.parse(cached) : [];
            const alreadyExists = existing.some(
                (a) => a.fullAddress?.toLowerCase() === trimmed.toLowerCase()
            );
            if (!alreadyExists) {
                let created: any = null;
                try {
                    const res = await addAddress({
                        variables: {
                            input: {
                                label: "Home",
                                fullAddress: trimmed,
                                latitude: lat,
                                longitude: lon,
                                isDefault: existing.length === 0,
                            },
                        },
                    });
                    created = res.data?.addAddress;
                } catch {}

                const nextAddr = created || {
                    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
                    label: "Home",
                    fullAddress: trimmed,
                    latitude: lat,
                    longitude: lon,
                    isDefault: existing.length === 0,
                };
                const nextList = [...existing, nextAddr];
                localStorage.setItem("easemeals_profile_addresses", JSON.stringify(nextList));
            }
        } catch {}
    };

    const handleAddressChange = async (value: string) => {
        setDeliveryAddress(value);
        if (value.trim().length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        try {
            const { data } = await searchAddresses({ variables: { query: value } });
            if (data?.searchAddresses && data.searchAddresses.length > 0) {
                setSuggestions(data.searchAddresses.slice(0, 4));
                setShowSuggestions(true);
                return;
            }
        } catch {}

        try {
            const resp = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=ng&limit=4`
            );
            if (resp.ok) {
                const items = await resp.json();
                if (Array.isArray(items) && items.length > 0) {
                    setSuggestions(items.map((i: any) => i.display_name));
                    setShowSuggestions(true);
                }
            }
        } catch {}
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            message.error("Geolocation is not supported by your browser");
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setCoords({ lat: latitude, lon: longitude });
                let resolved = "";
                try {
                    const { data } = await reverseGeocode({
                        variables: { lat: latitude, lon: longitude },
                    });
                    if (data?.reverseGeocode) {
                        resolved = data.reverseGeocode;
                    }
                } catch {}

                if (!resolved) {
                    try {
                        const resp = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        if (resp.ok) {
                            const json = await resp.json();
                            resolved = json?.display_name || "";
                        }
                    } catch {}
                }

                const finalAddr = resolved || `Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}`;
                setDeliveryAddress(finalAddr);
                setShowSuggestions(false);
                await persistAddressIfNeeded(finalAddr, latitude, longitude);
                message.success("Delivery location updated!");
                setLocating(false);
            },
            (err) => {
                message.error("Unable to fetch location: " + err.message);
                setLocating(false);
            }
        );
    };

    const handleConnect = async () => {
        if (deliveryAddress.trim()) {
            await persistAddressIfNeeded(deliveryAddress, coords.lat, coords.lon);
        }

        if (!weeklyPlan) {
            message.error("Generate a meal plan first!");
            return;
        }

        setConnecting(true);
        await new Promise((r) => setTimeout(r, 400));

        if (selected === "google") {
            setShowDayPicker(true);
            setConnecting(false);
            return;
        }

        if (selected === "outlook") {
            const links = generateOutlookLinks(weeklyPlan);
            links.forEach((link, i) => setTimeout(() => window.open(link.url, "_blank"), i * 300));
            message.success("Opening Outlook Calendar for all 7 days!");
            handleClose();
            return;
        }

        if (selected === "apple" || selected === "notion") {
            const ics = generateICal(weeklyPlan);
            downloadICal(ics, `EaseMeals-Timetable-${new Date().toISOString().split("T")[0]}.ics`);
            message.success(
                selected === "apple"
                    ? "Downloaded! Open the .ics file to import into Apple Calendar."
                    : "Downloaded! Import the .ics file into Notion or any other calendar app."
            );
            handleClose();
        }
    };

    const googleLinks = weeklyPlan ? generateGoogleCalendarLinks(weeklyPlan) : [];

    const handleClose = () => {
        if (deliveryAddress.trim()) {
            persistAddressIfNeeded(deliveryAddress, coords.lat, coords.lon);
        }
        setShowDayPicker(false);
        setSelected("google");
        setConnecting(false);
        setShowSuggestions(false);
        onClose();
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div className="w-full max-w-[390px] flex flex-col gap-3">
                {/* Top Card: Delivery Address */}
                <div className="bg-white rounded-2xl p-5 shadow-2xl relative">
                    <label className="block text-xs font-bold text-[#1a1a1a] mb-2.5">
                        Delivery Address
                    </label>
                    <div className="flex items-stretch border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#4CAF50] transition-colors">
                        <input
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => handleAddressChange(e.target.value)}
                            onFocus={() => {
                                if (suggestions.length > 0) setShowSuggestions(true);
                            }}
                            onBlur={() => {
                                setTimeout(() => setShowSuggestions(false), 180);
                            }}
                            placeholder="Enter your address"
                            className="flex-1 px-3.5 py-2.5 text-xs text-[#1a1a1a] placeholder:text-gray-300 outline-none bg-white"
                        />
                        <button
                            type="button"
                            onClick={handleUseCurrentLocation}
                            disabled={locating}
                            title="Use current location"
                            className="w-11 bg-[#4CAF50] hover:bg-[#43A047] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:opacity-70"
                        >
                            {locating ? (
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 16, color: "#fff" }} spin />} />
                            ) : (
                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Address Autocomplete Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute left-5 right-5 top-[84px] z-20 bg-white border border-gray-200 rounded-xl shadow-lg max-h-44 overflow-y-auto">
                            {suggestions.map((item, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onMouseDown={() => {
                                        setDeliveryAddress(item);
                                        setShowSuggestions(false);
                                        persistAddressIfNeeded(item);
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-xs text-[#1a1a1a] hover:bg-green-50 border-b last:border-b-0 border-gray-100 line-clamp-2"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Card: Connect to Calendar Services */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#1a1a1a]">
                            {!showDayPicker ? "Connect to Calendar Services" : "Choose Days — Google Calendar"}
                        </h3>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-800 transition-colors p-1 cursor-pointer"
                            aria-label="Close"
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    {!showDayPicker ? (
                        <div className="px-6 py-5">
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                Connect your meal plan to these services for automatic updates and reminders.
                            </p>

                            <div className="space-y-2.5">
                                {CALENDAR_OPTIONS.map((opt) => {
                                    const isSelected = selected === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setSelected(opt.id)}
                                            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg border text-left transition-all cursor-pointer ${
                                                isSelected
                                                    ? "bg-[#E3F2E6] border-[#81C784]"
                                                    : "bg-white border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <div className="shrink-0">
                                                <opt.Icon />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-[#1a1a1a]">{opt.name}</p>
                                                <p className="text-[11px] text-gray-500 truncate">{opt.subtitle}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={handleConnect}
                                disabled={connecting}
                                className="w-full mt-5 py-3 rounded-lg bg-[#FF6B35] hover:bg-[#F4511E] text-white font-bold text-xs transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer shadow-sm"
                            >
                                {connecting ? "Connecting..." : "Connect"}
                            </button>
                        </div>
                    ) : (
                        <div className="px-6 py-5">
                            <button
                                type="button"
                                onClick={() => setShowDayPicker(false)}
                                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#1a1a1a] mb-3 transition-colors cursor-pointer"
                            >
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                                </svg>
                                Back
                            </button>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {googleLinks.map((link) => (
                                    <a
                                        key={link.day}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 hover:border-[#81C784] hover:bg-[#E3F2E6] transition-all text-xs font-medium text-[#1a1a1a]"
                                    >
                                        <span className="w-7 h-7 rounded-md bg-green-100 flex items-center justify-center text-[11px] font-bold text-[#0c513f]">
                                            {link.day.substring(0, 2)}
                                        </span>
                                        {link.day}
                                    </a>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    googleLinks.forEach((link, i) =>
                                        setTimeout(() => window.open(link.url, "_blank"), i * 300)
                                    );
                                    message.success("Opening all 7 days in Google Calendar!");
                                    handleClose();
                                }}
                                className="w-full py-3 rounded-lg bg-[#FF6B35] hover:bg-[#F4511E] text-white font-bold text-xs transition-all cursor-pointer"
                            >
                                Add All 7 Days at Once
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
