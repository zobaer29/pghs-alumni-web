"use client";

import React, { useState } from "react";
import { showInfo } from "@/lib/alerts";
import { X, Calendar, MapPin, DollarSign, Video, Image as ImageIcon, CheckCircle, Heart, Share2, Award } from "lucide-react";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  type: "event" | "campaign";
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  type,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  // Extract YouTube Video Embed URL
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(item.youtubeUrl);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Image Banner */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-950 overflow-hidden rounded-t-3xl">
          {item.coverUrl ? (
            <img
              src={item.coverUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                  {type === "event" ? <Calendar className="w-8 h-8" /> : <DollarSign className="w-8 h-8" />}
                </div>
                <h4 className="text-lg font-bold text-slate-300">Pirojpur Govt. High School Alumni</h4>
              </div>
            </div>
          )}

          {/* Badge Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-lg ${
              type === "event"
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/80"
                : "bg-teal-950/80 text-teal-300 border-teal-700/80"
            }`}>
              {type === "event" ? "Official Upcoming Event" : "Active Fundraising Campaign"}
            </span>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Info */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {item.title}
            </h2>

            {/* Event Details Meta */}
            {type === "event" && (
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>
                    Starts: {new Date(item.startsAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {item.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>
            )}

            {/* Campaign Progress Meta */}
            {type === "campaign" && (
              <div className="mt-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between text-xs font-semibold text-slate-200">
                  <span className="text-emerald-400">Raised: ৳{item.raisedAmount?.toLocaleString() || 0}</span>
                  <span>Target Goal: ৳{item.goalAmount ? item.goalAmount.toLocaleString() : "Open Goal"}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3.5 border border-slate-800 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        ((item.raisedAmount || 0) / (item.goalAmount || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description Section (Supports HTML/Rich formatting & line breaks) */}
          <div className="border-t border-slate-800/80 pt-6">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Description & Details
            </h4>
            <div
              className="text-sm text-slate-200 leading-relaxed font-normal space-y-3 prose prose-invert max-w-none prose-emerald"
              dangerouslySetInnerHTML={{ __html: item.description || "No description provided." }}
            />
          </div>

          {/* YouTube Video Player Embed Section */}
          {youtubeEmbedUrl && (
            <div className="border-t border-slate-800/80 pt-6">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-400" /> Event Video / Trailer
              </h4>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
                <iframe
                  src={youtubeEmbedUrl}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* Multiple Image Gallery Grid Section */}
          {item.images && item.images.length > 0 && (
            <div className="border-t border-slate-800/80 pt-6">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-teal-400" /> Photo Gallery ({item.images.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {item.images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto(img)}
                    className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-32 cursor-pointer group hover:border-emerald-500/60 transition-all"
                  >
                    <img
                      src={img}
                      alt={`Gallery attachment ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[11px] text-white bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 font-semibold">
                        View Photo
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer Bar */}
          <div className="border-t border-slate-800/80 pt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              {copied ? "Link Copied!" : "Share Link"}
            </button>

            {type === "event" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRsvpStatus("GOING")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    rsvpStatus === "GOING"
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/80"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {rsvpStatus === "GOING" ? "RSVP Confirmed (Going)" : "RSVP - Going"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => showInfo("Donation portal coming soon", "Thank you for supporting Pirojpur Govt. High School!")}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-white fill-white" />
                Donate to Campaign
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enlarged Photo Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-60 bg-slate-950/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedPhoto}
              alt="Enlarged gallery photo"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain border border-slate-800 shadow-2xl"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/90 text-white border border-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
