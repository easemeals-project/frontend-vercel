"use client";

import conts from "@/lib/conts";
import { CheckCircleFilled } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { GrFormNextLink } from "react-icons/gr";
import { IoTimer } from "react-icons/io5";
import ScrollAnimation from "./ScrollAnimation";

// --- 1. Hero Section ---
export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-app_bg via-white to-green-50 px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-app_primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-app_secondary/10 rounded-full blur-3xl opacity-50" />

      <div className="container relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mx-auto max-w-7xl">
        {/* Left Side: Text Content */}
        <div className="text-center lg:text-left z-10 transition-all">
          <ScrollAnimation direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-app_primary text-sm font-medium mb-6 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-app_primary"></span>
              Available in Lagos
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.2}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] font-sans">
              Plan Your Meals <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-app_primary to-green-400">
                With Ease
              </span>
            </h1>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.3}>
            <p className="mt-6 text-lg sm:text-xl text-text2 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Create personalized meal timetables in minutes. Save time, eat
              healthier, and never worry about <span className="text-app_secondary font-bold">"what's for dinner"</span> again.
            </p>
          </ScrollAnimation>

          <ScrollAnimation
            direction="up"
            delay={0.4}
            className="mt-10 flex flex-col sm:flex-row w-full gap-4 justify-center lg:justify-start"
          >
            <Link
              href={conts.paths.dashboard}
              className="group flex-1 sm:flex-none flex items-center justify-center px-8 py-4 border border-transparent rounded-full shadow-lg shadow-green-900/20 text-lg font-bold text-white bg-app_primary hover:bg-green-800 transition-all transform hover:scale-105"
            >
              Get Started Free
              <GrFormNextLink className="ml-2 size-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex-1 sm:flex-none flex items-center justify-center px-8 py-4 border-2 border-gray-100 rounded-full shadow-sm text-lg font-medium text-text1 bg-white hover:bg-gray-50 hover:border-gray-200 transition-all"
            >
              See How It Works
            </Link>
          </ScrollAnimation>
        </div>

        {/* Right Side: Image Grid / Hero Image */}
        <div className="relative flex justify-center lg:justify-end z-10 mt-10 lg:mt-0">
          <ScrollAnimation direction="up" delay={0.3} duration={0.8}>
            <div className="relative w-[300px] sm:w-[400px] h-[400px] sm:h-[500px] lg:w-[500px] lg:h-[600px]">
              {/* Main Image */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-green-900/10 border-[6px] border-white rotate-2 hover:rotate-0 transition-all duration-700">
                <Image
                  src="/home/1.png"
                  alt="Healthy meal"
                  width={500}
                  height={600}
                  priority
                  className="object-cover w-full h-full scale-105 hover:scale-100 transition-transform duration-700"
                />
              </div>

              {/* Floating Cards */}
              <ScrollAnimation
                direction="left"
                delay={0.6}
                className="absolute top-12 -right-4 sm:-right-8 z-20"
              >
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <IoTimer className="text-app_secondary text-2xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Efficiency</p>
                    <p className="text-sm font-bold text-gray-900">Save 5+ hrs/week</p>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation
                direction="right"
                delay={0.8}
                className="absolute bottom-16 -left-4 sm:-left-8 z-20"
              >
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-delayed">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircleFilled className="text-app_primary text-2xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Variety</p>
                    <p className="text-sm font-bold text-gray-900">2500+ Recipes</p>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
