import NavBar from "@/components/layouts/NavBar";
import React from "react";
import Hero from "./components/layouts/Hero";
import EventDetails from "./components/layouts/EventDetails";
import Categories from "./components/layouts/Categories";
import EventList from "./components/layouts/Event";
import Footer from "@/components/layouts/Footer";

const Event = () => {
  return (
    <div>
      <NavBar />
      <Hero />
      <EventDetails />
      <Categories />
      <EventList />
      <Footer/>
    </div>
  );
};

export default Event;
