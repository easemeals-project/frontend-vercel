import Link from "next/link";

// --- 5. Call to Action (CTA) Section ---
export default function CtaSection() {
  return (
    <section className="bg-green-600 text-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center space-y-7">
        <h2 className="text-3xl font-bold ">
          Ready to Simplify Your Meal Planning?
        </h2>
        <div className="text-md">
          Join thousands of users who have transformed their eating habits with
          EaseMeals
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/get-started" // Dummy link
            // White button on green background
            className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-sm shadow-md text-lg font-medium text-green-700 bg-white hover:bg-gray-100"
          >
            Create Your Timetable
          </Link>
          <Link
            href="/how-it-works" // Dummy link
            // Transparent button with white border
            className="inline-flex items-center justify-center px-6 py-2.5 border border-white rounded-sm shadow-md text-lg font-medium text-white hover:bg-green-700"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
