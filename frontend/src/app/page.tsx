"use client";

import { Card, CardContent, Grid, Box, Tooltip, Divider, Avatar, Fade, Rating, Typography } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TestimonialsSection from "../components/TestimonialsSection";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import BenefitsSection from "../components/BenefitsSection";
import FeatureHighlightSection from "../components/FeatureHighlightSection";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

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
