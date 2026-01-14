"use client";

import conts from "@/lib/conts";
import { CheckCircleFilled } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { GrFormNextLink } from "react-icons/gr";
import ScrollAnimation from "./ScrollAnimation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Hero Section ---
export default function HeroSection() {
  // --- Story Pop Loop Config ---
  const states = [
    {
      id: "personalize",
      type: "feast",
      title: "Chef Cooked",
      subtitle: "Personalized For You",
      color: "bg-green-50",
      textColor: "text-[#0a4031]", // Blended Dark Green
      accent: "from-[#0a4031] to-emerald-600",
      img: "/hero_assets/hero_dish_smoked_chicken.png", // Central Dish
    },
    {
      id: "automate",
      type: "plan",
      title: "Fully Automated",
      subtitle: "Plans Your Week",
      color: "bg-purple-50",
      textColor: "text-purple-900",
      accent: "from-purple-600 to-indigo-600",
      img: "/hero_assets/hero_asset_calendar.png",
    },
    {
      id: "deliver",
      type: "deliver",
      title: "Fast Delivery",
      subtitle: "Swift & Reliable",
      color: "bg-orange-50",
      textColor: "text-orange-900",
      accent: "from-orange-600 to-amber-600",
      img: "/hero_assets/hero_asset_delivery_rider.png",
    },
  ];

  const [index, setIndex] = useState(0);
  const current = states[index];

  // Auto-Cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % states.length);
    }, 6000); // 6s per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white min-h-[90vh] flex items-center pt-16 pb-12 lg:pt-32 lg:pb-24">

      {/* 1. Abstract Background Shapes - Optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className={`absolute top-[-20%] right-[-10%] w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] rounded-full blur-[80px] lg:blur-[100px] opacity-15 bg-gradient-to-br ${current.accent} will-change-transform`}
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-[-10%] left-[-10%] w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] rounded-full blur-[80px] lg:blur-[100px] opacity-10 bg-[#0a4031] will-change-transform`}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full">

          {/* Left Content */}
          <div className="text-center lg:text-left flex flex-col justify-center relative z-20 pt-10 lg:pt-0">
            <ScrollAnimation direction="up" delay={0.1}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-sm font-bold mb-6 lg:mb-8 text-[#0a4031] self-center lg:self-start ring-1 ring-[#0a4031]/5"
              >
                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${current.accent}`} />
                {current.subtitle}
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.2}>
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-[#0a4031] tracking-tight leading-[1.1] lg:leading-[1] mb-6 font-sans">
                We <br />
                <span className="relative inline-block">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current.id}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -40, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className={`relative z-10 block text-transparent bg-clip-text bg-gradient-to-r ${current.accent} pb-2`}
                    >
                      {current.id === 'personalize' ? "Plan." : current.id === 'automate' ? "Automate." : "Deliver."}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.3}>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-500 mb-8 lg:mb-10 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                Experience the magic of <span className="text-[#0a4031] font-bold">Chef-Cooked Meals</span>, planned by <span className="text-[#0a4031] font-bold">AI</span>, and delivered to your door.
              </p>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start w-full sm:w-auto items-center">
                <Link
                  href={conts.paths.dashboard}
                  className="group relative flex items-center justify-center px-10 py-5 bg-[#0a4031] text-white text-xl font-bold rounded-full overflow-hidden shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Get Timetable <GrFormNextLink className="text-3xl" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>

                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="relative w-9 h-9 rounded-full border-2 border-white ring-1 ring-gray-100 overflow-hidden shadow-sm">
                        <Image src={`/hero_assets/testimonial${num}.png`} alt="Happy User" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <span>Join 2,000+ Users</span>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* Right Visual: Story Pop Loop */}
          <div className="relative flex justify-center lg:justify-end h-full items-center min-h-[400px] lg:min-h-[500px]">

            <div className="relative w-full max-w-[340px] sm:max-w-[500px] lg:max-w-[600px] aspect-square flex items-center justify-center perspective-[1000px]">

              {/* Ambient Glow */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className={`absolute inset-0 z-0 bg-gradient-to-tr ${current.accent} rounded-full blur-[80px] opacity-20 transition-all duration-1000 will-change-transform`}
              />

              {/* CONTENT SWAPPER */}
              <AnimatePresence mode="wait">

                {/* STATE 1: FEAST (5-Item Galaxy) */}
                {current.type === 'feast' && (
                  <motion.div
                    key="feast-mode"
                    className="relative w-full h-full flex items-center justify-center"
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)", transition: { duration: 0.3 } }}
                  >
                    {/* 1. Main Dish (Smoked Chicken) - Center */}
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, type: "spring" }}
                      className="relative w-[220px] sm:w-[320px] lg:w-[380px] aspect-square z-20 hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Image
                        src={current.img!}
                        alt="Chef Prepared Smoked Chicken" fill className="object-contain drop-shadow-2xl"
                        priority
                        sizes="(max-width: 768px) 220px, 380px"
                      />
                    </motion.div>

                    {/* --- Floating Galaxy Elements (Optimized: Simple Y Float) --- */}

                    {/* 2. Jollof Rice */}
                    <motion.div
                      initial={{ opacity: 0, x: 50, y: 50 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="absolute top-[-5%] lg:top-[-10%] right-[0%] lg:right-[-5%] w-[110px] sm:w-[130px] lg:w-[160px] h-[110px] sm:h-[130px] lg:h-[160px] z-10"
                    >
                      <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="w-full h-full relative will-change-transform"
                      >
                        <Image src="/hero_assets/hero_dish_jollof.png" alt="Jollof Rice" fill className="object-contain drop-shadow-xl" sizes="(max-width: 768px) 110px, 160px" />
                      </motion.div>
                    </motion.div>

                    {/* 3. Healthy Bowl */}
                    <motion.div
                      initial={{ opacity: 0, x: -50, y: -50 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="absolute bottom-[-5%] lg:bottom-[-10%] left-[0%] lg:left-[-5%] w-[110px] sm:w-[130px] lg:w-[150px] h-[110px] sm:h-[130px] lg:h-[150px] z-30"
                    >
                      <motion.div
                        animate={{ y: [10, -10, 10] }}
                        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                        className="w-full h-full relative will-change-transform"
                      >
                        <Image src="/hero_assets/hero_dish_healthy.png" alt="Healthy Bowl" fill className="object-contain drop-shadow-xl" sizes="(max-width: 768px) 110px, 150px" />
                      </motion.div>
                    </motion.div>

                    {/* 4. Tomato */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute top-[0%] lg:top-[-5%] left-[5%] w-[60px] sm:w-[70px] lg:w-[90px] h-[60px] sm:h-[70px] lg:h-[90px] z-10"
                    >
                      <motion.div
                        animate={{ y: [5, -5, 5] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="w-full h-full relative will-change-transform"
                      >
                        <Image src="/hero_assets/hero_ingredient_tomato.png" alt="Fresh Tomato" fill className="object-contain drop-shadow-lg" sizes="90px" />
                      </motion.div>
                    </motion.div>

                    {/* 5. Avocado */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="absolute bottom-[0%] lg:bottom-[5%] right-[5%] w-[70px] sm:w-[80px] lg:w-[100px] h-[70px] sm:h-[80px] lg:h-[100px] z-30"
                    >
                      <motion.div
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
                        className="w-full h-full relative will-change-transform"
                      >
                        <Image src="/hero_assets/hero_ingredient_avocado.png" alt="Fresh Avocado" fill className="object-contain drop-shadow-lg" sizes="100px" />
                      </motion.div>
                    </motion.div>

                    {/* Interactive Tag - BLENDED COLOR */}
                    <motion.button
                      className="absolute top-[35%] lg:top-[40%] left-[-10%] sm:left-[-15%] bg-white/90 backdrop-blur-md px-3 lg:px-4 py-2 rounded-xl border border-[#0a4031]/20 shadow-xl z-40 cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,1)" }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl lg:text-2xl">✨</span>
                        <div className="flex flex-col text-left">
                          <span className="text-[8px] lg:text-[10px] font-bold text-gray-500 uppercase tracking-wider">Goal</span>
                          <span className="text-xs lg:text-sm font-black text-[#0a4031]">Personalized</span>
                        </div>
                      </div>
                    </motion.button>
                  </motion.div>
                )}

                {/* STATE 2: PLAN (Calendar - REDUCED SIZE) */}
                {current.type === 'plan' && (
                  <motion.div
                    key="plan-mode"
                    className="relative w-full h-full flex items-center justify-center"
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: -90, transition: { duration: 0.3 } }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  >
                    <div className="relative w-[240px] sm:w-[350px] lg:w-[420px] aspect-square z-10"> {/* REDUCED SIZE Lg: 420px */}
                      <Image
                        src={current.img!}
                        alt="Smart Calendar" fill className="object-contain drop-shadow-2xl"
                        priority
                      />

                      {/* Checkmark Overlay */}
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
                        className="absolute top-[20%] right-[-5%] bg-white p-2 lg:p-3 rounded-2xl shadow-xl flex items-center gap-2"
                      >
                        <div className="bg-[#0a4031]/10 p-1.5 lg:p-2 rounded-full text-[#0a4031]"><CheckCircleFilled className="text-lg lg:text-xl" /></div>
                        <span className="font-bold text-gray-800 text-xs lg:text-sm">Week Planned!</span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* STATE 3: DELIVER (Rider - REDUCED SIZE) */}
                {current.type === 'deliver' && (
                  <motion.div
                    key="deliver-mode"
                    className="relative w-full h-full flex items-center justify-center z-30 perspective-[1000px]"
                    initial={{ x: '100vw', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-100vw', opacity: 0, transition: { duration: 0.4 } }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  >
                    {/* Rider Container - REDUCED SIZE */}
                    <motion.div
                      className="relative w-[240px] sm:w-[350px] lg:w-[400px] aspect-square z-10" // REDUCED SIZE Lg: 400px
                      animate={{ rotate: [-5, -12, -5], y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                      <Image
                        src={current.img!}
                        alt="Delivery Rider" fill className="object-contain drop-shadow-2xl"
                        priority
                      />

                      {/* Speed Lines - White Light */}
                      <motion.div
                        className="absolute top-1/2 left-[-2rem] lg:-left-32 w-40 lg:w-64 h-2 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full blur-[1px]"
                        animate={{ opacity: [0, 0.8, 0], x: [0, 80, 0] }}
                        transition={{ repeat: Infinity, duration: 0.4 }}
                      />

                      {/* Arriving Tag */}
                      <motion.div
                        className="absolute -bottom-5 right-0 lg:right-5 bg-white px-3 lg:px-5 py-2 rounded-full shadow-2xl border-2 border-orange-100 font-black text-[#0a4031] text-sm lg:text-base transform rotate-6"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <span className="mr-2">📍</span>
                        Arriving Now
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
