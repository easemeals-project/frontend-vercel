"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftOutlined, FileProtectOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import conts from "@/lib/conts";
import Footer from "../_components/Footer";

const PRIVACY_SECTIONS = [
  {
    number: "1",
    title: "Information We Collect",
    paragraphs: [
      "To provide our AI-driven meal automation and delivery services, we collect the following types of information:",
    ],
    items: [
      {
        label: "Personal Data:",
        text: "Name, email address, phone number, delivery addresses, and payment information when you register or subscribe.",
      },
      {
        label: "Dietary & Lifestyle Data:",
        text: "Food preferences, allergies, nutritional goals, and typical ordering habits provided to build your custom nutritional profile.",
      },
      {
        label: "Usage & Device Data:",
        text: "Information about how you interact with the EaseMeals app and website, including IP addresses, device types, operating systems, and browsing behavior.",
      },
      {
        label: "Location Data:",
        text: "Real-time location data necessary for coordinating and tracking automated deliveries via our rider network.",
      },
    ],
  },
  {
    number: "2",
    title: "How We Use Your Information",
    paragraphs: [
      "We use the collected information for the following purposes:",
    ],
    items: [
      {
        label: "Service Delivery:",
        text: "To operate the platform, process payments, and coordinate deliveries with our vendor and rider networks.",
      },
      {
        label: "Personalization:",
        text: "To train our AI systems to generate highly personalized weekly meal timetables and grocery recommendations tailored to your dietary profile.",
      },
      {
        label: "Communication:",
        text: "To send you updates regarding your orders, subscription changes, promotional offers, and customer support responses.",
      },
      {
        label: "Platform Improvement:",
        text: "To analyze user behavior, optimize our logistics network (including electric bike routing), and enhance the overall user experience.",
      },
    ],
  },
  {
    number: "3",
    title: "How We Share Your Information",
    paragraphs: [
      "EaseMeals does not sell your personal data. We share your information only under the following circumstances:",
    ],
    items: [
      {
        label: "Vendors & Riders:",
        text: "We share strictly necessary details (such as delivery address and specific dietary restrictions/allergies) with our network of local caterers, private chefs, and delivery riders to fulfill your orders safely.",
      },
      {
        label: "Service Providers:",
        text: "We may share data with trusted third-party providers who assist us with payment processing, cloud hosting, and data analytics under strict confidentiality agreements.",
      },
      {
        label: "Legal Compliance:",
        text: "We may disclose information if required to do so by law or in response to valid requests by public authorities in Nigeria.",
      },
    ],
  },
  {
    number: "4",
    title: "Data Security",
    paragraphs: [
      "We implement industry-standard technical and organizational measures to protect your personal information against unauthorized access, loss, or alteration. However, no electronic transmission or storage system is entirely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    number: "5",
    title: "Your Rights & Choices",
    paragraphs: [
      "Depending on applicable data protection laws, you have the right to:",
    ],
    items: [
      {
        label: "Access and Update:",
        text: "Review and edit your personal information and dietary profile within the app.",
      },
      {
        label: "Delete:",
        text: "Request the deletion of your account and associated personal data, subject to legal and operational retention requirements.",
      },
      {
        label: "Opt-Out:",
        text: "Unsubscribe from marketing communications at any time.",
      },
    ],
  },
  {
    number: "6",
    title: "Contact Us",
    paragraphs: [
      "If you have any questions about these Terms or our privacy practices, please contact us through the support section of the EaseMeals app.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-app_bg text-text1 font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href={conts.paths.home} className="flex items-center space-x-2 group">
            <Image
              src="/easemeals-logo.png"
              alt="EaseMeals Logo"
              width={36}
              height={36}
              className="rounded-xl shadow-sm"
            />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-app_primary">Ease</span>
              <span className="text-app_secondary">Meals</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={conts.paths.terms}
              className="text-sm font-semibold text-text2 hover:text-app_primary px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href={conts.paths.signup}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-app_primary hover:text-app_secondary transition-colors"
            >
              <ArrowLeftOutlined />
              Back
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#0c513f] to-[#0a4031] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-green-100 mb-4">
            <SafetyCertificateOutlined />
            Data Protection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-green-100/90 font-medium">
            <span>Effective Date: 14/11/2026</span>
            <span>Last Updated: 14/11/2026</span>
          </div>
        </div>
      </section>

      {/* Document Switcher & Content */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Switcher Tabs */}
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 mb-8 w-fit">
            <Link
              href={conts.paths.terms}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-text2 hover:text-app_primary hover:bg-green-50 transition-colors"
            >
              <FileProtectOutlined />
              Terms &amp; Conditions
            </Link>
            <Link
              href={conts.paths.privacy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-app_primary text-white shadow-sm"
            >
              <SafetyCertificateOutlined />
              Privacy Policy
            </Link>
          </div>

          {/* Numbered Sections */}
          <div className="space-y-5">
            {PRIVACY_SECTIONS.map((sec) => (
              <div
                key={sec.number}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="w-9 h-9 rounded-xl bg-green-50 border border-green-200 text-app_primary font-extrabold text-sm flex items-center justify-center shrink-0">
                    {sec.number}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-text1 pt-1">
                    {sec.number}. {sec.title}
                  </h2>
                </div>

                <div className="space-y-3 pl-0 sm:pl-13 text-text2 leading-relaxed text-sm sm:text-base">
                  {sec.paragraphs?.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}

                  {sec.items && (
                    <ul className="space-y-2.5 pt-1">
                      {sec.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4"
                        >
                          <span className="font-bold text-text1">{item.label}</span>{" "}
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
