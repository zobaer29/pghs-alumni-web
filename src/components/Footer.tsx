"use client";

import React from "react";
import { GraduationCap, Heart, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent border-t border-white/10 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white">
              <img src="/img/logo.png" alt="Pirojpur Govt. High School logo" className="w-full h-full object-cover" />   
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Pirojpur Govt. High School Alumni Association
              </p>
              <p className="text-xs text-slate-500">
                Together in Success • Est. 1909
              </p>
            </div>
          </div>

          {/* Developer Info */}
          <a href="http://zobaer.dev/" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center gap-2">
              <span className="text-xs text-shadow-slate-50">
                Crafted with
              </span>
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" aria-hidden="true" />
              <span className="text-xs font-semibold text-white">
                Md Zobaer Islam
              </span>
            </div>
          </a>

          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Alumni Association. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
