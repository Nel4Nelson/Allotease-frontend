import Image from 'next/image';
import React from 'react'

const FollowCard = () => {
  return (
    <div>
      <div className="flex gap-3 bg-[#F2F4F7] rounded-xl p-6 border border-[#8AAEA433] w-full ">
        <div className="w-20 h-20 rounded-full bg-[#FF5B00] border-2 border-[#BC4300] flex items-center justify-center">
          <Image
            src="/icons/star.svg"
            alt="star icon"
            width={40}
            height={40}
            className="object-contain object-center"
          />
        </div>

        <div className="flex flex-col items-start md:flex-row md:items-center md:w-[90%] md:justify-between">
          <div className="text-start md:flex items-center md:w-[85%] md:justify-between">
            <h5 className="font-bold text-lg">Flend Worldwide</h5>
            <p className="text-[#71727A] text-sm">117.5K Followers</p>
          </div>

          <button className="font-semibold text-sm text-[#FF5B00] w-[4.75rem] h-[2.2rem] rounded-full border border-[#FF5B00] mt-2">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}

export default FollowCard