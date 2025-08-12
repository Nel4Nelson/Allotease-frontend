import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowUpRightIcon } from 'lucide-react';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
    <path d="M20.75 7.25L10.25 17.75L5 12.5" stroke="#71727A" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PricingSection = () => {
  const organizerFeatures = [
    'Event Creation',
    'Unlimited Registration',
    'Seat allocations',
    'Reservation tracking',
    'Event Branding',
    'Support Service'
  ];

  const attendeeFeatures = [
    'Personalised events suggestions',
    'Unlimited ticketing',
    'Ticket tracking',
    'Customer Service'
  ];

  return (
    <div className="flex flex-col items-center gap-12 py-16">
      {/* Main Heading */}
      <h1 className="text-center font-space-grotesk text-5xl font-bold leading-[110%] tracking-[-0.96px]">
        <span className="text-[#1F3A3A]">Free for </span>
        <span className="text-[#08C75B]">Everyone!</span>
      </h1>

      {/* Cards Container */}
      <div className="flex gap-8 items-stretch">
        {/* Organizers Card */}
        <div 
          className="flex w-[344px] flex-col items-center gap-8 rounded-[20px] p-4 backdrop-blur-[21px]"
          style={{
            background: 'rgba(22, 244, 118, 0.08)',
            boxShadow: '2px 2px 6px 0 rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Inner Card */}
          <div 
            className="flex w-full flex-col items-start gap-6 rounded-xl p-4 backdrop-blur-[21px]"
            style={{
              background: 'rgba(22, 244, 118, 0.50)',
              boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.04)'
            }}
          >
            {/* For Organizers Badge */}
            <div className="flex items-center justify-center gap-2 rounded-[37px] bg-white px-2 py-2">
              {/* Green Dot */}
              <div 
                className="w-[21px] h-[21px] rounded-full"
                style={{ background: '#16F476' }}
              ></div>
              <span className="text-center font-space-grotesk text-sm font-bold leading-[110%] tracking-[-0.28px] text-[#1F3A3A]">
                For Organizers
              </span>
            </div>

            {/* Pricing */}
            <div className="flex flex-col gap-1">
              <span className="font-space-grotesk text-sm font-bold leading-[110%] tracking-[-0.284px] line-through text-[#1F3A3A]">
                $48/Month
              </span>
              <span className="font-space-grotesk text-2xl font-bold leading-[110%] tracking-[-0.48px] text-[#1F3A3A]">
                100% FREE
              </span>
            </div>
          </div>

          {/* Features List */}
          <div className="flex w-full flex-col gap-4 flex-grow">
            {organizerFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <CheckIcon />
                <span className="font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px] text-[#71727A]">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendees Card */}
        <div 
          className="flex w-[344px] flex-col items-center gap-8 rounded-[20px] p-4 backdrop-blur-[21px]"
          style={{
            background: 'rgba(22, 244, 118, 0.08)',
            boxShadow: '2px 2px 6px 0 rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Inner Card */}
          <div 
            className="flex w-full flex-col items-start gap-6 rounded-xl p-4 backdrop-blur-[21px]"
            style={{
              background: 'rgba(255, 255, 255, 0.60)',
              boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.04)'
            }}
          >
            {/* For Attendees Badge */}
            <div 
              className="flex items-center justify-center gap-2 rounded-[37px] px-2 py-2"
              style={{ background: '#81F9B5' }}
            >
              {/* White Dot */}
              <div className="w-[21px] h-[21px] rounded-full bg-white"></div>
              <span className="text-center font-space-grotesk text-sm font-bold leading-[110%] tracking-[-0.28px] text-[#1F3A3A]">
                For Attendees
              </span>
            </div>

            {/* Pricing */}
            <div className="flex flex-col gap-1">
              <span className="font-space-grotesk text-sm font-bold leading-[110%] tracking-[-0.284px] line-through text-[#1F3A3A]">
                $8/Month
              </span>
              <span className="font-space-grotesk text-2xl font-bold leading-[110%] tracking-[-0.48px] text-[#1F3A3A]">
                100% FREE
              </span>
            </div>
          </div>

          {/* Features List */}
          <div className="flex w-full flex-col gap-4 flex-grow">
            {attendeeFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <CheckIcon />
                <span className="font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px] text-[#71727A]">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-4 sm:mt-5 md:mt-6">
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
            <span className="font-bold">Sign Up Today</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PricingSection;