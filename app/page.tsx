import NavBar from "@/components/layouts/NavBar";
import "./globals.css";
import Hero from "./components/layouts/Hero";
import Events from "./components/layouts/Events";
import { FeaturedSection } from "./components/layouts/FeaturedSection";
import Footer from "@/components/layouts/Footer";

export default function Home() {
  return (
    <div className="">
      <NavBar />
      <Hero />
      <Events />
      <FeaturedSection />
      <Footer />
    </div>
  );
}
