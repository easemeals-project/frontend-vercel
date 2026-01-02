"use client";

import Image from "next/image";
import uniqid from "uniqid";
import ScrollAnimation from "./ScrollAnimation";
import { StarFilled } from "@ant-design/icons";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah K.",
      role: "Busy Mom of 3",
      quote:
        "EaseMeals has been a game-changer for my family. I used to spend hours planning meals, but now it takes just minutes. My kids love the variety!",
      img: "/home/testimonial1.png",
      rating: 5,
    },
    {
      name: "Michael B.",
      role: "Fitness Enthusiast",
      quote:
        "As someone who tracks macros, EaseMeals has been perfect. It generates meal plans that align with my fitness goals while keeping meals interesting.",
      img: "/home/testimonial2.png",
      rating: 5,
    },
    {
      name: "Jane D.",
      role: "Budget Conscious",
      quote:
        "I've cut my grocery bill by 30% since using EaseMeals. The budget-friendly plans have helped me save money without sacrificing taste or nutrition.",
      img: "/home/testimonial3.png",
      rating: 4,
    },
  ];

  return (
    <section id="testimonials" className="bg-gradient-to-b from-white to-app_bg py-20 lg:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation variant="fadeUp">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-500">
              Join thousands of satisfied users who have transformed their meal
              planning experience
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <ScrollAnimation
              key={uniqid()}
              variant="fadeUp"
              delay={i * 0.15 + 0.2}
              className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-green-100">
                  {/* In a real app we might fallback if image missing, but preserving existing logic */}
                  <Image
                    src={testimonial.img}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 leading-none">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex mb-4 text-yellow-400 gap-1 text-sm">
                {[...Array(5)].map((_, index) => (
                  <StarFilled key={index} className={index < testimonial.rating ? "text-yellow-400" : "text-gray-200"} />
                ))}
              </div>

              <blockquote className="text-gray-600 leading-relaxed italic flex-grow">
                "{testimonial.quote}"
              </blockquote>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
