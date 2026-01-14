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
      img: "/hero_assets/testimonial1.png",
      rating: 5,
    },
    {
      name: "Michael B.",
      role: "Fitness Enthusiast",
      quote:
        "As someone who tracks macros, EaseMeals has been perfect. It generates meal plans that align with my fitness goals while keeping meals interesting.",
      img: "/hero_assets/testimonial2.png",
      rating: 5,
    },
    {
      name: "Jane D.",
      role: "Budget Conscious",
      quote:
        "I've cut my grocery bill by 30% since using EaseMeals. The budget-friendly plans have helped me save money without sacrificing taste or nutrition.",
      img: "/hero_assets/testimonial3.png",
      rating: 4,
    },
  ];

  return (
    <section id="testimonials" className="bg-white py-20 lg:py-32 relative overflow-hidden border-t border-gray-50">

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight sm:text-5xl">
              Don't just take our word for it
            </h2>
            <p className="text-xl text-gray-500 font-medium">
              See what the community is saying on social media.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <ScrollAnimation
              key={uniqid()}
              direction="up"
              delay={i * 0.1}
              className="flex flex-col h-full bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={testimonial.img}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-base font-bold text-gray-900 leading-none">
                        {testimonial.name}
                      </h4>
                      <span className="text-blue-500 text-[10px] bg-blue-50 rounded-full px-1">✓</span>
                    </div>
                    <p className="text-xs text-gray-500">@{testimonial.name.replace(" ", "").toLowerCase()}</p>
                  </div>
                </div>
                <div className="text-gray-400">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                </div>
              </div>

              {/* Content */}
              <blockquote className="text-gray-800 leading-relaxed text-sm mb-4">
                {testimonial.quote}
              </blockquote>

              {/* Footer / Metrics */}
              <div className="mt-auto border-t border-gray-100 pt-4 flex items-center gap-6 text-gray-500 text-xs font-medium">
                <div className="flex items-center gap-1 group cursor-pointer hover:text-red-500 transition-colors">
                  <span>❤️</span> 245
                </div>
                <div className="flex items-center gap-1 group cursor-pointer hover:text-blue-500 transition-colors">
                  <span>💬</span> 12
                </div>
                <div className="flex items-center gap-1 group cursor-pointer hover:text-green-500 transition-colors">
                  <span>🔄</span> 8
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
