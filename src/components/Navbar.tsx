"use client";

import React, { useState } from "react";
import { GraduationCap, ShieldCheck, UserCheck, LogIn, Sparkles, Menu, X, Home, MessageSquare, Users, ShieldAlert, Calendar, Landmark, Lock, User, Edit3 } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: "login" | "register") => void;
  currentUser: any;
  onLogout: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  currentUser,
  onLogout,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home, roles: ["ANY"] },
    { id: "about", label: "About School", icon: Landmark, roles: ["ANY"] },
    { id: "feed", label: "Community Feed", icon: MessageSquare, roles: ["ANY"], requireAuth: true },
    { id: "directory", label: "Alumni Directory", icon: Users, roles: ["ANY"], requireAuth: true },
    { id: "moderation", label: "Moderation Panel", icon: ShieldAlert, roles: ["ADMIN"] },
    { id: "events", label: "Events & Campaigns", icon: Calendar, roles: ["ANY"] },
  ].filter((tab) => {
    if (tab.roles.includes("ANY")) return true;
    if (!currentUser) return false;
    return tab.roles.includes(currentUser.role);
  });

  const handleMobileNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-3xl backdrop-saturate-150 bg-slate-950/65 border-b border-white/10 shadow-[0_8px_30px_rgba(2,6,23,0.35)] select-none">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between flex-nowrap gap-2">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab("home")} 
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 whitespace-nowrap"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl  flex items-center justify-center overflow-hidden">
            <img src="/img/logo.png" alt="Pirojpur Govt. High School logo" className="w-full h-full object-cover" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight whitespace-nowrap">
              PGHS
            </h1>
            <p className="text-[15px] text-slate-400 flex items-center gap-1 font-medium whitespace-nowrap">
              Alumni Association Network <Sparkles className="w-3 h-3 text-emerald-400 inline animate-pulse" />
            </p>
          </div>
          <div className="lg:hidden block">
            <h1 className="text-sm font-extrabold text-white tracking-tight whitespace-nowrap">
              PGHS Alumni
            </h1>
          </div>
        </div>

        {/* Desktop Navigation Links (Single Line Desktop Experience) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.06] p-1.5 rounded-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(2,6,23,0.2)] shrink-0 whitespace-nowrap">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isLocked = tab.requireAuth && !currentUser;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 xl:px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 shrink-0 whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-emerald-500"}`} />
                <span>{tab.label}</span>
                {isLocked && (
                  <span title="Login Required">
                    <Lock className="w-3 h-3 text-amber-400 opacity-80" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop User Account / Auth Actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0 whitespace-nowrap">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div 
                onClick={() => onOpenProfile && onOpenProfile()}
                className="flex items-center gap-2 bg-white/[0.06] border border-emerald-400/35 px-3 py-1.5 rounded-2xl shadow-[0_6px_20px_rgba(2,6,23,0.2)] cursor-pointer hover:bg-white/10 hover:border-emerald-300/60 transition-all group"
                title="View & Edit Full Alumni Profile"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0 overflow-hidden">
                  {currentUser.profile?.photoUrl ? (
                    <img src={currentUser.profile.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    currentUser.profile?.fullName?.charAt(0) || "U"
                  )}
                </div>
                <div className="text-left max-w-[120px] truncate">
                  <div className="text-xs font-bold text-slate-200 truncate flex items-center gap-1 group-hover:text-emerald-300 transition-colors">
                    {currentUser.profile?.fullName}
                    {currentUser.profile?.verifiedAlumni && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <div className="text-[9px] text-emerald-500 font-mono uppercase tracking-wider font-semibold">
                    {currentUser.role}
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-xs font-semibold text-rose-400 hover:text-rose-200 px-3 py-1.5 rounded-xl bg-rose-950 border border-rose-800/40 hover:bg-rose-900/60 transition-all shadow-sm shrink-0 whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
              <button
                onClick={() => onOpenAuth("login")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-200 hover:text-white bg-rose-500/10 border border-rose-400/30 hover:bg-rose-500/20 hover:border-rose-300/60 transition-all shadow-sm whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 text-rose-400" />
                Login
              </button>
              <button
                onClick={() => onOpenAuth("register")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500/90 to-teal-500/90 hover:from-emerald-400 hover:to-teal-400 shadow-[0_8px_20px_rgba(16,185,129,0.22)] transition-all whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Header Buttons (Avatar Profile Trigger & Hamburger Menu) */}
        <div className="flex items-center md:hidden gap-2">
          {currentUser && (
            <button
              onClick={() => onOpenProfile && onOpenProfile()}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold flex items-center justify-center text-xs shadow-md border border-emerald-400/40 overflow-hidden active:scale-95 transition-transform"
              title="View & Edit Full Alumni Profile"
            >
              {currentUser.profile?.photoUrl ? (
                <img src={currentUser.profile.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                currentUser.profile?.fullName?.charAt(0) || "U"
              )}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-white/[0.06] border border-white/10 text-slate-200 hover:text-white hover:bg-white/10 transition-all shadow-[0_6px_18px_rgba(2,6,23,0.25)]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-rose-400" /> : <Menu className="w-6 h-6 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 sm:top-20 z-40 bg-slate-950/75 backdrop-blur-3xl backdrop-saturate-150 border-b border-white/10 p-6 space-y-6 shadow-[0_16px_40px_rgba(2,6,23,0.45)] animate-in slide-in-from-top duration-300 max-h-[calc(100vh-70px)] overflow-y-auto">
          {/* User Profile Card on Mobile */}
          {currentUser ? (
            <div className="bg-white/[0.06] border border-emerald-400/30 p-4 rounded-2xl space-y-3 shadow-[0_10px_28px_rgba(2,6,23,0.25)]">
              <div 
                onClick={() => {
                  if (onOpenProfile) onOpenProfile();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold flex items-center justify-center text-sm shadow-md overflow-hidden border border-emerald-400/30 shrink-0">
                    {currentUser.profile?.photoUrl ? (
                      <img src={currentUser.profile.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      currentUser.profile?.fullName?.charAt(0) || "U"
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5 group-hover:text-emerald-300 transition-colors">
                      {currentUser.profile?.fullName}
                      {currentUser.profile?.verifiedAlumni && (
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-emerald-400 font-mono uppercase font-semibold">
                      Role: {currentUser.role}
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                  <Edit3 className="w-4 h-4" />
                </div>
              </div>

              {/* Action Buttons inside User Mobile Card */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    if (onOpenProfile) onOpenProfile();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-900/80 transition-all shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-rose-950/50 border border-rose-800/50 text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-900/60 transition-all shadow-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onOpenAuth("login");
                  setMobileMenuOpen(false);
                }}
                className="py-3 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-white/10 transition-all"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                Login
              </button>
              <button
                onClick={() => {
                  onOpenAuth("register");
                  setMobileMenuOpen(false);
                }}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                <UserCheck className="w-4 h-4" />
                Register
              </button>
            </div>
          )}

          {/* Nav Items List */}
          <div className="space-y-2 border-t border-slate-800/80 pt-4">
            {currentUser && (
              <button
                onClick={() => {
                  if (onOpenProfile) onOpenProfile();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between bg-gradient-to-r from-emerald-950/90 to-teal-950/90 text-emerald-300 border border-emerald-500/40 shadow-md active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-emerald-400" />
                  <span>My Alumni Profile</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Update
                </span>
              </button>
            )}

            {navItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isLocked = tab.requireAuth && !currentUser;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleMobileNavClick(tab.id)}
                  className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-emerald-400"}`} />
                    <span>{tab.label}</span>
                  </div>
                  {isLocked && <Lock className="w-4 h-4 text-amber-400 opacity-80" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

