"use client";

import { useEffect, useState } from "react";
import { confirmAction, showError, showSuccess } from "@/lib/alerts";
import { API_BASE, apiUrl, parseJsonResponse } from "@/lib/api";

export type DetailType = "event" | "campaign";
export type CurrentUser = Record<string, any> & {
  token?: string;
  role?: string;
  status?: string;
  profile?: any;
};

const validTabs = ["home", "about", "feed", "directory", "moderation", "events"];

export function useHomePage() {
  const [activeTab, setActiveTab] = useState("home");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const [dbEvents, setDbEvents] = useState<any[]>([]);
  const [dbCampaigns, setDbCampaigns] = useState<any[]>([]);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<any>(null);
  const [selectedDetailType, setSelectedDetailType] = useState<DetailType>("event");

  const handleOpenDetail = (item: any, type: DetailType) => {
    setSelectedDetailItem(item);
    setSelectedDetailType(type);
    setDetailModalOpen(true);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedUser = localStorage.getItem("alumni_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);

        if (parsedUser?.token) {
          fetch(apiUrl("/api/auth/me"), {
            headers: {
              Authorization: `Bearer ${parsedUser.token}`,
            },
          })
            .then((res) => {
              if (!res.ok) {
                localStorage.removeItem("alumni_user");
                setCurrentUser(null);
                return null;
              }
              return parseJsonResponse<{ user?: any }>(res);
            })
            .then((data) => {
              if (data?.user) {
                setCurrentUser((prev) => {
                  const updated = {
                    ...(prev ?? {}),
                    ...parsedUser,
                    role: data.user.role,
                    status: data.user.status,
                    profile: data.user.profile,
                  };
                  localStorage.setItem("alumni_user", JSON.stringify(updated));
                  return updated;
                });
              }
            })
            .catch(() => {
              localStorage.removeItem("alumni_user");
              setCurrentUser(null);
            });
        }
      } catch {
        localStorage.removeItem("alumni_user");
      }
    }

    const hashTab = window.location.hash.replace("#", "");
    const savedTab = localStorage.getItem("alumni_active_tab") || hashTab;
    if (savedTab && validTabs.includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    fetch(apiUrl("/api/events"))
      .then((res) => parseJsonResponse(res))
      .then((data) => {
        if (Array.isArray(data)) setDbEvents(data);
      })
      .catch(() => {});

    fetch(apiUrl("/api/campaigns"))
      .then((res) => parseJsonResponse(res))
      .then((data) => {
        if (Array.isArray(data)) setDbCampaigns(data);
      })
      .catch(() => {});
  }, []);

  const handleDeleteEvent = async (id: string) => {
    if (!currentUser?.token) return;
    if (!(await confirmAction("Delete this event?", "This event will be permanently removed."))) return;

    try {
      const res = await fetch(apiUrl(`/api/events/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      if (res.ok) {
        setDbEvents((prev) => prev.filter((event) => event.id !== id));
        showSuccess("Event deleted");
      } else {
        showError("Could not delete event", "Please try again.");
      }
    } catch (error) {
      console.error("Delete event error:", error);
      showError("Could not delete event", "The server could not be reached.");
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!currentUser?.token) return;
    if (!(await confirmAction("Delete this campaign?", "This campaign will be permanently removed."))) return;

    try {
      const res = await fetch(apiUrl(`/api/campaigns/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      if (res.ok) {
        setDbCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
        showSuccess("Campaign deleted");
      } else {
        showError("Could not delete campaign", "Please try again.");
      }
    } catch (error) {
      console.error("Delete campaign error:", error);
      showError("Could not delete campaign", "The server could not be reached.");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("alumni_active_tab", tab);
      window.location.hash = tab;
    }
  };

  const handleOpenAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenOwnProfile = () => {
    setProfileUser(null);
    setProfileModalOpen(true);
  };

  const handleAuthSuccess = (userData: CurrentUser) => {
    setCurrentUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("alumni_user", JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("alumni_user");
    }
  };

  return {
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
    setSelectedDetailItem,
    handleOpenDetail,
    handleDeleteEvent,
    handleDeleteCampaign,
    handleTabChange,
    handleOpenAuth,
    handleOpenOwnProfile,
    handleAuthSuccess,
    handleLogout,
  };
}
