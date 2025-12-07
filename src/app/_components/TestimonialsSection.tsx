import { Card, Col } from "antd";
import Image from "next/image";
import uniqid from "uniqid";

// --- 4. Testimonials Section ---
export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah K.",
      role: "Busy Mom of 3",
      quote:
        '"EaseMeals has been a game-changer for my family. I used to spend hours planning meals, but now it takes just minutes. My kids love the variety!"',
      img: "/home/testimonial1.png",
    },
    {
      name: "Michael B.",
      role: "Fitness Enthusiast",
      quote:
        '"As someone who tracks macros, EaseMeals has been perfect. It generates meal plans that align with my fitness goals while keeping meals interesting."',
      img: "/home/testimonial2.png",
    },
    {
      name: "Jane D.",
      role: "Budget Conscious",
      quote:
        '"I\'ve cut my grocery bill by 30% since using EaseMeals. The budget-friendly plans have helped me save money without sacrificing taste or nutrition."',
      img: "/home/testimonial3.png",
    },
  ];

  return (
    <section id="testimonials" className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-7">
        <h2 className="text-3xl font-bold text-center text-text1">
          What Our Users Say
        </h2>
        <div className="max-w-xl text mx-auto text-center text-text2">
          Join thousands of satisfied users who have transformed their meal
          planning experience
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <Card key={uniqid()} className={`bg-app_bg! shadow-md`}>
              <div className="flex gap-x-6 align-middle content-center">
                <Image
                  src={testimonial.img}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full mx-auto mb-4"
                />
                <Col className="flex-auto">
                  <div className="font-bold">{testimonial.name}</div>
                  <span className="font-normal">{testimonial.role}</span>
                </Col>
              </div>
              <p className="text-gray-600 italic">{testimonial.quote}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
