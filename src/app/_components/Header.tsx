"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MenuOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import conts from "@/lib/conts";
import uniqid from "uniqid";
import { HeaderProps } from "@/lib/types";

export default function Header({ user }: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#why-choose-us" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  return (
    <header
      className={`w-full top-0 z-50 sticky transition-all duration-300 ${isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="shrink-0">
            <Link href={conts.paths.home} className="flex items-center space-x-2 group">
              <Image
                src="/logo.png"
                alt="EaseMeals Logo"
                width={40}
                height={40}
                className="rounded-xl shadow-sm transform group-hover:rotate-6 transition-transform"
              />
              <span className={`text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-app_primary to-green-600`}>
                EaseMeals
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-medium text-gray-600 hover:text-app_primary transition-colors text-sm uppercase tracking-wide"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href={conts.paths.dashboard}
                  className="font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 text-app_primary font-bold bg-green-50 px-4 py-2 rounded-full border border-green-100">
                  <UserOutlined />
                  <span>{user.name}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href={conts.paths.signin}
                  className="font-medium text-gray-700 hover:text-app_primary transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href={conts.paths.signup}
                  className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-full shadow-lg shadow-green-900/10 text-sm font-bold text-white bg-app_primary hover:bg-green-800 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="inline-flex cursor-pointer items-center justify-center p-2 rounded-md bg-white/50 hover:bg-white text-gray-700 transition-colors shadow-sm border border-gray-100"
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
        className={`fixed top-0 left-0 h-full w-[85vw] sm:w-[50vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="EaseMeals Logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-app_primary">
                EaseMeals
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-900 transition-colors"
            >
              <CloseOutlined className="text-xl" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={uniqid()}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className="block py-2 text-xl font-bold text-gray-800 hover:text-app_primary transition-colors border-b border-gray-50 pb-4"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-auto pt-8">
              {user ? (
                <Link
                  href={conts.paths.dashboard}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center justify-center w-full px-6 py-4 border border-transparent rounded-full shadow-lg shadow-green-900/10 text-base font-bold text-white bg-app_primary hover:bg-green-800"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link
                    href={conts.paths.signup}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center justify-center w-full px-6 py-4 border border-transparent rounded-full shadow-lg shadow-green-900/10 text-base font-bold text-white bg-app_primary hover:bg-green-800"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href={conts.paths.signin}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block w-full text-center py-4 text-gray-600 font-semibold hover:text-app_primary"
                  >
                    Already have an account? Sign in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </header>
  );
}
