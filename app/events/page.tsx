
import React from "react";
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import Hero from "./components/layouts/Hero";
import EventDetails from "./components/layouts/EventDetails";
import Categories from "./components/layouts/Categories";
import EventList from "./components/layouts/Event";


const Event = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <EventDetails />
      <Categories />
      <EventList />
      <Footer/>
    </div>
  );
};

export default Event;
