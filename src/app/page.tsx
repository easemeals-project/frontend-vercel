import Image from "next/image";
import Link from "next/link";
import { CheckCircleFilled } from "@ant-design/icons"; // Using antd icons
import Header from "./_components/Header"; // Assuming @ alias for src/
import Footer from "./_components/Footer"; // Assuming @ alias for src/
import { Card, Col } from "antd";
import { GrPlan } from "react-icons/gr";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import CtaSection from "./_components/CtaSection";
import uniqid from "uniqid";
import { getAuthUserServer } from "@/lib/utils/auth-utils";
import conts from "@/lib/conts";
import { GrFormNextLink } from "react-icons/gr";

// --- Main Page Component ---
export default async function HomePage() {
  const res = await getAuthUserServer();

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header user={res?.user} />
      <HeroSection />

      <main className="grow">
        <WhyChooseUsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}

// --- 1. Hero Section ---
function HeroSection() {
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
              className="gap-2 flex-1 flex items-center justify-center px-5 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Your Timetable
              <GrFormNextLink className="size-7" />
            </Link>
            <Link
              href={conts.paths.dashboard}
              className="flex-1 flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-text2 ring-2 ring-text1/15"
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

// --- 2. Why Choose Us Section ---
function WhyChooseUsSection() {
  const features = [
    {
      title: "Personalized Plans",
      description:
        "Get meal plans tailored to your food preferences, dietary restrictions, and budget.",
      img: "/home/2.png",
      icon: <GrPlan className="text-white size-5" />,
    },
    {
      title: "Diverse Recipes",
      description:
        "Explore thousands of recipes from different cuisines to keep your meals exciting and varied.",
      img: "/home/3.png",
      icon: <GiForkKnifeSpoon className="text-white size-5" />,
    },
    {
      title: "Grocery Delivery",
      description:
        "Order all ingredients for your meal plan with one click and get them delivered to your door.",
      img: "/home/4.png",
      icon: <MdOutlineShoppingCart className="text-white size-5" />,
    },
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24" id="why-choose-us">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-text1">
          Why Choose EaseMeals?
        </h2>
        <div className="max-w-xl my-2 text mx-auto text-center text-text2">
          Our smart meal planning assistant helps you create balanced meal plans
          tailored to your preferences and dietary needs.
        </div>
        <div className="grid grid-cols-1 mt-5 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              className="flex relative flex-col gap-2 bg-app_bg p-4 rounded-lg shadow-md overflow-hidden"
              key={uniqid()}
            >
              <div className="bg-app_primary rounded-full p-3.5 max-w-min">
                {feature.icon}
              </div>
              <h3 className="text-xl items-center gap-x-5 flex font-bold! text-text1 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
              <Image
                src={feature.img}
                alt={feature.title}
                width={300}
                height={200}
                className="w-full top-auto relative object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- 3. How It Works Section ---
function HowItWorksSection() {
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
    <section id="how-it-works" className="container bg-app_bg  py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <h2 className="text-3xl font-bold text-center text-text1">
          How EaseMeals Works
        </h2>
        <div className="max-w-xl my-2 text mx-auto text-center text-text2">
          Create your personalized meal plan in just a few simple steps{" "}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Image */}
          <div className="flex items-center">
            <Image
              src="/home/5.png"
              alt="How EaseMeals works"
              width={600}
              height={500}
              className="rounded-lg object-cover flex-auto w-auto"
            />
          </div>
          {/* Right Side: Text Content */}

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={uniqid()} className="flex items-start space-x-4">
                <div className="rounded-full bg-app_primary text-white min-h-7 min-w-7 text-center">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-text1">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 4. Testimonials Section ---
function TestimonialsSection() {
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
