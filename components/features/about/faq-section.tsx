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
    <section className="min-h-screen flex flex-col justify-center items-center p-4 py-16 ">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-10 text-[#1F3A3A]">
          Frequently Asked Questions (FAQ)
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-2xl border border-[rgba(138,174,164,0.20)] backdrop-blur-[21px] w-[960px] p-5 flex flex-col items-start gap-2 relative"
            >
              <AccordionTrigger className="text-left font-space-grotesk text-lg font-bold text-[#1F3A3A] leading-[110%] tracking-[-0.36px] hover:text-[#1F3A3A] py-0 pr-8 w-full hover:no-underline">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="font-source-sans-pro text-base font-normal text-[#71727A] leading-[142.745%] tracking-[-0.32px] pt-0 pb-0">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}