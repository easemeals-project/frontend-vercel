import Image from "next/image";
import uniqid from "uniqid";

export default // --- 3. How It Works Section ---
function HowItWorksSection() {
  const steps = [
    {
      title: "Enter Your Preferences",
      description:
        "Tell us what foods you enjoy, any dietary restrictions, and your budget preferences.",
    },
    {
      title: "Generate Your Timetable",
      description:
        "Our AI creates a personalized weekly meal plan based on your inputs within seconds.",
    },
    {
      title: "Customize If Needed",
      description:
        "Swap meals or adjust portions to make the plan perfect for your needs.",
    },
    {
      title: "Order Ingredients",
      description:
        "Get all your ingredients delivered or export your shopping list to your preferred store.",
    },
  ];

  return (
    <section id="how-it-works" className="w-fullbg-app_bg  py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <h2 className="text-3xl font-bold text-center text-text1">
          How EaseMeals Works
        </h2>
        <div className="max-w-xl my-2 text mx-auto text-center text-text2">
          Create your personalized meal plan in just a few simple steps{" "}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Image */}
          <div className="flex items-center">
            <Image
              src="/home/5.png"
              alt="How EaseMeals works"
              width={600}
              height={500}
              className="rounded-lg object-cover flex-auto w-auto"
            />
          </div>
          {/* Right Side: Text Content */}

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={uniqid()} className="flex items-start space-x-4">
                <div className="rounded-full bg-app_primary text-white min-h-7 min-w-7 text-center">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-text1">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}