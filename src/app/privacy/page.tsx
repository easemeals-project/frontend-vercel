"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm px-6 py-10 sm:px-12 sm:py-14 text-[#2C2520]">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2C2520] tracking-tight mb-4">
          Privacy Policy
        </h1>
        <div className="text-center text-sm sm:text-base text-[#6E6A66] space-y-1 mb-8">
          <p>
            <span className="font-bold text-[#5A5550]">Effective Date:</span> 14/11/2026
          </p>
          <p>
            <span className="font-bold text-[#5A5550]">Last Updated:</span> 14/11/2026
          </p>
        </div>

        {/* Intro Box */}
        <div className="bg-[#F7F5F0] rounded-xl p-6 sm:p-7 mb-8 text-[#1E1E1E] text-sm sm:text-base leading-relaxed">
          Welcome to EaseMeals. This Privacy Policy explains how we collect, use, share,
          and protect your personal information when you use the EaseMeals platform,
          website, mobile application, and services.
        </div>

        {/* Sections */}
        <div className="space-y-8 text-sm sm:text-[15px] leading-relaxed text-[#2C2520]">
          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              1. Information We Collect
            </h2>
            <div className="space-y-2.5">
              <p>
                To provide our AI-driven meal automation and delivery services, we collect the following types of information:
              </p>
              <p>
                <span className="font-bold">Personal Data:</span> Name, email address, phone number, delivery addresses, and payment information when you register or subscribe.
              </p>
              <p>
                <span className="font-bold">Dietary &amp; Lifestyle Data:</span> Food preferences, allergies, nutritional goals, and typical ordering habits provided to build your custom nutritional profile.
              </p>
              <p>
                <span className="font-bold">Usage &amp; Device Data:</span> Information about how you interact with the EaseMeals app and website, including IP addresses, device types, operating systems, and browsing behavior.
              </p>
              <p>
                <span className="font-bold">Location Data:</span> Real-time location data necessary for coordinating and tracking automated deliveries via our rider network.
              </p>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              2. How We Use Your Information
            </h2>
            <div className="space-y-2.5">
              <p>
                We use the collected information for the following purposes:
              </p>
              <p>
                <span className="font-bold">Service Delivery:</span> To operate the platform, process payments, and coordinate deliveries with our vendor and rider networks.
              </p>
              <p>
                <span className="font-bold">Personalization:</span> To train our AI systems to generate highly personalized weekly meal timetables and grocery recommendations tailored to your dietary profile.
              </p>
              <p>
                <span className="font-bold">Communication:</span> To send you updates regarding your orders, subscription changes, promotional offers, and customer support responses.
              </p>
              <p>
                <span className="font-bold">Platform Improvement:</span> To analyze user behavior, optimize our logistics network (including electric bike routing), and enhance the overall user experience.
              </p>
            </div>
          </section>

          {/* 3. How We Share Your Information */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              3. How We Share Your Information
            </h2>
            <div className="space-y-2.5">
              <p>
                EaseMeals does not sell your personal data. We share your information only under the following circumstances:
              </p>
              <p>
                <span className="font-bold">Vendors &amp; Riders:</span> We share strictly necessary details (such as delivery address and specific dietary restrictions/allergies) with our network of local caterers, private chefs, and delivery riders to fulfill your orders safely.
              </p>
              <p>
                <span className="font-bold">Service Providers:</span> We may share data with trusted third-party providers who assist us with payment processing, cloud hosting, and data analytics under strict confidentiality agreements.
              </p>
              <p>
                <span className="font-bold">Legal Compliance:</span> We may disclose information if required to do so by law or in response to valid requests by public authorities in Nigeria.
              </p>
            </div>
          </section>

          {/* 4. Data Security */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              4. Data Security
            </h2>
            <p>
              We implement industry-standard technical and organizational measures to protect your personal information against unauthorized access, loss, or alteration. However, no electronic transmission or storage system is entirely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* 5. Your Rights & Choices */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              5. Your Rights &amp; Choices
            </h2>
            <div className="space-y-2.5">
              <p>
                Depending on applicable data protection laws, you have the right to:
              </p>
              <p>
                <span className="font-bold">Access and Update:</span> Review and edit your personal information and dietary profile within the app.
              </p>
              <p>
                <span className="font-bold">Delete:</span> Request the deletion of your account and associated personal data, subject to legal and operational retention requirements.
              </p>
              <p>
                <span className="font-bold">Opt-Out:</span> Unsubscribe from marketing communications at any time.
              </p>
            </div>
          </section>

          {/* 6. Contact Us */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2C2520] mb-3">
              6. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms or our privacy practices, please contact us through the support section of the EaseMeals app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
