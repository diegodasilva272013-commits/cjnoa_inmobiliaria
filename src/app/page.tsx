'use client'

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import StatsSection from '@/components/StatsSection'
import PropertiesSection from '@/components/PropertiesSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import Footer from '@/components/Footer'
import VoiceAgent from '@/components/VoiceAgent'
import WhatsAppButton from '@/components/WhatsAppButton'
import CustomCursor from '@/components/CustomCursor'

export default function Home() {
  return (
    <main className="relative bg-dark min-h-screen overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <Hero />
      <StatsSection />
      <PropertiesSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      {/* Floating AI Agents */}
      <VoiceAgent />
      <WhatsAppButton />
    </main>
  )
}
