import Image from "next/image";
import { GrPlan } from "react-icons/gr";
import { MdOutlineShoppingCart } from "react-icons/md";
import uniqid from "uniqid";
import { GiForkKnifeSpoon } from "react-icons/gi";

export default // --- 2. Why Choose Us Section ---
function WhyChooseUsSection() {
  const features = [
    {
      title: "Personalized Plans",
      description:
        "Get meal plans tailored to your food preferences, dietary restrictions, and budget.",
      img: "/home/2.png",
      icon: <GrPlan className="text-white size-5" />,
    },
    {
      title: "Diverse Recipes",
      description:
        "Explore thousands of recipes from different cuisines to keep your meals exciting and varied.",
      img: "/home/3.png",
      icon: <GiForkKnifeSpoon className="text-white size-5" />,
    },
    {
      title: "Grocery Delivery",
      description:
        "Order all ingredients for your meal plan with one click and get them delivered to your door.",
      img: "/home/4.png",
      icon: <MdOutlineShoppingCart className="text-white size-5" />,
    },
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24" id="why-choose-us">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-text1">
          Why Choose EaseMeals?
        </h2>
        <div className="max-w-xl my-2 text mx-auto text-center text-text2">
          Our smart meal planning assistant helps you create balanced meal plans
          tailored to your preferences and dietary needs.
        </div>
        <div className="grid grid-cols-1 mt-5 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              className="flex relative flex-col gap-2 bg-app_bg p-4 rounded-lg shadow-md overflow-hidden"
              key={uniqid()}
            >
              <div className="bg-app_primary rounded-full p-3.5 max-w-min">
                {feature.icon}
              </div>
              <h3 className="text-xl items-center gap-x-5 flex font-bold! text-text1 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
              <Image
                src={feature.img}
                alt={feature.title}
                width={300}
                height={200}
                className="w-full top-auto relative object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}