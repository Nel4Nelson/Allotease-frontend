import { CircleMinus, CirclePlus } from "lucide-react";
import Image from "next/image";
import React from "react";

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
        <div className="mt-4 text-start md:grid md:grid-cols-2 md:grid-cols-2 md:gap-6">
          {/* Header & Title */}
          <div className="md:row-start-1 md:col-start-1">
            <button className="px-3 py-1 border border-[#B5651D] text-[#B5651D] text-sm rounded-full font-source">
              Ticket Sales ends soon
            </button>

            <h2 className="text-[#1F2024] font-bold my-3 text-lg md:text-3xl leading-snug">
              Timely and Adaptive Strategies to Optimize Suicide Prevention
              among Youth
            </h2>
          </div>

          {/* Register Card */}
          <div className="h-[20rem] w-full max-w-sm md:max-w-full lg:w-[19rem] my-4 bg-[#F2F4F74D] border border-[#8AAEA433] flex flex-col items-center gap-6  rounded-lg md:row-span-2 md:col-start-2">
            <div className="bg-[#F2F4F7CC] w-[100%] p-5 text-center">
              <h3 className="text-[#1F2024] font-bold text-xl">Register</h3>
              <p className="text-xs text-[#71727A]">
                Ticket sales ends Sep 21, 2024
              </p>
            </div>

            <div className="font-source font-semibold w-full flex flex-col gap-4 p-5">
              <div className="flex items-center justify-between">
                <h6>Entry</h6>
                <div className="flex items-center gap-3">
                  <CircleMinus className="text-[#8AAEA480] hover:text-[#8AAEA4] cursor-pointer" />
                  <div className="text-[#20232A]">1</div>
                  <CirclePlus className="text-[#8AAEA480] hover:text-[#8AAEA4] cursor-pointer" />
                </div>
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
          <p className="text-[#71727A] font-source text-sm md:text-base leading-relaxed md:row-start-2 md:col-start-1">
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

        <div></div>
      </div>
    </div>
  );
};

export default Hero;
