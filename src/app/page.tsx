"use client";

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutHistorySection } from "@/components/AboutHistorySection";
import { FeedSection } from "@/components/FeedSection";
import { DirectorySection } from "@/components/DirectorySection";
import { ModerationPanel } from "@/components/ModerationPanel";
import { AuthModal } from "@/components/AuthModal";
import { EventDetailModal } from "@/components/EventDetailModal";
import { UserProfileModal } from "@/components/UserProfileModal";
import { Footer } from "@/components/Footer";
import { GuestMessageSection } from "@/components/GuestMessageSection";
import { EventListSection } from "@/components/home/EventListSection";
import { AllEventsSection } from "@/components/home/AllEventsSection";
import { useHomePage } from "@/hooks/useHomePage";

export default function Home() {
  const {
    activeTab,
    authModalOpen,
    profileModalOpen,
    profileUser,
    authMode,
    currentUser,
    dbEvents,
    dbCampaigns,
    detailModalOpen,
    selectedDetailItem,
    selectedDetailType,
    setProfileUser,
    setProfileModalOpen,
    setAuthModalOpen,
    setAuthMode,
    setCurrentUser,
    setDetailModalOpen,
    handleOpenDetail,
    handleDeleteEvent,
    handleDeleteCampaign,
    handleTabChange,
    handleOpenAuth,
    handleOpenOwnProfile,
    handleAuthSuccess,
    handleLogout,
  } = useHomePage();

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100 selection:bg-emerald-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenAuth={handleOpenAuth}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenProfile={handleOpenOwnProfile}
      />

      <main className="flex-1">
        {activeTab === "home" && (
          <>
            <HeroSection
              onExplore={(tab) => handleTabChange(tab)}
              onOpenRegister={() => handleOpenAuth("register")}
            />

            <AboutHistorySection />

            <EventListSection
              title="Upcoming Events & Reunions"
              subtitle="Annual school festivals, career seminars, and batch reunions"
              events={dbEvents}
              campaigns={dbCampaigns}
              currentUser={currentUser}
              onOpenDetail={handleOpenDetail}
              onDeleteEvent={handleDeleteEvent}
              onDeleteCampaign={handleDeleteCampaign}
              onViewAll={() => handleTabChange("events")}
            />

            <GuestMessageSection />
          </>
        )}

        {activeTab === "about" && <AboutHistorySection />}

        {activeTab === "feed" && (
          <FeedSection
            currentUser={currentUser}
            onRequireLogin={() => handleOpenAuth("login")}
            onOpenAuthorProfile={(author) => {
              setProfileUser(author);
              setProfileModalOpen(true);
            }}
          />
        )}

        {activeTab === "directory" && (
          <DirectorySection
            currentUser={currentUser}
            onRequireLogin={() => handleOpenAuth("login")}
          />
        )}

        {activeTab === "moderation" && (
          currentUser && currentUser.role === "ADMIN" ? (
            <ModerationPanel currentUser={currentUser} />
          ) : (
            <section className="max-w-4xl mx-auto px-4 py-16 text-center">
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-10">
                <h3 className="text-xl font-bold text-rose-400 mb-2">Access Restricted</h3>
                <p className="text-xs text-slate-400">
                  The Moderation Panel is restricted to registered Admins of Pirojpur Govt. High School Alumni Association.
                </p>
              </div>
            </section>
          )
        )}

        {activeTab === "events" && (
          <AllEventsSection
            currentUser={currentUser}
            dbEvents={dbEvents}
            dbCampaigns={dbCampaigns}
            onOpenDetail={handleOpenDetail}
            onDeleteEvent={handleDeleteEvent}
            onDeleteCampaign={handleDeleteCampaign}
            onOpenModeration={() => handleTabChange("moderation")}
          />
        )}
      </main>

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => {
          setProfileModalOpen(false);
          setProfileUser(null);
        }}
        currentUser={profileUser || currentUser}
        readOnly={Boolean(profileUser)}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          if (typeof window !== "undefined") {
            localStorage.setItem("alumni_user", JSON.stringify(updated));
          }
        }}
      />

      <EventDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        item={selectedDetailItem}
        type={selectedDetailType}
      />

      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />

      <Footer />
    </div>
  );
}
