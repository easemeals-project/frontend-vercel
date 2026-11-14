"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm px-6 py-10 sm:px-12 sm:py-14 text-[#2C2520]">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2C2520] tracking-tight mb-4">
          Terms &amp; Conditions
        </h1>
        <div className="text-center text-sm sm:text-base text-[#6E6A66] space-y-1 mb-8">
          <p>
            <span className="font-bold text-[#5A5550]">Effective Date:</span> 14/11/2026
          </p>
          <p>
            <span className="font-bold text-[#5A5550]">Last Updated:</span> 14/11/2026
          </p>
        </div>

        {/* Welcome Box */}
        <div className="bg-[#F7F5F0] rounded-xl p-6 sm:p-7 mb-8 text-[#1E1E1E] text-sm sm:text-base leading-relaxed">
          Welcome to EaseMeals. These Terms &amp; Conditions (&quot;Terms&quot;) govern your use
          of the EaseMeals platform, website, mobile application, and services
          (collectively, the &quot;Services&quot;). By accessing or using our Services, you agree to
          be bound by these Terms. If you do not agree, please discontinue use.
        </div>

        {/* Sections */}
        <div className="space-y-8 text-sm sm:text-[15px] leading-relaxed text-[#2C2520]">
          {/* 1. Definitions */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              1. Definitions
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-bold">&quot;EaseMeals,&quot; &quot;we,&quot; &quot;our,&quot;</span> or{" "}
                <span className="font-bold">&quot;us&quot;</span> refers to EaseMeals and its affiliates.
              </p>
              <p>
                <span className="font-bold">&quot;User,&quot; &quot;you,&quot;</span> or{" "}
                <span className="font-bold">&quot;your&quot;</span> refers to the individual or entity accessing or using the Services, including subscribers, food vendors, cloud kitchens, and delivery partners.
              </p>
              <p>
                <span className="font-bold">&quot;Platform&quot;</span> means the EaseMeals website, mobile application, and associated services.
              </p>
              <p>
                <span className="font-bold">&quot;Content&quot;</span> means all text, graphics, data, AI-generated recommendations, nutritional profiles, meal timetables, and materials available through the Services.
              </p>
            </div>
          </section>

          {/* 2. Eligibility */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              2. Eligibility
            </h2>
            <p>
              By using the Services, you represent and warrant that you are at least 18 years old or possess legal parental or guardian consent, and are fully able and competent to enter into these Terms. The Platform is currently intended for use within Nigeria.
            </p>
          </section>

          {/* 3. Use of Services & Account Registration */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              3. Use of Services &amp; Account Registration
            </h2>
            <div className="space-y-2.5">
              <p>
                To access personalized features such as dietary preference learning, custom meal timetables, and automated delivery, you must register for an account.
              </p>
              <p>
                You agree to provide accurate, current, and complete information during registration, particularly regarding food allergies, medical conditions, and dietary restrictions.
              </p>
              <p>
                You are responsible for safeguarding your password and for all activities that occur under your account.
              </p>
            </div>
          </section>

          {/* 4. Dietary and Allergen Disclaimer */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              4. Dietary and Allergen Disclaimer
            </h2>
            <div className="space-y-2.5">
              <p>
                EaseMeals utilizes artificial intelligence to generate personalized weekly meal plans based on the preferences you provide. However:
              </p>
              <p>
                <span className="font-bold">Health and Safety:</span> We are not a medical organization. The nutritional information and meal timetables provided are for convenience and lifestyle management, not medical advice.
              </p>
              <p>
                <span className="font-bold">Allergens:</span> While we communicate your stated dietary restrictions to our franchise network of private chefs and local caterers, cross-contamination may occur. You assume full responsibility for verifying ingredients before consumption.
              </p>
            </div>
          </section>

          {/* 5. Payments, Subscriptions, and Ordering */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              5. Payments, Subscriptions, and Ordering
            </h2>
            <div className="space-y-2.5">
              <p>
                EaseMeals operates on a high-frequency, subscription-based model alongside one-off automated deliveries.
              </p>
              <p>
                <span className="font-bold">Billing:</span> By subscribing to a meal plan or ordering groceries, you authorize EaseMeals to charge your selected payment method for the total amount, including applicable taxes and delivery fees.
              </p>
              <p>
                <span className="font-bold">Cancellations &amp; Modifications:</span> Adjustments to weekly meal timetables or subscription pauses must be made within the timeframes specified on the Platform to avoid being charged for the upcoming delivery cycle.
              </p>
            </div>
          </section>

          {/* 6. Vendor and Delivery Network */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              6. Vendor and Delivery Network
            </h2>
            <div className="space-y-2.5">
              <p>
                EaseMeals operates a multi-sided marketplace connecting users with local caterers, cloud kitchens, and delivery riders (including our electric bike fleet network).
              </p>
              <p>
                We facilitate these transactions but are not directly responsible for the independent actions of third-party vendors or delivery riders, though we enforce strict quality control and operational standards across our network.
              </p>
            </div>
          </section>

          {/* 7. Intellectual Property */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              7. Intellectual Property
            </h2>
            <p>
              All Content, algorithms, AI systems, and design interfaces on the Platform are the exclusive property of EaseMeals or its licensors and are protected by Nigerian and international intellectual property laws. You may not reproduce, distribute, or create derivative works from our Content without explicit permission.
            </p>
          </section>

          {/* 8. Limitation of Liability */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, EaseMeals shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of your access to or use of the Services, food consumption, or interactions with third-party vendors and delivery partners.
            </p>
          </section>

          {/* 9. Modifications to Terms */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              9. Modifications to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the new Terms on the Platform and updating the &quot;Last Updated&quot; date. Continued use of the Services after such changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* 10. Contact Us */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              10. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us through the support section of the EaseMeals app or via our official contact channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
