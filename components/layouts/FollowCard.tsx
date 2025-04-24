import Image from "next/image";
import React from "react";

type followCardProps = {
  username: string;
  followers?: string;
  following?: boolean;
  avatarSizeClass?: string;
  className?: string;
  withdraw?: boolean;
};

const FollowCard: React.FC<followCardProps> = ({
  username,
  followers,
  following = false,
  avatarSizeClass = "w-[40px] h-[40px]",
  className = "",
  withdraw,
}) => {
  return (
    <div>
      <div
        className={`flex justify-between items-center ${
          withdraw ? "shadow-md bg-[#FFFFFF]" : "bg-[#F2F4F7]"
        } rounded-lg px-4 py-3  w-full ${className} `}
      >
        <div className="flex items-center gap-1 ">
          <div
            className={`${avatarSizeClass} rounded-full bg-[#FF5B00] border-2 border-[#BC4300] flex items-center justify-center`}
          >
            {/* border border-[#8AAEA433] rounded-xl*/}

            <Image
              src="/icons/star.svg"
              alt="star icon"
              width={40}
              height={40}
              className="object-contain object-center"
            />
          </div>
          <h5 className="font-bold md:text-lg whitespace-nowrap text-sm">{username}</h5>
        </div>

        <div className="flex flex-col items-start md:flex-row md:items-center md:w-[90%] md:justify-between">
          <div className="text-start md:flex items-center md:w-[85%] md:justify-between">
            {followers && (
              <p className="text-[#71727A] md:text-sm text-xs">{followers}</p>
            )}{" "}
          </div>

          {!withdraw ? (
            following ? (
              <button className="font-semibold md:text-sm text-xs text-[#FF5B00] px-2 py-1 font-source rounded-full border border-[#FF5B00] mt-2">
                Following
              </button>
            ) : (
              <button className="font-semibold text-white md:text-sm text-xs bg-[#FF5B00] px-2 py-1 font-source rounded-full border border-[#FF5B00] mt-2">
                Follow
              </button>
            )
          ) : (
            <button className="font-semibold text-white md:text-sm text-xs bg-[#FF5B00] px-2 py-1 font-source rounded-full border border-[#FF5B00] mt-2">
              Withdraw
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowCard;
