import NavBar from "@/components/NavBar";
import "./globals.css";
import Hero from "./components/Hero";
import Event from "./components/Event";
import { FeaturedSection } from "./components/FeaturedSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="">
      <NavBar />
      <Hero />
      <Event />
      <FeaturedSection/>
      <Footer/>
    </div>
  );
}

