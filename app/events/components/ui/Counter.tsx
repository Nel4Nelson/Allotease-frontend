"use client"

import { useState } from "react";
import { CircleMinus, CirclePlus } from "lucide-react"; // assuming you're using lucide-react

function Counter() {
  const [count, setCount] = useState(1);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => (prev > 1 ? prev - 1 : 1)); // Prevent going below 1

  return (
    <div className="flex items-center gap-3">
      <CircleMinus
        onClick={decrement}
        className="text-[#8AAEA480] hover:text-[#8AAEA4] cursor-pointer transition active:scale-90"
      />
      <div className="text-[#20232A]">{count}</div>
      <CirclePlus
        onClick={increment}
        className="text-[#8AAEA480] hover:text-[#8AAEA4] cursor-pointer transition active:scale-90"
      />
    </div>
  );
}

export default Counter;
