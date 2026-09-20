"use client";

import React from "react";
import { GraduationCap, Award, Landmark, BookOpen, HeartHandshake, History, Target, Users, Sparkles, CheckCircle2 } from "lucide-react";

export const AboutHistorySection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-transparent border-t border-white/10 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
         
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Our History & Glorious Heritage
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            From its early National School roots to its present-day government high school campus, Pirojpur Government High School has served generations of learners in southern Bangladesh.
          </p>
        </div>

        {/* Story & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* History Story Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                A Legacy Built Over Generations
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed space-y-3 font-normal">
                The institution&apos;s story reaches back to the emergence of lower-secondary education in Pirojpur during 1866–1867, when the National School was established under Sir John Lawrence. It was upgraded to higher-secondary grade in 1882 and formally declared a government high school on April 19, 1909, beginning operations in its new status on July 1 of that year.
                <br /><br />
                The campus now brings together colonial-era heritage and modern reinforced-concrete facilities, continuing a tradition of academic discipline, public service, and leadership.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-extrabold text-emerald-400">1866</div>
                <div className="text-[11px] text-slate-400 font-medium">Early Roots</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-teal-400">1909</div>
                <div className="text-[11px] text-slate-400 font-medium">Govt. High School</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-cyan-400">8.82</div>
                <div className="text-[11px] text-slate-400 font-medium">Campus Acres</div>
              </div>
            </div>
          </div>

          {/* Association Mission Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between hover:border-teal-500/40 transition-all shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-400 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Institution at a Glance
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                A government-administered secondary institution under the Directorate of Secondary and Higher Education (DSHE), following the NCTB national curriculum in Bengali medium through SSC under the Barisal Board.
              </p>

              <div className="space-y-3 text-xs text-slate-200">
                <div className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Principal:</strong> Md. Babur Talukdar</span>
                </div>
                <div className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Address:</strong> Post Office Road / Upper Circular Road, Ward No-05, D.C. Para, Pirojpur Sadar, Pirojpur 8500</span>
                </div>
                <div className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>School Day:</strong> Morning and day schedule, typically closing around 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Timeline Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Historical Milestones
            </h3>
            <p className="text-xs text-slate-400 mt-1">Key historic moments in our institution&apos;s journey</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                year: "1859",
                title: "Pirojpur Town",
                desc: "Pirojpur subdivision town is established, setting the civic context for later regional education.",
              },
              {
                year: "1866–67",
                title: "National School",
                desc: "Lower-secondary education emerges under Sir John Lawrence through the National School.",
              },
              {
                year: "1882",
                title: "Higher-Secondary Grade",
                desc: "The school is upgraded to serve growing educational demand across the region.",
              },
              {
                year: "1885",
                title: "Land Allocation",
                desc: "On December 14, 6.68 acres are allocated for the institution during the colonial period.",
              },
              {
                year: "1909",
                title: "Government High School",
                desc: "Declared a government high school on April 19 and operationalized in its new status on July 1.",
              },
              {
                year: "1910–24",
                title: "A Shaping Headmaster",
                desc: "Headmaster Bijoy Krishna Sen's 14-year tenure helps shape the school's academic administration.",
              },
              {
                year: "2005",
                title: "Campus Expansion",
                desc: "A new double-storied northern student hostel expands the campus footprint to 8.82 acres.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl relative hover:border-emerald-500/50 transition-all group"
              >
                <div className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold w-fit mb-3">
                  {item.year}
                </div>
                <h4 className="text-base font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* School Campus Photo Gallery */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          <div className="text-center mb-10">
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Pirojpur Govt. High School Campus Photo Gallery
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
              Memories of our cherished school grounds, red-brick colonial academic buildings, modern laboratories, and sports grounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Historic Main Academic Building",
                subtitle: "Colonial Red-Brick Heritage (Estd 1909)",
                badge: "Main Building",
                img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Science & Computer Labs",
                subtitle: "Modernized ICT & Physics Laboratories",
                badge: "Laboratories",
                img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Central School Library",
                subtitle: "Rich Repository of Books & Archives",
                badge: "Library",
                img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Green Campus Playground",
                subtitle: "Annual Athletics & Football Field",
                badge: "Playground",
                img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
              },
            ].map((photo, index) => (
              <div
                key={index}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden group hover:border-emerald-500/50 transition-all shadow-xl flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={photo.img}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-emerald-300 text-[10px] font-bold">
                    {photo.badge}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {photo.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-normal">
                    {photo.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
