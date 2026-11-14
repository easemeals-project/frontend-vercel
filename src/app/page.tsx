import Image from "next/image";
import { redirect } from "next/navigation";
import Header from "./_components/Header"; // Assuming @ alias for src/
import Footer from "./_components/Footer"; // Assuming @ alias for src/
import { Card, Col } from "antd";
import CtaSection from "./_components/CtaSection";
import { getAuthUserServer } from "@/lib/utils/auth-utils";
import conts from "@/lib/conts";
import HeroSection from "./_components/HeroSection";
import WhyChooseUsSection from "./_components/WhyChooseUs";
import HowItWorksSection from "./_components/HowItWorksSection";
import TestimonialsSection from "./_components/TestimonialsSection";
import FAQSection from "./_components/FAQSection";
import DownloadAppSection from "./_components/DownloadAppSection";

// --- Main Page Component ---
export default async function HomePage() {
  const res = await getAuthUserServer();

  if (res?.user) {
    const role = res.user.role?.toLowerCase();
    if (role === "vendor") {
      redirect(conts.paths.vendorDashboard);
    }
    redirect(conts.paths.timetable);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header user={res?.user} />
      <HeroSection />

      <main className="grow">

        <WhyChooseUsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <DownloadAppSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}


