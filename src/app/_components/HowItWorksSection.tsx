"use client";

import Image from "next/image";
import ScrollAnimation from "./ScrollAnimation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "We Learn Your Preference",
      description: "Tell us what you like, your allergies, and your goals. We build a profile that understands your nutritional needs.",
      image: "/how-it-works/preferences.png",
    },
    {
      id: 2,
      title: "We Create a Personalized Timetable",
      description: "Get a complete weekly meal plan generated instantly. No more decision fatigue—just delicious plans ready to go.",
      image: "/how-it-works/timetable.png",
    },
    {
      id: 3,
      title: "We Automate Delivery",
      description: "We source fresh ingredients or cooked meals and deliver them to your location on time. Seamless and reliable.",
      // Using 'order.png' as requested to replace missing 'delivery.png' and 'Hunger Nights' step.
      image: "/how-it-works/order.png",
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-white py-20 lg:py-32 overflow-hidden relative border-t border-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6">
              How EaseMeals Works
            </h2>
            <p className="text-lg text-gray-500 font-medium">
              Your journey to stress-free eating in 3 simple steps.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left Side: Dynamic Image Display - Plain & Clean */}
          <div className="order-2 lg:order-1 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-square bg-white rounded-3xl sm:rounded-[3rem] p-4 sm:p-8 lg:p-12 shadow-2xl shadow-green-900/5 border border-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full flex items-center justify-center p-4"
                >
                  <Image
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Interactive Steps List - Minimalist */}
          <div className="order-1 lg:order-2 space-y-4">
            {steps.map((step, index) => (
              <ScrollAnimation
                key={index}
                direction="right"
                delay={index * 0.1}
              >
                <div
                  className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-l-4 ${activeStep === index
                    ? "bg-gray-50 border-app_primary pl-8"
                    : "bg-transparent border-transparent hover:bg-gray-50 hover:pl-8"
                    }`}
                  onMouseEnter={() => setActiveStep(index)}
                  onClick={() => setActiveStep(index)} // For mobile tap
                >
                  <div className="flex items-start gap-6">
                    <div
                      className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${activeStep === index ? "bg-app_primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                        }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold mb-2 transition-colors ${activeStep === index ? "text-gray-900" : "text-gray-400 group-hover:text-gray-900"
                        }`}>
                        {step.title}
                      </h3>
                      <p className={`leading-relaxed transition-colors ${activeStep === index ? "text-gray-600" : "text-gray-400 group-hover:text-gray-500"
                        }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}