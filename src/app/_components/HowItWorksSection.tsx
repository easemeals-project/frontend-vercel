"use client";

import Image from "next/image";
import uniqid from "uniqid";
import ScrollAnimation from "./ScrollAnimation";

export default function HowItWorksSection() {
  const steps = [
    {
      title: "Enter Your Preferences",
      description:
        "Tell us what foods you enjoy, any dietary restrictions, and your budget preferences.",
    },
    {
      title: "Generate Your Timetable",
      description:
        "Our AI creates a personalized weekly meal plan based on your inputs within seconds.",
    },
    {
      title: "Customize If Needed",
      description:
        "Swap meals or adjust portions to make the plan perfect for your needs.",
    },
    {
      title: "Order Ingredients",
      description:
        "Get all your ingredients delivered or export your shopping list to your preferred store.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-app_bg py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation variant="fadeUp">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
              How EaseMeals Works
            </h2>
            <p className="text-xl text-text2">
              Create your personalized meal plan in just a few simple steps
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Image */}
          <ScrollAnimation variant="slideLeft" className="relative flex justify-center lg:justify-start">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/home/5.png"
                alt="How EaseMeals works"
                width={600}
                height={500}
                className="object-cover w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-300" />
            </div>
          </ScrollAnimation>

          {/* Right Side: Text Content */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <ScrollAnimation
                key={uniqid()}
                variant="fadeUp"
                delay={index * 0.15 + 0.2}
                className="group flex items-start space-x-6 bg-white p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-transparent hover:border-green-100"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold text-xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}