"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import conts from "@/lib/conts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center py-10 px-4">
      {/* --- Background Effects (Matching Hero Section) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 bg-gradient-to-br from-green-600 to-emerald-400 will-change-transform"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[90px] opacity-15 bg-[#0a4031] will-change-transform"
        />
      </div>

      {/* --- Content --- */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-4">
        {/* Logo */}
        <Link href={conts.paths.home} className="group">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Image
              src="/easemeals-logo.png"
              width={80}
              height={80}
              alt="EaseMeals Logo"
              priority
              className="object-contain drop-shadow-lg"
            />
          </motion.div>
        </Link>

        {/* Children (Forms) will be rendered here */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
