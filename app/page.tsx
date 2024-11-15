"use client";

import React, { useEffect } from "react";
import { Button } from "@nextui-org/react";
import { title, subtitle } from "@/components/primitives";
import useAuthStore from "@/lib/zustand";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ExamList from "@/components/ExamList";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));
  const [userAuth, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && userAuth) {
      router.push("/upload");
    }
  }, [userAuth, loading, router]);

  return (
    <div className="min-h-screen">
      <motion.main
        className="container mx-auto px-4 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Hero />
        <Features />
        <ExamList />
        {/* <Testimonials /> */}
      </motion.main>
      <Footer />
    </div>
  );
}
