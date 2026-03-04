"use client";
import React, { useState } from "react";
import { Modal, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { WeeklyMealPlan } from "@/lib/types/graphql";
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

type CalendarId = "google" | "apple" | "outlook" | "notion";

const CALENDAR_OPTIONS: {
    id: CalendarId;
    name: string;
    subtitle: string;
    color: string;
    Icon: () => React.ReactElement;
}[] = [
        {
            id: "google",
            name: "Google Calendar",
            subtitle: "Sync events and get notifications",
            color: "border-green-300 bg-green-50",
            Icon: () => (
                <svg viewBox="0 0 48 48" className="w-7 h-7">
                    <path fill="#4285f4" d="M45.5 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h12.1c-.5 2.7-2.1 5-4.4 6.5v5.4h7.1c4.2-3.8 6.7-9.5 6.7-15.6z" />
                    <path fill="#34a853" d="M24 46c6.1 0 11.2-2 14.9-5.4l-7.1-5.4c-2 1.3-4.5 2.1-7.8 2.1-6 0-11-4-12.8-9.4H4v5.6C7.6 41.4 15.3 46 24 46z" />
                    <path fill="#fbbc04" d="M11.2 28c-.5-1.3-.7-2.7-.7-4.1s.2-2.8.7-4.1V14H4C2.5 17 1.7 20.4 1.7 24s.8 7 2.3 10z" />
                    <path fill="#ea4335" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.5l6.6-6.6C35.2 2.8 30.1.7 24 .7 15.2.7 7.5 5.3 4 12.4l7.2 5.6C12.9 13.5 18 9.5 24 9.5z" />
                </svg>
            ),
        },
        {
            id: "notion",
            name: "Notion",
            subtitle: "Add to your workspace database",
            color: "border-gray-200 bg-white",
            Icon: () => (
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
                    <rect width="24" height="24" rx="4" fill="#fff" stroke="#e5e7eb" />
                    <path d="M6 6h7l5 5v7H6V6z" fill="#191919" opacity=".1" />
                    <path d="M7 7h6l4 4v6H7V7zm1 1v8h8v-5l-3-3H8z" fill="#191919" />
                </svg>
            ),
        },
        {
            id: "outlook",
            name: "Outlook",
            subtitle: "Microsoft calendar integration",
            color: "border-blue-200 bg-blue-50",
            Icon: () => (
                <svg viewBox="0 0 48 48" className="w-7 h-7">
                    <rect x="2" y="6" width="44" height="36" rx="4" fill="#0078d4" />
                    <rect x="8" y="14" width="18" height="2" rx="1" fill="#fff" opacity=".8" />
                    <rect x="8" y="19" width="14" height="2" rx="1" fill="#fff" opacity=".6" />
                    <rect x="8" y="24" width="18" height="2" rx="1" fill="#fff" opacity=".4" />
                    <rect x="26" y="22" width="14" height="14" rx="2" fill="#50e6ff" opacity=".9" />
                    <text x="33" y="33" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#003087">C</text>
                </svg>
            ),
        },
        {
            id: "apple",
            name: "Apple Calendar",
            subtitle: "iCloud calendar integration",
            color: "border-gray-200 bg-white",
            Icon: () => (
                <svg viewBox="0 0 48 48" className="w-7 h-7">
                    <rect x="2" y="8" width="44" height="38" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="2" />
                    <rect x="2" y="8" width="44" height="12" rx="5" fill="#ee4444" />
                    <rect x="2" y="14" width="44" height="6" fill="#ee4444" />
                    <circle cx="16" cy="8" r="3" fill="#c0392b" />
                    <circle cx="32" cy="8" r="3" fill="#c0392b" />
                    <text x="24" y="36" textAnchor="middle" fontSize="14" fontWeight="900" fill="#191919">
                        {new Date().getDate()}
                    </text>
                </svg>
            ),
        },
    ];

export default function CalendarExportModal({ open, onClose, weeklyPlan }: CalendarExportModalProps) {
    const [selected, setSelected] = useState<CalendarId>("google");
    const [connecting, setConnecting] = useState(false);
    const [showDayPicker, setShowDayPicker] = useState(false);

    const handleConnect = async () => {
        if (!weeklyPlan) {
            message.error("Generate a meal plan first!");
            return;
        }

        setConnecting(true);
        await new Promise(r => setTimeout(r, 600)); // small UX delay

        if (selected === "google") {
            const links = generateGoogleCalendarLinks(weeklyPlan);
            setShowDayPicker(true);
            setConnecting(false);
            return;
        }

        if (selected === "outlook") {
            const links = generateOutlookLinks(weeklyPlan);
            links.forEach((link, i) => setTimeout(() => window.open(link.url, "_blank"), i * 300));
            message.success("Opening Outlook Calendar for all 7 days!");
            onClose();
            setConnecting(false);
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
            onClose();
            setConnecting(false);
        }
    };

    const googleLinks = weeklyPlan ? generateGoogleCalendarLinks(weeklyPlan) : [];

    const handleClose = () => {
        setShowDayPicker(false);
        setSelected("google");
        setConnecting(false);
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            title={
                !showDayPicker ? (
                    <div>
                        <p className="text-base font-black text-text1">Connect to Calendar Services</p>
                        <p className="text-xs font-normal text-text2 mt-0.5">
                            Connect your meal plan to these services for automatic updates and reminders.
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="text-base font-black text-text1">Choose Days — Google Calendar</p>
                        <p className="text-xs font-normal text-text2 mt-0.5">
                            Click individual days or add all at once.
                        </p>
                    </div>
                )
            }
            width={440}
        >
            {!showDayPicker ? (
                <div className="space-y-3 py-2">
                    {CALENDAR_OPTIONS.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setSelected(opt.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${selected === opt.id
                                ? "border-app_primary bg-green-50 shadow-sm"
                                : `${opt.color} hover:border-gray-300`
                                }`}
                        >
                            <div className="flex-shrink-0">
                                <opt.Icon />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-bold text-text1 text-sm">{opt.name}</p>
                                <p className="text-xs text-text2">{opt.subtitle}</p>
                            </div>
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected === opt.id
                                    ? "border-app_primary bg-app_primary"
                                    : "border-gray-300"
                                    }`}
                            >
                                {selected === opt.id && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </div>
                        </button>
                    ))}

                    <button
                        onClick={handleConnect}
                        disabled={connecting}
                        className="w-full mt-2 py-3.5 rounded-2xl bg-app_secondary text-white font-bold text-sm hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-orange-100"
                    >
                        {connecting ? "Connecting..." : "Connect"}
                    </button>

                    <p className="text-center text-xs text-text2 pb-1">
                        {selected === "apple" || selected === "notion"
                            ? "Downloads an .ics file that works with any calendar"
                            : "Opens calendar tabs — allow pop-ups if prompted"}
                    </p>
                </div>
            ) : (
                <div className="py-2">
                    <button
                        onClick={() => setShowDayPicker(false)}
                        className="flex items-center gap-1.5 text-sm text-text2 hover:text-text1 mb-4 transition-colors"
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                        Back
                    </button>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {googleLinks.map(link => (
                            <a
                                key={link.day}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-app_primary hover:bg-green-50 transition-all text-sm font-medium text-text1 active:scale-95"
                            >
                                <span className="w-8 h-8 rounded-lg bg-app_primary/10 flex items-center justify-center text-xs font-black text-app_primary">
                                    {link.day.substring(0, 2)}
                                </span>
                                {link.day}
                            </a>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            googleLinks.forEach((link, i) => setTimeout(() => window.open(link.url, "_blank"), i * 300));
                            message.success("Opening all 7 days in Google Calendar!");
                            handleClose();
                        }}
                        className="w-full py-3 rounded-xl bg-app_primary text-white font-bold text-sm hover:bg-app_primary/90 transition-all active:scale-[0.98]"
                    >
                        Add All 7 Days at Once
                    </button>
                    <p className="text-xs text-text2 text-center mt-2">Allow pop-ups if your browser asks.</p>
                </div>
            )}
        </Modal>
    );
}
