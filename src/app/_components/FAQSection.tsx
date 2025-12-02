"use client";

import { useQuery } from "@apollo/client/react";
import { GET_FAQS } from "@/graphql/queries";
import { Collapse, Spin } from "antd";
import { Faq, GetFaqsResult } from "@/lib/types";
import { CaretRightOutlined } from "@ant-design/icons";

export default function FAQSection() {
  const { data, loading, error } = useQuery<GetFaqsResult>(GET_FAQS);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Spin />
      </div>
    );
  if (error) return null;

  const faqs = data?.faqs || [];

  if (faqs.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        <Collapse
          bordered={false}
          defaultActiveKey={["0"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          className="bg-transparent"
          items={faqs.map((faq: Faq) => ({
            key: faq.id,
            label: (
              <span className="text-lg font-medium text-gray-800">
                {faq.title}
              </span>
            ),
            children: <p className="text-gray-600">{faq.content}</p>,
            style: {
              marginBottom: 24,
              background: "#f8f9fa",
              borderRadius: 8,
              border: "none",
            },
          }))}
        />
      </div>
    </section>
  );
}
