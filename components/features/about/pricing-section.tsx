import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { aboutPageData } from "@/data/about";
import { ArrowUpRightIcon } from "@/components/icons";

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-green-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export function PricingSection() {
  const { pricingCards } = aboutPageData;

  return (
    <section className="p-4 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center my-16 text-[#1F3A3A]">
          Free for <span className="text-[#08C75B]">Everyone!</span>
        </h2>

        <div className="w-full flex justify-center px-4 gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricingCards.map((card, index) => (
              <div
                key={index}
                className="bg-[#16F47614] p-6 rounded-xl shadow-lg max-w-[21.5rem] md:w-[21.5rem]"
              >
                <div
                  className={`${card.outerContainerBg} p-4 rounded-xl text-[#1F3A3A]`}
                >
                  <div
                    className={`${card.innerContainerBg} flex items-center gap-2 max-w-[8.7rem] p-1 h-[2.2rem] rounded-full mb-6`}
                  >
                    <div
                      className={`w-[21px] h-[21px] rounded-full ${card.circleBg}`}
                    />
                    <h3 className="text-sm font-bold">{card.role}</h3>
                  </div>
                  <div>
                    <p className="font-bold text-sm line-through text-gray-500">
                      {card.initialAmount}
                    </p>
                    <h4 className="text-2xl font-bold">100% FREE</h4>
                  </div>
                </div>

                <div className="mt-4">
                  <ul className="space-y-2 text-[#71727A]">
                    {card.roleDetail.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckIcon />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/signup">
            <Button
              variant="allotease-primary"
              size="allotease-lg"
              rightIcon={
                <ArrowUpRightIcon size={20} className="flex-shrink-0" />
              }
              className="w-full sm:w-auto min-w-[200px] h-12 sm:h-auto"
              aria-label="Sign up for a new account"
            >
              <span className="font-bold">Sign Up For Free</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
