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

// --- Main Page Component ---
export default async function HomePage() {
  const user = await getAuthUserServer();

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <div>
        <Header user={user} />
        <HeroSection />
      </div>

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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Plan Your Meals
            <br />
            With <span className="text-green-600">Ease</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
            Create your meal timetable with ease. Get suggestions based on your
            preferences and stay on track with your nutritional goals.
          </p>
          <div className="mt-10">
            <Link
              href="/get-started" // Dummy link
              // Matching the GREEN pill-shaped button
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Your Timetable
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
        "Get meal plans tailored to your specific diet and preferences.",
      img: "/home/2.png",
      icon: <GrPlan />,
    },
    {
      title: "Diverse Recipes",
      description: "Explore thousands of recipes from various cuisines.",
      img: "/home/3.png",
      icon: <GiForkKnifeSpoon />,
    },
    {
      title: "Grocery Delivery",
      description: "Get all your ingredients delivered to your doorstep.",
      img: "/home/4.png",
      icon: <MdOutlineShoppingCart />,
    },
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose EaseMeals?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              className="bg-white rounded-lg shadow-md overflow-hidden"
              key={uniqid()}
            >
              <Image
                src={feature.img}
                alt={feature.title}
                width={300}
                height={200}
                className="w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl items-center gap-x-5 flex font-semibold text-gray-900 mb-2">
                  {feature.icon} {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
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
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div>
        <h2 className="text-3xl text-center font-bold text-gray-900 mb-8">
          How EaseMeals Works
        </h2>

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
                <CheckCircleFilled className="text-green-600! text-2xl shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Step {index + 1}: {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
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
      role: "Busy Mom",
      quote:
        '"EaseMeals has been a game-changer for my family. Meal planning is no longer a chore!"',
      img: "/home/2.png",
    },
    {
      name: "Michael B.",
      role: "Fitness Enthusiast",
      quote:
        '"I love the diverse recipes and how it fits my budget. Highly recommend!"',
      img: "/home/2.png",
    },
    {
      name: "Jane D.",
      role: "Budget Conscious",
      quote:
        '"The personalized plans have helped me stick to my diet goals. Thank you, EaseMeals!"',
      img: "/home/2.png",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-7">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          What Our Users Say
        </h2>
        <div className="max-w-xl text mx-auto text-center">
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
