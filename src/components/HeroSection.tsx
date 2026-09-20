"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Users, Award, ChevronRight, ChevronLeft, BookOpen, Calendar, HeartHandshake, Image as ImageIcon, Sparkles, ExternalLink } from "lucide-react";
import { apiUrl, parseJsonResponse } from "@/lib/api";

interface HeroSectionProps {
  onExplore: (tab: string) => void;
  onOpenRegister: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onOpenRegister }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [stats, setStats] = useState({
    totalMembers: 0,
    totalMentors: 0,
    totalEvents: 0,
    totalBatches: 0,
  });

  const slides = [
    {
      id: 1,
     
      badgeIcon: ShieldCheck,
      titlePrefix: "Pirojpur Govt. High School",
      titleHighlight: "Alumni & Membership Network",
      subtitle:
        "A secure and dedicated community space for members across all batches to share experiences, career guidance, organize special events, and run fundraising campaigns.",
      primaryActionText: "Explore Alumni Directory",
      primaryAction: () => onExplore("directory"),
      secondaryActionText: "Explore Community Feed",
      secondaryTab: "feed",
      image: "/img/school.webp",
      bgImage: "/img/school.webp",
      imageCaption: "Historic Main Academic Building",
      imageSubcaption: "Colonial Red-Brick Heritage (Estd. 1909)",
      tag: "Historic Campus",
    },
    {
      id: 2,
      badge: "Grand Annual Reunions & Batch Events",
      badgeIcon: Calendar,
      titlePrefix: "Reconnect with Classmates &",
      titleHighlight: "Celebrate Nostalgic Memories",
      subtitle:
        "Discover upcoming school festivals, batch reunions, and career mentorship sessions organized by distinguished alumni.",
      primaryActionText: "View Live Events & Campaigns",
      primaryAction: () => onExplore("events"),
      secondaryActionText: "Explore Alumni Directory",
      secondaryTab: "directory",
      image: "/img/school2.jpeg",
      bgImage: "/img/school2.jpeg",
      imageCaption: "Annual Grand Alumni Reunions",
      imageSubcaption: "Uniting Batchmates Across Generations",
      tag: "Alumni Reunion",
    },
    {
      id: 3,
      badgeIcon: HeartHandshake,
      titlePrefix: "Supporting Future Leaders &",
      titleHighlight: "School Infrastructure Funds",
      subtitle:
        "Providing student scholarships, upgrading science & computer laboratories, and modernizing institutional facilities.",
      primaryActionText: "Join Fundraising Campaigns",
      primaryAction: () => onExplore("events"),
      secondaryActionText: "Join Mentorship Program",
      secondaryTab: "directory",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
      bgImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
      imageCaption: "Scholarships & Campus Labs",
      imageSubcaption: "Upgrading Modern ICT Laboratories",
      tag: "Development",
    },
    {
      id: 4,
      badgeIcon: Sparkles,
      titlePrefix: "Celebrating Excellence In",
      titleHighlight: "Academics, Sports & Culture",
      subtitle:
        "Honor our school's rich tradition in football, debate tournaments, cultural festivals, and nation-wide science Olympiads.",
      primaryActionText: "Explore School History",
      primaryAction: () => onExplore("about"),
      secondaryActionText: "View Photo Gallery",
      secondaryTab: "about",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
      bgImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80",
      imageCaption: "Central Library & Sports Ground",
      imageSubcaption: "Nurturing Talent & Character Since 1909",
      tag: "Sports & Culture",
    },
  ];

  // Auto-rotate hero slider every 3 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  useEffect(() => {
    fetch(apiUrl("/api/stats"))
      .then((res) => parseJsonResponse<typeof stats>(res))
      .then((data) => {
        if (data && typeof data.totalMembers === "number") {
          setStats(data);
        }
      })
      .catch(() => {
        // Keep the hero usable while the local API is offline.
        setStats({
          totalMembers: 0,
          totalMentors: 0,
          totalEvents: 0,
          totalBatches: 0,
        });
      });
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const activeSlide = slides[currentSlide];
  const BadgeIcon = activeSlide.badgeIcon;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden py-12 lg:py-20 bg-transparent select-none"
    >
      {/* Full-bleed Background Slider Images with Atmospheric Overlay */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform ${
            index === currentSlide
              ? "opacity-35 scale-100 filter brightness-90"
              : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{ backgroundImage: `url(${slide.bgImage})` }}
        />
      ))}

      {/* Dark Vignette & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/65 to-neutral-950/35 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-600/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-teal-500/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Main Hero Slider Content Area (Dual Column Text + Image Frame) */}
        <div className="relative w-full min-h-[460px] flex flex-col justify-center">
          
          {/* Animated Slide Item */}
          <div
            key={activeSlide.id}
            className="w-full transition-all duration-500 ease-out animate-in fade-in zoom-in-95 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left Column: Text & CTA Actions (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                {activeSlide.titlePrefix}{" "}
                <span className="bg-gradient-to-r from-orange-300 via-red-400 to-white bg-clip-text text-transparent">
                  {activeSlide.titleHighlight}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 text-sm sm:text-base text-white/90 leading-relaxed font-normal max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {activeSlide.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={activeSlide.primaryAction}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 border"
                >
                  {activeSlide.primaryActionText}
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onExplore(activeSlide.secondaryTab)}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border  font-semibold text-sm sm:text-base transition-all shadow-md backdrop-blur-md"
                >
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  {activeSlide.secondaryActionText}
                </button>
              </div>
            </div>

            {/* Right Column: High Quality Photo Showcase Card with Image Overlay Badge (5 cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md h-72 sm:h-84 lg:h-96 rounded-3xl overflow-hidden border border-emerald-500/40 bg-slate-900 shadow-2xl group transition-all duration-500 hover:border-emerald-400">
                <img
                  src={activeSlide.image}
                  alt={activeSlide.imageCaption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Visual Category Tag */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-md flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeSlide.tag}</span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
                
                {/* Caption Frame */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800/90 text-xs text-slate-300 font-medium shadow-xl">
                  <span className="text-emerald-400 font-bold block mb-1 text-sm flex items-center justify-between">
                    <span>{activeSlide.imageCaption}</span>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </span>
                  <span className="text-slate-300 block">{activeSlide.imageSubcaption}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Hero Slider Image Thumbnail & Arrow Navigation Bar */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800/80 p-3 sm:px-6 sm:py-3 rounded-2xl backdrop-blur-md shadow-2xl max-w-4xl mx-auto w-full">
            {/* Slide Arrows & Indicator Status */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-all shadow-md active:scale-95"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-xs font-bold text-slate-300 px-2">
                Slide <span className="text-emerald-400">{currentSlide + 1}</span> / {slides.length}
              </span>

              <button
                onClick={nextSlide}
                className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-all shadow-md active:scale-95"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Image Thumbnail Selector Bar */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full no-scrollbar">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`group relative flex-shrink-0 w-16 h-11 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    currentSlide === idx
                      ? "border-emerald-400 ring-2 ring-emerald-500/30 scale-105 shadow-md shadow-emerald-500/20"
                      : "border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500"
                  }`}
                  title={slide.imageCaption}
                >
                  <img
                    src={slide.image}
                    alt={slide.imageCaption}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 transition-opacity ${
                      currentSlide === idx ? "bg-transparent" : "bg-slate-950/40 group-hover:bg-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Highlight Stats Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {[
            { label: "Approved Members", value: `${stats.totalMembers}`, icon: Users },
            { label: "Active SSC Batches", value: `${stats.totalBatches}`, icon: Award },
            { label: "Career Mentors", value: `${stats.totalMentors}`, icon: ShieldCheck },
            { label: "Live Events", value: `${stats.totalEvents}`, icon: BookOpen },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl text-center hover:border-emerald-500/40 transition-all duration-300 group shadow-lg"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-950/70 border border-emerald-800/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

