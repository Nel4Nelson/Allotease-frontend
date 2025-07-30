"use client";

import React, { useState } from "react";
import CategoryNav from "@/components/layouts/CategoryNav";
import { CardList } from "@/components/layouts/CardList";
import { availableEventsList } from "@/data/home/availableEventsLists";
import { NavItem } from "@/types";

const ReservationPageHero = () => {
  const [activeCategory, setActiveCategory] = useState(0); // local state is fine here

  const NavLists: NavItem[] = [
    { name: "Stays" },
    { name: "Events" },
    { name: "Car park" },
  ];

  return (
    <div className="w-full">
      <div className="space-y-10">
        <p className="text-sm text-[#71727A] font-source mb-4">
          Admin / reservation
        </p>

        <CategoryNav
          navItems={NavLists}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <div className="my-6 flex justify-around flex-wrap gap-6">
          {(() => {
            switch (activeCategory) {
              case 0:
                return (
                  <CardList
                    items={availableEventsList.slice(0, 3)}
                    button={{
                      text: "Manage",
                      btnLink: "/reservation/stay",
                    }}
                  />
                );
              case 1:
                return <CardList items={availableEventsList.slice(3, 6)} />;

              case 2:
                return (
                  <div className="text-center text-gray-500 py-8 text-lg font-semibold w-full">
                    🚗 Car Park Cards — Coming Soon!
                  </div>
                );
              default:
                return null;
            }
          })()}
        </div>
      </div>{" "}
    </div>
  );
};

export default ReservationPageHero;
