import Image from "next/image";
import React from "react";
import Counter from "./ui/Counter";
import { Earth } from "lucide-react";

const Hero = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-center ">
        <div className="w-[100%] h-[350] relative my-8 ">
          <Image
            src="/images/web-cam.png"
            alt="web cam"
            fill
            priority
            className="rounded-2xl"
          />
        </div>
      </div>

      <div>
        <div className="mt-4 text-start md:grid md:grid-cols-3 md:gap-x-15 md:gap-y-4">
          {/* Header & Title */}
          <div className="md:row-start-1 md:col-span-2">
            <button className="px-3 py-1 border border-[#B5651D] text-[#B5651D] text-sm rounded-full font-source">
              Ticket Sales ends soon
            </button>

            <h2 className="text-[#1F2024] font-bold my-3 text-lg md:text-3xl leading-snug">
              Timely and Adaptive Strategies to Optimize Suicide Prevention
              among Youth
            </h2>
          </div>

          {/* Register Card */}
          <div className="h-[20rem] w-full max-w-sm md:max-w-full lg:w-[19rem] my-4 bg-[#F2F4F74D] border border-[#8AAEA433] flex flex-col items-center gap-6  rounded-lg md:row-span-2 md:col-start-3">
            <div className="bg-[#F2F4F7CC] w-[100%] p-5 text-center">
              <h3 className="text-[#1F2024] font-bold text-xl">Register</h3>
              <p className="text-xs text-[#71727A]">
                Ticket sales ends Sep 21, 2024
              </p>
            </div>

            <div className="font-source font-semibold w-full flex flex-col gap-4 p-5">
              <div className="flex items-center justify-between">
                <h6>Entry</h6>
                <Counter />
              </div>

              <div className="flex gap-2">
                <h6>Fee:</h6>
                <h6 className="text-[#71727A]">Free</h6>
              </div>
            </div>

            <button className="font-semibold text-lg bg-[#FF5B00] px-4 py-2 text-white rounded-full font-source">
              Reserve a Spot
            </button>
          </div>

          {/* Description */}
          <p className="text-[#71727A] font-source text-sm md:text-base leading-relaxed md:row-start-2  md:col-span-2">
            <strong>
              Timely and Adaptive Strategies to Optimize Suicide Prevention
              among Youth
            </strong>{" "}
            is a vital event focused on innovative approaches to address youth
            suicide prevention. This session will explore practical,
            evidence-based strategies tailored to the unique challenges faced by
            young people today.
            <br />
            <br />
            Experts in mental health, education, and social work will discuss
            timely interventions and adaptive solutions designed to reduce risk
            and support resilience in youth. The event aims to empower
            participants with the tools and knowledge to make a meaningful
            impact in suicide prevention efforts within their communities.
          </p>
        </div>
      </div>

      <div className="py-6">
        <h3 className="text-[#1F2024] font-bold text-xl">Date & Time</h3>
        <h6 className="text-[#71727A] font-source flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="##1F3A3A"
            viewBox="0 0 256 256"
          >
            <path d="M232,104a8,8,0,0,0,8-8V64a16,16,0,0,0-16-16H32A16,16,0,0,0,16,64V96a8,8,0,0,0,8,8,24,24,0,0,1,0,48,8,8,0,0,0-8,8v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160a8,8,0,0,0-8-8,24,24,0,0,1,0-48ZM32,167.2a40,40,0,0,0,0-78.4V64H88V192H32Zm192,0V192H104V64H224V88.8a40,40,0,0,0,0,78.4Z"></path>
          </svg>{" "}
          <strong>Saturday, September 21 · 10am - 4pm WAT</strong>
        </h6>
      </div>

      <div className="">
        <h3 className="text-[#1F2024] font-bold text-xl">Location</h3>
        <h6 className="text-[#1F2024] font-source flex items-center gap-2">
          <Earth />
          Solution Arena
        </h6>
        <h6 className="text-[#71727A] font-source">
          Solution Arena Lagos, LA 100252
        </h6>

        <Image
          src="/images/map.svg"
          alt="map"
          height={600}
          width={900}
          priority
          className="border-none"
        />
      </div>
    </div>
  );
};

export default Hero;
