import Link from "next/link";
import { FacebookFilled, XOutlined, InstagramFilled } from "@ant-design/icons"; // Using antd icons
import Image from "next/image";
import conts from "@/lib/conts";
import { useMemo } from "react";
const sectionsRaw = [
  {
    name: "Resources",
    items: [
      { name: "Blog", href: "/blog" },
      { name: "Recipes", href: "/recipies" }, // Links to sections on the page
      { name: "Nutrition Guide", href: "/guide" },
      { name: "FAQ", href: "/faq" },
    ],
  },
  {
    name: "Quick Links",
    items: [
      { name: "Features", href: "/blog" },
      { name: "How it Works", href: "/recipies" }, // Links to sections on the page
      { name: "Testimonials", href: "/guide" },
      { name: "Dashboard", href: "/faq" },
    ],
  },
  {
    name: "Contact Us",
    items: [
      { name: "support@EaseMeals.com", href: "mailto:support@EaseMeals.com" },
      { name: "+1 (234) 567-890", href: "tel:+1 (234) 567-890" },
      {
        name: (
          <div className="flex space-x-4 pt-2 pl-1">
            <Link
              href="https://facebook.com" // Dummy link
              className="text-gray-400 hover:text-white"
              aria-label="Facebook"
            >
              <FacebookFilled className="h-6 w-6 scale-130" />
            </Link>
            <Link
              href="https://x.com" // Dummy link
              className="text-gray-400 hover:text-white"
              aria-label="Twitter"
            >
              <XOutlined className="h-6 w-6 scale-130" />
            </Link>
            <Link
              href="https://instagram.com" // Dummy link
              className="text-gray-400 hover:text-white"
              aria-label="Instagram"
            >
              <InstagramFilled className="h-6 w-6 scale-130" />
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
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wider mb-4">
            {section.name}
          </h3>
          <ul className="space-y-2">
            {section.items.map((item) => (
              <li>
                {item?.href ? (
                  <Link href={item.href} className="hover:text-white text-sm">
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
    <footer className="bg-text1 text-gray-400">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo and Social */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/logo.png"
                alt="EaseMeals Logo"
                width={36}
                height={36}
                className="rounded-md"
              />
              <span className="text-lg font-bold text-white tracking-wide">
                EaseMeals
              </span>
            </Link>
            <p className="text-sm">
              Your personal meal planning assistant that makes healthy eating
              simple and enjoyable
            </p>
          </div>

          {sections}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} EaseMeals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
