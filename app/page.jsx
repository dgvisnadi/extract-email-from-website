// app/page.js
'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import FeaturesAccordion from '@/components/FeaturesAccordion';
import Footer from '@/components/Footer';



export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <Hero />
      <Problem />
      <FeaturesAccordion />
      <Footer />
    </div>
  );
}
