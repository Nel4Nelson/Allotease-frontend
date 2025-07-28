import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { aboutPageData } from "@/data/about";

export function FaqSection() {
  const { faqItems } = aboutPageData;

  return (
    <section className="min-h-screen flex flex-col justify-center items-center p-4 py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-10 text-[#1F3A3A]">
          Frequently Asked Questions (FAQ)
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-lg border border-gray-200 px-6"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-[#1F3A3A] hover:text-[#2F4F4F] py-4">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-4 leading-relaxed">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
