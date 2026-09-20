"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle, XCircle, RefreshCw, Calendar, PlusCircle, DollarSign, MapPin, Mail } from "lucide-react";
import { apiUrl, parseJsonResponse } from "@/lib/api";
import { ImageUploader } from "./ImageUploader";
import { RichTextEditor } from "./RichTextEditor";

interface ModerationPanelProps {
  currentUser?: any;
}

export const ModerationPanel: React.FC<ModerationPanelProps> = ({ currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<"members" | "posts" | "messages" | "create">("members");
  const [createType, setCreateType] = useState<"event" | "campaign">("event");

  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [guestMessages, setGuestMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Event form state
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStartsAt, setEventStartsAt] = useState("");
  const [eventCoverUrl, setEventCoverUrl] = useState("");
  const [eventImages, setEventImages] = useState<string[]>([]);
  const [eventYoutubeUrl, setEventYoutubeUrl] = useState("");
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  // Campaign form state
  const [campTitle, setCampTitle] = useState("");
  const [campDesc, setCampDesc] = useState("");
  const [campGoalAmount, setCampGoalAmount] = useState<number | "">("");
  const [campStartsAt, setCampStartsAt] = useState("");
  const [campEndsAt, setCampEndsAt] = useState("");
  const [campCoverUrl, setCampCoverUrl] = useState("");
  const [campImages, setCampImages] = useState<string[]>([]);
  const [campYoutubeUrl, setCampYoutubeUrl] = useState("");
  const [isSubmittingCamp, setIsSubmittingCamp] = useState(false);

  // Shared gallery upload temp state
  const [tempGalleryImg, setTempGalleryImg] = useState("");

  const token = currentUser?.token;

  const applyFormat = (
    tag: "b" | "i" | "u" | "h3" | "ul" | "quote",
    setText: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setText((prev) => {
      switch (tag) {
        case "b":
          return prev + " <b>Bold Text</b> ";
        case "i":
          return prev + " <i>Italic Text</i> ";
        case "u":
          return prev + " <u>Underlined Text</u> ";
        case "h3":
          return prev + "\n<h3>Heading Title</h3>\n";
        case "ul":
          return prev + "\n<ul>\n  <li>List Item 1</li>\n  <li>List Item 2</li>\n</ul>\n";
        case "quote":
          return prev + "\n<blockquote>Important Note / Quote</blockquote>\n";
        default:
          return prev;
      }
    });
  };

  const fetchPendingData = async () => {
    if (!token) return;
    setIsLoading(true);
    setMessage(null);

    try {
      // Fetch Pending Users
      const usersRes = await fetch(apiUrl("/api/users?status=PENDING"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersRes.ok) {
        const usersData = await parseJsonResponse<{ users?: any[] }>(usersRes);
        setPendingMembers(usersData.users || []);
      }

      // Fetch Pending Posts
      const postsRes = await fetch(apiUrl("/api/posts/moderation"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (postsRes.ok) {
        const postsData = await parseJsonResponse<{ posts?: any[] }>(postsRes);
        setPendingPosts(postsData.posts || []);
      }

      const messagesRes = await fetch(apiUrl("/api/guest-messages?status=NEW"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (messagesRes.ok) {
        setGuestMessages(await parseJsonResponse<any[]>(messagesRes));
      }
    } catch (error) {
      console.error("Failed to fetch moderation queue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMessageStatus = async (id: string, status: "IN_PROGRESS" | "RESOLVED") => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl(`/api/guest-messages/${id}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setGuestMessages((prev) => prev.filter((item) => item.id !== id));
        setMessage(`Guest message marked as ${status === "RESOLVED" ? "resolved" : "in progress"}.`);
      }
    } catch (error) {
      console.error("Failed to update guest message:", error);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, [token]);

  const handleUpdateUserStatus = async (userId: string, newStatus: "APPROVED" | "REJECTED") => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl(`/api/users/${userId}/status`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await parseJsonResponse<{ error?: string }>(res);
      if (res.ok) {
        setMessage(`User status updated to '${newStatus}' successfully.`);
        setPendingMembers(pendingMembers.filter((m) => m.id !== userId));
      } else {
        setMessage(data.error || "Action failed.");
      }
    } catch {
      setMessage("Unable to connect to the server.");
    }
  };

  const handleReviewPost = async (postId: string, newStatus: "APPROVED" | "REJECTED") => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl(`/api/posts/${postId}/review`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await parseJsonResponse<{ error?: string }>(res);
      if (res.ok) {
        setMessage(`Post status updated to '${newStatus}' successfully.`);
        setPendingPosts(pendingPosts.filter((p) => p.id !== postId));
      } else {
        setMessage(data.error || "Action failed.");
      }
    } catch {
      setMessage("Unable to connect to the server.");
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !eventTitle || !eventDesc || !eventStartsAt) return;

    setIsSubmittingEvent(true);
    setMessage(null);

    try {
      const res = await fetch(apiUrl("/api/events"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: eventTitle,
          description: eventDesc,
          location: eventLocation || undefined,
          startsAt: eventStartsAt,
          coverUrl: eventCoverUrl || undefined,
          images: eventImages.length > 0 ? eventImages : undefined,
          youtubeUrl: eventYoutubeUrl || undefined,
        }),
      });

      const data = await parseJsonResponse<{ error?: string }>(res);
      if (res.ok) {
        setMessage("Event published successfully!");
        setEventTitle("");
        setEventDesc("");
        setEventLocation("");
        setEventStartsAt("");
        setEventCoverUrl("");
        setEventImages([]);
        setEventYoutubeUrl("");
      } else {
        setMessage(data.error || "Failed to publish event.");
      }
    } catch {
      setMessage("Unable to connect to the server.");
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !campTitle || !campDesc || !campStartsAt) return;

    setIsSubmittingCamp(true);
    setMessage(null);

    try {
      const res = await fetch(apiUrl("/api/campaigns"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: campTitle,
          description: campDesc,
          goalAmount: campGoalAmount ? Number(campGoalAmount) : undefined,
          startsAt: campStartsAt,
          endsAt: campEndsAt || undefined,
          coverUrl: campCoverUrl || undefined,
          images: campImages.length > 0 ? campImages : undefined,
          youtubeUrl: campYoutubeUrl || undefined,
        }),
      });

      const data = await parseJsonResponse<{ error?: string }>(res);
      if (res.ok) {
        setMessage("Fundraising campaign published successfully!");
        setCampTitle("");
        setCampDesc("");
        setCampGoalAmount("");
        setCampStartsAt("");
        setCampEndsAt("");
        setCampCoverUrl("");
        setCampImages([]);
        setCampYoutubeUrl("");
      } else {
        setMessage(data.error || "Failed to publish campaign.");
      }
    } catch {
      setMessage("Unable to connect to the server.");
    } finally {
      setIsSubmittingCamp(false);
    }
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-3xl p-6 mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Moderation & Admin Panel
            </h2>
            <p className="text-xs text-slate-400">
              Manage member approvals, post moderation, and publish upcoming events or fundraising campaigns
            </p>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 w-full lg:w-auto">
          <button
            onClick={() => setActiveSubTab("members")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === "members"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Pending Members ({pendingMembers.length})
          </button>
          <button
            onClick={() => setActiveSubTab("posts")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === "posts"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Pending Posts ({pendingPosts.length})
          </button>
          <button
            onClick={() => setActiveSubTab("messages")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === "messages"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Guest Messages ({guestMessages.length})
          </button>
          <button
            onClick={() => setActiveSubTab("create")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === "create"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Publish New
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Subtab 1: Pending Members */}
      {activeSubTab === "members" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white">Pending Member Applications</h3>
            <button
              onClick={fetchPendingData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:text-white transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Queue
            </button>
          </div>

          {pendingMembers.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
              <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              No pending member applications. Database is up to date!
            </div>
          ) : (
            pendingMembers.map((member) => (
              <div
                key={member.id}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-white">
                      {member.profile?.fullName || member.email}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                      Batch {member.profile?.batchYear || "N/A"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>
                      Email: <span className="text-slate-200">{member.email}</span> | Roll:{" "}
                      <span className="text-slate-200">{member.profile?.rollNumber || "N/A"}</span>
                    </p>
                    <p>
                      Phone: <span className="text-slate-200">{member.profile?.phone || "N/A"}</span> | Occupation:{" "}
                      <span className="text-emerald-300 font-medium">
                        {member.profile?.occupation || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateUserStatus(member.id, "APPROVED")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateUserStatus(member.id, "REJECTED")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 hover:text-rose-300 text-slate-300 text-xs font-semibold transition-all border border-slate-700"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtab 2: Pending Posts */}
      {activeSubTab === "posts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white">Pending Posts Moderation Queue</h3>
            <button
              onClick={fetchPendingData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:text-white transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Queue
            </button>
          </div>

          {pendingPosts.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
              <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              Post queue is empty! No pending posts awaiting review.
            </div>
          ) : (
            pendingPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-slate-300 font-medium">
                    Author:{" "}
                    <span className="text-white font-bold">
                      {post.author?.profile?.fullName || post.author?.email}
                    </span>{" "}
                    (Batch {post.author?.profile?.batchYear || "N/A"})
                  </div>
                </div>
                <p className="text-sm text-slate-200 mb-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
                  {post.content}
                </p>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleReviewPost(post.id, "APPROVED")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve & Publish
                  </button>
                  <button
                    onClick={() => handleReviewPost(post.id, "REJECTED")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 hover:text-rose-300 text-slate-300 text-xs font-semibold transition-all border border-slate-700"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeSubTab === "messages" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-white">Guest Messages</h3>
              <p className="text-xs text-slate-400 mt-1">Questions submitted by visitors from the home page.</p>
            </div>
            <button
              onClick={fetchPendingData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:text-white transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Messages
            </button>
          </div>

          {guestMessages.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
              <Mail className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              No new guest messages.
            </div>
          ) : (
            guestMessages.map((item) => (
              <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="text-base font-bold text-white">{item.name}</h4>
                      <span className="text-xs text-orange-300">{item.email}</span>
                    </div>
                    <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{item.message}</p>
                    <p className="text-[11px] text-slate-500 mt-3">Received {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleGuestMessageStatus(item.id, "IN_PROGRESS")} className="px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-400/30 text-orange-200 text-xs font-semibold hover:bg-orange-500/20 transition-all">In progress</button>
                    <button onClick={() => handleGuestMessageStatus(item.id, "RESOLVED")} className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 text-xs font-semibold hover:bg-emerald-500/20 transition-all">Resolved</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtab 3: Unified Creation Form */}
      {activeSubTab === "create" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
          {/* Form Type Switcher */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Publish New Content</h3>
              <p className="text-xs text-slate-400">Choose whether to publish an Event or a Fundraising Campaign</p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setCreateType("event")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  createType === "event"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Event
              </button>
              <button
                type="button"
                onClick={() => setCreateType("campaign")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  createType === "campaign"
                    ? "bg-teal-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                Campaign
              </button>
            </div>
          </div>

          {createType === "event" ? (
            /* EVENT FORM */
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Annual Grand Reunion 2026"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Rich Text Editor for Description */}
              <RichTextEditor
                value={eventDesc}
                onChange={setEventDesc}
                placeholder="Detailed event description, program schedule, and instructions..."
                label="Description & Program Details"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Venue</label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. School Auditorium, Pirojpur"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventStartsAt}
                    onChange={(e) => setEventStartsAt(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* YouTube Video URL Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  YouTube Video Link / Embed URL (Optional)
                </label>
                <input
                  type="url"
                  value={eventYoutubeUrl}
                  onChange={(e) => setEventYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Cover Banner Uploader */}
              <div>
                <ImageUploader
                  value={eventCoverUrl}
                  onChange={setEventCoverUrl}
                  token={token}
                  label="Event Main Cover Banner (ImgBB CDN)"
                />
              </div>

              {/* Multiple Gallery Images Uploader */}
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Attach Photo Gallery (Multiple Images)
                </label>
                <ImageUploader
                  value={tempGalleryImg}
                  onChange={(url) => {
                    if (url) {
                      setEventImages((prev) => [...prev, url]);
                      setTempGalleryImg("");
                    }
                  }}
                  token={token}
                  label="Upload Gallery Photo"
                />
                {eventImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {eventImages.map((img, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-16 group">
                        <img src={img} alt="Gallery thumb" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEventImages(eventImages.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-rose-950/80 text-rose-300 p-0.5 rounded-md hover:bg-rose-900"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmittingEvent}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <PlusCircle className="w-4 h-4" />
                {isSubmittingEvent ? "Publishing Event..." : "Publish Event"}
              </button>
            </form>
          ) : (
            /* CAMPAIGN FORM */
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  placeholder="e.g. Science Lab Renovation Fund"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Rich Text Editor for Campaign Description */}
              <RichTextEditor
                value={campDesc}
                onChange={setCampDesc}
                placeholder="Describe the goals and purpose of this fundraising campaign..."
                label="Description & Campaign Details"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Target Amount (BDT ৳)</label>
                <input
                  type="number"
                  value={campGoalAmount}
                  onChange={(e) => setCampGoalAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 500000"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={campStartsAt}
                    onChange={(e) => setCampStartsAt(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={campEndsAt}
                    onChange={(e) => setCampEndsAt(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* YouTube Video Link Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Campaign YouTube Video Link (Optional)
                </label>
                <input
                  type="url"
                  value={campYoutubeUrl}
                  onChange={(e) => setCampYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Campaign Cover Banner */}
              <div>
                <ImageUploader
                  value={campCoverUrl}
                  onChange={setCampCoverUrl}
                  token={token}
                  label="Campaign Main Cover Banner (ImgBB CDN)"
                />
              </div>

              {/* Multiple Gallery Images Uploader */}
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Attach Photo Gallery (Multiple Images)
                </label>
                <ImageUploader
                  value={tempGalleryImg}
                  onChange={(url) => {
                    if (url) {
                      setCampImages((prev) => [...prev, url]);
                      setTempGalleryImg("");
                    }
                  }}
                  token={token}
                  label="Upload Gallery Photo"
                />
                {campImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {campImages.map((img, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-16 group">
                        <img src={img} alt="Gallery thumb" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setCampImages(campImages.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-rose-950/80 text-rose-300 p-0.5 rounded-md hover:bg-rose-900"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmittingCamp}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <PlusCircle className="w-4 h-4" />
                {isSubmittingCamp ? "Publishing Campaign..." : "Publish Campaign"}
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  );
};
