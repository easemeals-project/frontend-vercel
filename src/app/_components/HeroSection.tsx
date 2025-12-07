import conts from "@/lib/conts";
import { CheckCircleFilled } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { GrFormNextLink } from "react-icons/gr";
import { IoTimer } from "react-icons/io5";

// --- 1. Hero Section ---
export default function HeroSection() {
  return (
    <section className="bg-app_bg w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center mx-auto max-w-7xl">
        {/* Left Side: Text Content */}
        <div className="text-center md:text-left">
          <Image
            src="/logo.png"
            alt="EaseMeals Logo"
            width={90}
            height={90}
            className="hidden md:block"
          />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-1 leading-tight">
            Plan Your Meals
            <br />
            With Ease
          </h1>
          <p className="mt-6 text-lg text-text2 max-w-lg mx-auto md:mx-0">
            Create personalized meal timetables in minutes. Save time, eat
            healthier, and never worry about "what's for dinner" again.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row w-full gap-4">
            <Link
              href={conts.paths.dashboard}
              className="gap-2 flex-1 flex items-center justify-center px-4 md:px-8 py-3 border border-transparent rounded-md shadow-sm text-base md:text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Your Timetable
              <GrFormNextLink className="size-7" />
            </Link>
            <Link
              href={conts.paths.dashboard}
              className="flex-1 flex items-center justify-center px-4 md:px-8 py-3 border border-transparent rounded-md shadow-sm text-base md:text-lg font-medium text-text2 ring-2 ring-text1/15"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Right Side: Image Grid */}
        <div className="relative grid-cols-2 gap-4">
          {/* Using placeholder images with a green theme */}
          <div className="relative">
            <Image
              src="/home/1.png"
              alt="Healthy meal 1"
              width={300}
              height={400}
              className="rounded-lg object-cover w-full h-full"
            />
            <div className="absolute -top-5 right-0 flex items-center gap-x-4 bg-white p-4 rounded-md shadow-md">
              <IoTimer className="text-app_secondary! text-2xl shrink-0 mt-1" />
              Save 5+ hours weekly
            </div>
            <div className="absolute bottom-2 flex items-center gap-x-4 bg-white p-4 rounded-md shadow-md">
              <CheckCircleFilled className="text-green-600! text-2xl shrink-0 mt-1" />
              2500+ recipes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
