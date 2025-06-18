"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import TestimonialsSection from "../components/TestimonialsSection";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import BenefitsSection from "../components/BenefitsSection";
import FeatureHighlightSection from "../components/FeatureHighlightSection";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <FeatureHighlightSection />
      <TestimonialsSection />
      <Footer />
    </>
  );
}
