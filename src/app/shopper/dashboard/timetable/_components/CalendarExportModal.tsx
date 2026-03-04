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
                // Official Notion logo mark
                <svg viewBox="0 0 100 100" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" rx="18" fill="#fff" />
                    <path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.137 3.883 2.723 3.883 5.053v68.243c0 4.277-.973 6.827-6.8 7.22l-64.113 3.89c-4.47.3-6.617-.49-8.95-3.307L2.38 83.993c-2.53-3.107-3.55-5.44-3.55-8.153V10.7c0-3.497 1.363-6.413 7.187-6.387z" fill="#fff" />
                    <path d="M61.35.227L6.017 4.313C.193 4.287-1.17 7.203-1.17 10.7v65.14c0 2.713 1.02 5.047 3.55 8.153l13.27 16.197c2.333 2.817 4.48 3.607 8.95 3.307l64.113-3.89c5.827-.393 6.8-2.943 6.8-7.22V23.64c0-2.17-.807-2.827-3.497-4.793L74.167 6.403C69.893 3.3 68.147 2.907 61.35.227zM25.92 19.523c-5.623.333-6.9.413-10.107-2.143L8.477 11.91c-.78-.78-.39-1.753 1.36-1.947l53.39-3.887c4.473-.39 6.803 1.167 8.557 2.53l9.123 6.61c.39.197 1.363 1.363.387 1.363l-55.333 3.304-.04-.36zM19.907 85.613V32.533c0-2.53.78-3.693 3.113-3.887l61.31-3.5c2.14-.193 3.113 1.167 3.113 3.69v52.69c0 2.53-.973 4.277-3.887 4.47l-59.83 3.5c-2.913.193-3.82-1.163-3.82-3.883zm58.467-53.473c.387 1.75 0 3.5-1.75 3.693l-2.917.583v42.773c-2.533 1.363-4.867 2.137-6.8 2.137-3.11 0-3.887-1.167-6.22-4.083l-19.03-29.94v28.967l6.03 1.363s0 3.5-4.867 3.5l-13.4.777c-.39-.78 0-2.723 1.363-3.11l3.5-1.167V40.667L29.48 40.28c-.39-1.75.58-4.277 3.307-4.473l14.367-.973 19.8 30.327V37.36l-5.047-.78c-.39-2.143.975-3.697 2.527-3.89l13.94-.55z" fill="#191919" />
                </svg>
            ),
        },
        {
            id: "outlook",
            name: "Outlook",
            subtitle: "Microsoft calendar integration",
            color: "border-blue-200 bg-blue-50",
            Icon: () => (
                // Official Microsoft Outlook icon colours
                <svg viewBox="0 0 100 100" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" rx="16" fill="#0078d4" />
                    {/* envelope body */}
                    <rect x="42" y="28" width="46" height="44" rx="4" fill="#fff" opacity="0.9" />
                    {/* left panel (O) */}
                    <rect x="10" y="20" width="36" height="60" rx="4" fill="#0078d4" />
                    <ellipse cx="28" cy="50" rx="11" ry="13" fill="#fff" />
                    <ellipse cx="28" cy="50" rx="6" ry="8" fill="#0078d4" />
                    {/* email lines */}
                    <line x1="50" y1="44" x2="80" y2="44" stroke="#0078d4" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                    <line x1="50" y1="52" x2="80" y2="52" stroke="#0078d4" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                    <line x1="50" y1="60" x2="68" y2="60" stroke="#0078d4" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                </svg>
            ),
        },
        {
            id: "apple",
            name: "Apple Calendar",
            subtitle: "iCloud calendar integration",
            color: "border-gray-200 bg-white",
            Icon: () => {
                const today = new Date().getDate();
                return (
                    // Accurate Apple Calendar icon: white body, red header, date number
                    <svg viewBox="0 0 100 100" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" rx="22" fill="#fff" stroke="#e5e7eb" strokeWidth="3" />
                        {/* Red header band */}
                        <rect x="0" y="0" width="100" height="30" rx="22" fill="#f04a4a" />
                        <rect x="0" y="10" width="100" height="20" fill="#f04a4a" />
                        {/* Ring pegs */}
                        <rect x="30" y="0" width="8" height="14" rx="4" fill="#c0392b" />
                        <rect x="62" y="0" width="8" height="14" rx="4" fill="#c0392b" />
                        {/* Date number */}
                        <text x="50" y="80" textAnchor="middle" fontSize="46" fontWeight="900" fontFamily="-apple-system,Helvetica,Arial" fill="#1d1d1f">{today}</text>
                        {/* Day label */}
                        <text x="50" y="46" textAnchor="middle" fontSize="16" fontWeight="600" fontFamily="-apple-system,Helvetica,Arial" fill="#fff">
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date().getDay()]}
                        </text>
                    </svg>
                );
            },
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
