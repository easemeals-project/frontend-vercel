"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import Image from "next/image";
import conts from "@/lib/conts";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#why-choose-us" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Sign in", href: conts.paths.signin },
  ];

  return (
    <header className="bg-app_bg w-full top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="EaseMeals Logo"
                width={36}
                height={36}
                className="rounded-md"
              />
              <span className="text-lg font-bold text-app_secondary tracking-wide">
                EaseMeals
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-medium text-text1 hover:text-green-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-sm shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Get Started
            </Link>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="inline-flex cursor-pointer items-center justify-center p-2 rounded-md bg-transparent"
            >
              {isSidebarOpen ? (
                <CloseOutlined className="h-6 w-6" />
              ) : (
                <MenuOutlined className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[70vw] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-5 right-5"
          >
            <CloseOutlined />
          </button>
          <div className="mt-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className="block py-2 text-gray-800"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/signup"
              onClick={() => setIsSidebarOpen(false)}
              className="block mt-4 w-full text-center px-6 py-2 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </header>
  );
}
