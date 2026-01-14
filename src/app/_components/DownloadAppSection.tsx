"use client";

import Image from "next/image";
import ScrollAnimation from "./ScrollAnimation";
import { AppleFilled, AndroidFilled } from "@ant-design/icons";

export default function DownloadAppSection() {
    return (
        <section className="py-24 bg-gradient-to-br from-[#0a4031] to-[#042119] text-white overflow-hidden relative">
            {/* Background Texture/Glow */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="text-center lg:text-left space-y-8">
                        <ScrollAnimation direction="up">
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight text-white/95">
                                Experience the best <br />
                                on <span className="text-green-400">Mobile.</span>
                            </h2>
                        </ScrollAnimation>

                        <ScrollAnimation direction="up" delay={0.1}>
                            <p className="text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                                Download the EaseMeals app to plan your meals on the go, track your nutrition, and order groceries in seconds.
                            </p>
                        </ScrollAnimation>

                        <ScrollAnimation direction="up" delay={0.2} className="flex flex-row gap-3 justify-center lg:justify-start flex-wrap sm:flex-nowrap">
                            <button className="flex items-center justify-center gap-2 bg-white text-gray-900 px-5 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg min-w-[160px]">
                                <AppleFilled className="text-3xl" />
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-none mb-1">Download on</p>
                                    <p className="text-lg font-black leading-none">App Store</p>
                                </div>
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-transparent border border-white/30 text-white px-5 py-3 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg min-w-[160px]">
                                <AndroidFilled className="text-3xl text-green-400" />
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Get it on</p>
                                    <p className="text-lg font-black leading-none">Google Play</p>
                                </div>
                            </button>
                        </ScrollAnimation>
                    </div>

                    {/* Phone Mockup - Front View Clean */}
                    <div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0">
                        <ScrollAnimation direction="up" delay={0.3} className="relative w-full max-w-[420px]">
                            <div className="relative z-10 transform hover:-translate-y-4 transition-transform duration-700 ease-out">
                                <Image
                                    src="/app_banner/app_iphone17_front.png"
                                    alt="EaseMeals iPhone 17 App Preview"
                                    width={600}
                                    height={1200}
                                    className="w-full h-auto drop-shadow-2xl"
                                    priority
                                />
                            </div>
                            {/* Subtle Glow behind */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-green-500/20 rounded-full blur-[80px] -z-10" />
                        </ScrollAnimation>
                    </div>

                </div>
            </div>
        </section>
    );
}
