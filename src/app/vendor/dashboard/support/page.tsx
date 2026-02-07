"use client";

import React from "react";
import { Collapse, Button } from "antd";
import {
    QuestionCircleOutlined,
    MailOutlined,
    PhoneOutlined,
    MessageOutlined,
    SafetyCertificateOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { IoChatbubblesOutline } from "react-icons/io5";

const { Panel } = Collapse;

export default function VendorSupportPage() {
    const faqs = [
        {
            question: "How long does the NAFDAC verification process take?",
            answer: "The NAFDAC verification process typically takes 4-6 weeks from the date of sample pickup. This includes laboratory testing, documentation review, and final approval.",
        },
        {
            question: "What documents are required for vendor registration?",
            answer: "You need a valid ID, Business Registration Certificate (CAC), Food Handler's Certificate, and recent passport photographs.",
        },
        {
            question: "How do I update my menu items?",
            answer: "Navigate to the 'Profile Management' section and select the 'Menu' tab. You can add, edit, or remove items from there.",
        },
        {
            question: "What fees are associated with using EaseMeals as a vendor?",
            answer: "EaseMeals charges a 10% commission on each completed order. There are no monthly subscription fees.",
        },
        {
            question: "How do I handle customer complaints or order issues?",
            answer: "Use the 'Support & FAQ' section to contact our support team immediately. For urgent issues, use the live chat feature.",
        },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Support & FAQ</h2>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <QuestionCircleOutlined className="text-[#0a4031]" /> Frequently Asked Questions
                </h3>

                <Collapse accordion ghost expandIconPosition="end">
                    {faqs.map((faq, index) => (
                        <Panel header={<span className="font-medium text-gray-800">{faq.question}</span>} key={index}>
                            <p className="text-gray-600 text-sm pl-4 border-l-2 border-[#0a4031]">{faq.answer}</p>
                        </Panel>
                    ))}
                </Collapse>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Compliance Support */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <SafetyCertificateOutlined className="text-orange-500" /> Compliance Support
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Have questions about NAFDAC or NDLEA compliance? Our dedicated compliance team is here to help.
                        </p>
                    </div>
                    <Button type="primary" size="large" icon={<MessageOutlined />} className="bg-[#0a4031] hover:!bg-[#083327] w-full">
                        Chat with Compliance Team
                    </Button>
                </div>

                {/* General Support */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <IoChatbubblesOutline className="text-[#0a4031]" /> Contact Support
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Need additional help? Contact our support team through any of these channels.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-[#0a4031]/10 flex items-center justify-center shrink-0">
                                <PhoneOutlined className="text-[#0a4031]" />
                            </div>
                            <span className="font-medium text-gray-700">+234 (0) 800 EaseMeals</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-[#0a4031]/10 flex items-center justify-center shrink-0">
                                <MailOutlined className="text-[#0a4031]" />
                            </div>
                            <span className="font-medium text-gray-700">support@easemeals.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-[#0a4031]/10 flex items-center justify-center shrink-0">
                                <ClockCircleOutlined className="text-[#0a4031]" />
                            </div>
                            <span className="font-medium text-gray-700">Available: Mon-Fri, 8am-6pm</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
