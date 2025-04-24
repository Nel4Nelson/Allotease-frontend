import FollowCard from "@/components/layouts/FollowCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import RightContent from "./RightContent";

const users = [
  { username: "Obi Ruby", following: false },
  { username: "Chidex Stanley", following: true },
  { username: "Ada Lovelace", following: false },
  { username: "John Doe", following: true },
];

const Hero = () => {
  return (
    <div className=" px-4 md:px-8 py-4 md:py-6 ">
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_1fr] md:gap-6 gap-4 border">
        {/* Avatar */}
        <div className="flex flex-col items-center md:items-center border md:row-start-1 self-start gap-5">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="bg-[#406832] flex justify-center items-center w-[5rem] h-[5rem]">
              <AvatarImage src="icons/star.svg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="mt-2 text-center md:text-left">
              <h4 className="md:text-lg font-bold text-[#1F2024]">Obi Ruby</h4>
              <p className="text-[#7A7A7A] text-sm">following 15</p>
            </div>
          </div>

          <div>
            {/* FollowCards */}
            <div className="w-full flex flex-col gap-4 md:block hidden ">
              {users.map((user, index) => (
                <div key={index} className="w-full">
                  <FollowCard
                    username={user.username}
                    following={user.following}
                  />
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RightContent */}
        <div className="md:col-span-2 w-full md:row-start-1">
          <RightContent />
        </div>

        {/* FollowCards */}
        <div className="w-full flex flex-col gap-4 md:col-span-1 md:row-start-2 md:hidden ">
          {users.map((user, index) => (
            <div key={index} className="w-full">
              <FollowCard username={user.username} following={user.following} />
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
