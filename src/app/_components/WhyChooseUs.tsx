"use client";

import Image from "next/image";
import { GrPlan } from "react-icons/gr";
import { MdOutlineShoppingCart } from "react-icons/md";
import uniqid from "uniqid";
import { GiForkKnifeSpoon } from "react-icons/gi";
import ScrollAnimation from "./ScrollAnimation";

export default function WhyChooseUsSection() {
  const features = [
    {
      title: "Personalized Plans",
      description:
        "Get meal plans tailored to your food preferences, dietary restrictions, and budget.",
      img: "/home/2.png",
      icon: <GrPlan className="text-white size-6" />,
      color: "bg-orange-500",
    },
    {
      title: "Diverse Recipes",
      description:
        "Explore thousands of recipes from different cuisines to keep your meals exciting and varied.",
      img: "/home/3.png",
      icon: <GiForkKnifeSpoon className="text-white size-6" />,
      color: "bg-green-600",
    },
    {
      title: "Grocery Delivery",
      description:
        "Order all ingredients for your meal plan with one click and get them delivered to your door.",
      img: "/home/4.png",
      icon: <MdOutlineShoppingCart className="text-white size-6" />,
      color: "bg-blue-500",
    },
  ];

  return (
    <section className="bg-white py-20 lg:py-32" id="why-choose-us">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation variant="fadeUp">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
              Why Choose EaseMeals?
            </h2>
            <p className="text-xl text-gray-500">
              Our smart meal planning assistant helps you create balanced meal plans
              tailored to your preferences and dietary needs.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <ScrollAnimation
              key={uniqid()}
              variant="fadeUp"
              delay={index * 0.15}
              className="group relative flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-2"
            >
              <div className="p-8 pb-0 flex-grow relative z-10">
                <div
                  className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>
              <div className="relative w-full h-48 overflow-hidden mt-auto">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={feature.img}
                  alt={feature.title}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}