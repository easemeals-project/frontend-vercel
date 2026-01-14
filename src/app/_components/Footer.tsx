import Link from "next/link";
import { FacebookFilled, XOutlined, InstagramFilled, LinkedinFilled, PhoneFilled, MailFilled } from "@ant-design/icons";
import Image from "next/image";
import conts from "@/lib/conts";
import { useMemo } from "react";

const sectionsRaw = [
  {
    name: "Quick Links",
    items: [
      { name: "Features", href: "#why-choose-us" },
      { name: "How it Works", href: "#how-it-works" },
      { name: "Testimonials", href: "#testimonials" },
      { name: "Dashboard", href: conts.paths.dashboard },
    ],
  },
  {
    name: "Resources",
    items: [
      { name: "Blog", href: conts.paths.blog },
      { name: "Recipes", href: conts.paths.recipies },
      { name: "Nutrition Guide", href: conts.paths.guide },
      { name: "FAQ", href: conts.paths.faq },
    ],
  },
  {
    name: "Contact Us",
    items: [
      { name: "support@EaseMeals.com", href: "mailto:support@EaseMeals.com" },
      { name: "+234 7069954448", href: "tel:+2347069954448" }, // UPDATED PHONE
      {
        name: (
          <div className="flex flex-wrap gap-4 pt-2 pl-1">
            <Link
              href="https://web.facebook.com/profile.php?id=61584817455036"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <FacebookFilled className="text-xl" />
            </Link>
            <Link
              href="https://x.com/EaseMeals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="X (Twitter)"
            >
              <XOutlined className="text-xl" />
            </Link>
            <Link
              href="https://www.instagram.com/easemeals/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <InstagramFilled className="text-xl" />
            </Link>
            <Link
              href="https://www.linkedin.com/posts/easemeals_easemeals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinFilled className="text-xl" />
            </Link>
          </div>
        ),
      },
    ],
  },
];

export default function Footer() {
  const sections = useMemo(
    () =>
      sectionsRaw.map((section) => (
        <div key={section.name}>
          <h3 className="text-sm font-semibold text-white tracking-wider mb-4">
            {section.name}
          </h3>
          <ul className="space-y-2">
            {section.items.map((item, idx) => (
              <li key={typeof item.name === 'string' ? item.name : `social-${idx}`}>
                {item?.href && typeof item.name === 'string' ? (
                  <Link href={item.href} className="hover:text-green-400 transition-colors text-sm flex items-center gap-2">
                    {section.name === "Contact Us" && item.href.startsWith("tel") && <PhoneFilled className="text-xs" />}
                    {section.name === "Contact Us" && item.href.startsWith("mailto") && <MailFilled className="text-xs" />}
                    {item.name}
                  </Link>
                ) : (
                  item.name
                )}
              </li>
            ))}
          </ul>
        </div>
      )),
    []
  );

  return (
    <footer className="bg-[#0a4031] text-white pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/20 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo and Social */}
          <div>
            <Link href={conts.paths.home} className="flex items-center space-x-2 mb-4 group">
              <Image
                src="/enhanced_easemeals_logo.png"
                alt="EaseMeals Logo"
                width={36}
                height={36}
                className="rounded-md group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">Ease</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Meals</span>
              </span>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your personal meal planning assistant that makes healthy eating
              simple and enjoyable.
            </p>
          </div>

          {sections}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} EaseMeals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
