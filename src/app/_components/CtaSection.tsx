"use client";

import Link from "next/link";
import ScrollAnimation from "./ScrollAnimation";
import { ArrowRightOutlined } from "@ant-design/icons";
import { FaUser, FaStore, FaUtensils, FaBiking } from "react-icons/fa";

export default function CtaSection() {
  const roles = [
    {
      title: "Become a User",
      desc: "Get personalized meal plans & grocery delivery.",
      link: "/register",
      bg: "bg-green-50 hover:bg-green-100",
      text: "text-green-700",
      icon: <FaUser />,
      iconColor: "text-green-600"
    },
    {
      title: "Become a Vendor",
      desc: "Sell your ingredients or meals on our marketplace.",
      link: "/vendor/register",
      bg: "bg-orange-50 hover:bg-orange-100",
      text: "text-orange-700",
      icon: <FaStore />,
      iconColor: "text-orange-600"
    },
    {
      title: "Join as Private Chef",
      desc: "Cook for families and earn on your schedule.",
      link: "/chef/register",
      bg: "bg-blue-50 hover:bg-blue-100",
      text: "text-blue-700",
      icon: <FaUtensils />,
      iconColor: "text-blue-600"
    },
    {
      title: "Join as Rider",
      desc: "Deliver fresh meals and groceries to customers.",
      link: "/rider/register",
      bg: "bg-yellow-50 hover:bg-yellow-100",
      text: "text-yellow-700",
      icon: <FaBiking />,
      iconColor: "text-yellow-600"
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
              Join Our Network
            </h2>
            <p className="text-xl text-gray-500 font-medium">
              Ready to simplify meal planning? Choose your path.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, i) => (
            <ScrollAnimation key={i} direction="up" delay={i * 0.1} className="h-full">
              <Link href={role.link} className="block h-full cursor-pointer group">
                <div className={`h-full p-8 rounded-3xl ${role.bg} transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-gray-100 relative overflow-hidden`}>
                  <div className={`text-4xl mb-6 ${role.iconColor} p-3 bg-white rounded-2xl w-fit shadow-sm`}>{role.icon}</div>
                  <h3 className={`text-xl font-bold mb-2 ${role.text}`}>{role.title}</h3>
                  <p className="text-gray-600 font-medium text-sm mb-6 leading-relaxed">{role.desc}</p>

                  <div className={`absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0`}>
                    <ArrowRightOutlined className="text-gray-900" />
                  </div>
                </div>
              </Link>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
