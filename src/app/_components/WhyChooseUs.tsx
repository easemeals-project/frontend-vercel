"use client";

import Image from "next/image";
import ScrollAnimation from "./ScrollAnimation";

export default function WhyChooseUsSection() {
  const features = [
    {
      title: "Personalised Meal Timetable",
      description: "We learn about your diet, schedule, and goals to build the perfect plan.",
      img: "/why-choose-us/personalized.png",
      bg: "group-hover:bg-green-50",
      border: "group-hover:border-green-100",
      accent: "text-green-600"
    },
    {
      title: "Diverse Global Recipes",
      description: "Explore cuisines from around the world or stick to local favorites.",
      img: "/why-choose-us/diverse.png",
      bg: "group-hover:bg-orange-50",
      border: "group-hover:border-orange-100",
      accent: "text-orange-600"
    },
    {
      title: "Automate Food Delivery",
      description: "Get ingredients or cooked meals delivered to any location, right on time.",
      img: "/why-choose-us/delivery.png",
      bg: "group-hover:bg-blue-50",
      border: "group-hover:border-blue-100",
      accent: "text-blue-600"
    },
  ];

  return (
    <section className="bg-white py-20 lg:py-32 relative overflow-hidden">
      {/* Clean Background - Modern & Plain */}

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollAnimation direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6">
              Why Choose EaseMeals?
            </h2>
            <p className="text-lg text-gray-500 font-medium">
              The comprehensive solution for effortless healthy eating.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, i) => (
            <ScrollAnimation
              key={i}
              direction="up"
              delay={i * 0.15}
              className="flex flex-col h-full"
            >
              <div
                className={`group flex flex-col items-center text-center h-full p-8 rounded-3xl transition-all duration-300 border border-transparent hover:shadow-2xl hover:-translate-y-2 ${feature.bg} ${feature.border}`}
              >
                <div className="relative w-40 h-40 mb-8 transition-transform duration-500 group-hover:scale-110">
                  <Image
                    src={feature.img}
                    alt={feature.title}
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                </div>
                <h3 className={`text-2xl font-bold text-gray-900 mb-4 group-hover:${feature.accent} transition-colors`}>{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.description}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}