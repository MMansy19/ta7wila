"use client";
import { Locale } from "@/i18n-config";
import "@/styles/style.css";
import { useEffect, useState } from "react";
import "swiper/css";
import DevPart from "./[lang]/devSection";
import DownloadApp from "./[lang]/downloadapp";
import Footer from "./[lang]/footer";
import Hero from "./[lang]/heroSection";
import Navbar from "./[lang]/navbar";
import OurFetures from "./[lang]/ourfeture";
import PaymentServices from "./[lang]/paymentServices";
import Services from "./[lang]/services";
import Slider from "./[lang]/slider";

export default function LandingPage({ lang }: { lang: Locale }) {
  const [bgColor, setBgColor] = useState("bg-transparent");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setBgColor("bg-black ");
      } else {
        setBgColor("bg-transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-black">
      <div className="flex overflow-hidden flex-col bg-imgg">
        <Navbar lang={lang} bgColor={bgColor} />
        <Hero />
      </div>
      <Slider />
      <video width="100%" height="auto" autoPlay loop muted preload="none">
        <source src="/Comp 1_14.mp4" type="video/mp4" />
        <track
          src="/subtitles-en.vtt"
          kind="subtitles"
          srcLang="en"
          label="English"
        />
        Your browser does not support the video tag.
      </video>

      <section id="about" className="pt-12">
        <PaymentServices />
      </section>
      <section id="services" className="pt-12">
        <Services />
      </section>
      <section id="features" className="pt-12">
        <OurFetures />
      </section>

      <DevPart />
      <section id="app" className="pt-12">
        <DownloadApp />
      </section>

      <Footer />
    </div>
  );
}
