"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftOutlined, FileProtectOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import conts from "@/lib/conts";
import Footer from "../_components/Footer";

const TERMS_SECTIONS = [
  {
    number: "1",
    title: "Definitions",
    items: [
      {
        label: '"EaseMeals," "we," "our," or "us"',
        text: "refers to EaseMeals and its affiliates.",
      },
      {
        label: '"User," "you," or "your"',
        text: "refers to the individual or entity accessing or using the Services, including subscribers, food vendors, cloud kitchens, and delivery partners.",
      },
      {
        label: '"Platform"',
        text: "means the EaseMeals website, mobile application, and associated services.",
      },
      {
        label: '"Content"',
        text: "means all text, graphics, data, AI-generated recommendations, nutritional profiles, meal timetables, and materials available through the Services.",
      },
    ],
  },
  {
    number: "2",
    title: "Eligibility",
    paragraphs: [
      "By using the Services, you represent and warrant that you are at least 18 years old or possess legal parental or guardian consent, and are fully able and competent to enter into these Terms. The Platform is currently intended for use within Nigeria.",
    ],
  },
  {
    number: "3",
    title: "Use of Services & Account Registration",
    paragraphs: [
      "To access personalized features such as dietary preference learning, custom meal timetables, and automated delivery, you must register for an account.",
      "You agree to provide accurate, current, and complete information during registration, particularly regarding food allergies, medical conditions, and dietary restrictions.",
      "You are responsible for safeguarding your password and for all activities that occur under your account.",
    ],
  },
  {
    number: "4",
    title: "Dietary and Allergen Disclaimer",
    paragraphs: [
      "EaseMeals utilizes artificial intelligence to generate personalized weekly meal plans based on the preferences you provide. However:",
    ],
    items: [
      {
        label: "Health and Safety:",
        text: "We are not a medical organization. The nutritional information and meal timetables provided are for convenience and lifestyle management, not medical advice.",
      },
      {
        label: "Allergens:",
        text: "While we communicate your stated dietary restrictions to our franchise network of private chefs and local caterers, cross-contamination may occur. You assume full responsibility for verifying ingredients before consumption.",
      },
    ],
  },
  {
    number: "5",
    title: "Payments, Subscriptions, and Ordering",
    paragraphs: [
      "EaseMeals operates on a high-frequency, subscription-based model alongside one-off automated deliveries.",
    ],
    items: [
      {
        label: "Billing:",
        text: "By subscribing to a meal plan or ordering groceries, you authorize EaseMeals to charge your selected payment method for the total amount, including applicable taxes and delivery fees.",
      },
      {
        label: "Cancellations & Modifications:",
        text: "Adjustments to weekly meal timetables or subscription pauses must be made within the timeframes specified on the Platform to avoid being charged for the upcoming delivery cycle.",
      },
    ],
  },
  {
    number: "6",
    title: "Vendor and Delivery Network",
    paragraphs: [
      "EaseMeals operates a multi-sided marketplace connecting users with local caterers, cloud kitchens, and delivery riders (including our electric bike fleet network).",
      "We facilitate these transactions but are not directly responsible for the independent actions of third-party vendors or delivery riders, though we enforce strict quality control and operational standards across our network.",
    ],
  },
  {
    number: "7",
    title: "Intellectual Property",
    paragraphs: [
      "All Content, algorithms, AI systems, and design interfaces on the Platform are the exclusive property of EaseMeals or its licensors and are protected by Nigerian and international intellectual property laws. You may not reproduce, distribute, or create derivative works from our Content without explicit permission.",
    ],
  },
  {
    number: "8",
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, EaseMeals shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of your access to or use of the Services, food consumption, or interactions with third-party vendors and delivery partners.",
    ],
  },
  {
    number: "9",
    title: "Modifications to Terms",
    paragraphs: [
      'We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the new Terms on the Platform and updating the "Last Updated" date. Continued use of the Services after such changes constitutes acceptance of the revised Terms.',
    ],
  },
  {
    number: "10",
    title: "Contact Us",
    paragraphs: [
      "If you have any questions about these Terms, please contact us through the support section of the EaseMeals app or via our official contact channels.",
    ],
  },
];

export default function TermsPage() {
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
              href={conts.paths.privacy}
              className="text-sm font-semibold text-text2 hover:text-app_primary px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors"
            >
              Privacy Policy
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
            <FileProtectOutlined />
            Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Terms &amp; Conditions
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-app_primary text-white shadow-sm"
            >
              <FileProtectOutlined />
              Terms &amp; Conditions
            </Link>
            <Link
              href={conts.paths.privacy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-text2 hover:text-app_primary hover:bg-green-50 transition-colors"
            >
              <SafetyCertificateOutlined />
              Privacy Policy
            </Link>
          </div>

          {/* Intro Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
            <p className="text-base text-text2 leading-relaxed">
              Welcome to <span className="font-bold text-app_primary">EaseMeals</span>. These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of the EaseMeals platform, website, mobile application, and services (collectively, the &quot;Services&quot;). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please discontinue use.
            </p>
          </div>

          {/* Numbered Sections */}
          <div className="space-y-5">
            {TERMS_SECTIONS.map((sec) => (
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
