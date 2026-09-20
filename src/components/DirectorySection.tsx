"use client";

import React, { useState, useEffect } from "react";
import { confirmAction, showError, showSuccess } from "@/lib/alerts";
import { apiUrl } from "@/lib/api";
import { Search, Filter, ShieldCheck, MapPin, Briefcase, GraduationCap, Mail, Phone, RefreshCw, Trash2, Lock, LogIn, User, X, Globe, Link, HeartHandshake, Award, LoaderCircle } from "lucide-react";

interface DirectorySectionProps {
  currentUser?: any;
  onRequireLogin?: () => void;
}

export const DirectorySection: React.FC<DirectorySectionProps> = ({ currentUser, onRequireLogin }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string>("ALL");
  const [alumniMembers, setAlumniMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const token = currentUser?.token;

  const fetchDirectory = async (page = 1, append = false) => {
    if (!token) return;
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    try {
      const queryParams = new URLSearchParams({ status: "APPROVED", page: String(page), limit: "10" });
      if (selectedBatch !== "ALL") queryParams.append("batchYear", selectedBatch);
      if (searchTerm) queryParams.append("search", searchTerm);

      const res = await fetch(apiUrl(`/api/users?${queryParams.toString()}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAlumniMembers((prev) => (append ? [...prev, ...(data.users || [])] : data.users || []));
        setCurrentPage(data.pagination?.page || page);
        setHasMore((data.pagination?.page || page) < (data.pagination?.totalPages || page));
      }
    } catch (error) {
      console.error("Failed to fetch alumni directory:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, [selectedBatch, searchTerm, token]);

  if (!currentUser) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-20 text-center select-none">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-10 sm:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 blur-[90px] rounded-full pointer-events-none" />
          <div className="w-16 h-16 rounded-3xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
            Alumni Directory Restricted to Members
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed mb-8">
            To protect alumni member contact privacy and prevent unauthorized access, the Alumni & Mentor Directory is strictly reserved for verified members.
          </p>
          {onRequireLogin && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onRequireLogin()}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4" />
                Log In to Search Directory
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  const handleDeleteUser = async (userId: string) => {
    if (!token) return;
    if (!(await confirmAction("Delete this member?", "This member account will be permanently removed."))) return;
    try {
      const res = await fetch(apiUrl(`/api/users/${userId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAlumniMembers((prev) => prev.filter((m) => m.id !== userId));
        showSuccess("Member deleted");
      } else {
        showError("Could not delete member", "Please try again.");
      }
    } catch (err) {
      console.error("Delete user error:", err);
      showError("Could not delete member", "The server could not be reached.");
    }
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Alumni & Mentor Directory
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            List of verified alumni members from database
          </p>
        </div>
        <button
          onClick={() => fetchDirectory(1)}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:text-white transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-xl">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, occupation, or organization..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Batch Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-emerald-400" />
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Batches</option>
            {Array.from({ length: 60 }, (_, i) => 2025 - i).map((yr) => (
              <option key={yr} value={yr.toString()}>
                Batch {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      {alumniMembers.length === 0 ? (
        isLoading ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
            <LoaderCircle className="w-8 h-8 text-orange-400 mx-auto mb-3 animate-spin" />
            Loading alumni members...
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
            No verified alumni members found. Newly approved members will appear here.
          </div>
        )
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumniMembers.map((member) => (
            <div
              key={member.id}
              className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 relative group hover:border-emerald-500/50 transition-all shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between overflow-hidden min-w-0 break-words"
            >
              <div>
                {/* Top Row Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                    <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-[11px] font-bold shrink-0">
                      Batch {member.profile?.batchYear || "N/A"}
                    </span>
                    {member.profile?.isMentor && (
                      <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-800/60 px-2.5 py-0.5 rounded-md font-semibold shrink-0">
                        Mentoring Available
                      </span>
                    )}
                  </div>
                  {currentUser?.role === "ADMIN" && (
                    <button
                      onClick={() => handleDeleteUser(member.id)}
                      className="p-1 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-400 hover:text-rose-200 hover:bg-rose-900/60 transition-all shrink-0"
                      title="Delete User Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex items-center gap-3.5 mb-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 overflow-hidden">
                    {member.profile?.photoUrl ? (
                      <img src={member.profile.photoUrl} alt={member.profile.fullName} className="w-full h-full object-cover" />
                    ) : (
                      member.profile?.fullName?.charAt(0) || "U"
                    )}
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5 truncate">
                      <span className="truncate">{member.profile?.fullName || member.email}</span>
                      {member.profile?.verifiedAlumni && (
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{member.profile?.occupation || "Alumni Member"}</span>
                    </p>
                  </div>
                </div>

                {/* Organization & Location */}
                <div className="space-y-1.5 text-xs text-slate-300 mb-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{member.profile?.organization || "Pirojpur Govt. High School"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {member.profile?.city || "Bangladesh"}{member.profile?.country ? `, ${member.profile.country}` : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* See Profile Action Button */}
              <button
                onClick={() => setSelectedMember(member)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md mt-2 shrink-0"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                See Profile
              </button>
            </div>
            ))}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={() => fetchDirectory(currentPage + 1, true)}
              disabled={isLoadingMore}
              className="mx-auto mt-8 flex items-center gap-2 rounded-xl border border-orange-400/30 bg-orange-400/10 px-5 py-2.5 text-xs font-semibold text-orange-200 transition-all hover:bg-orange-400/20 disabled:cursor-wait disabled:opacity-60"
            >
              <LoaderCircle className={`h-4 w-4 ${isLoadingMore ? "animate-spin" : ""}`} />
              {isLoadingMore ? "Loading more..." : "Load more alumni"}
            </button>
          )}
        </>
      )}

      {/* Alumni Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto select-none animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative min-w-0 break-words">
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Banner */}
            <div className="relative h-36 sm:h-40 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 overflow-hidden">
              {selectedMember.profile?.coverPhotoUrl && (
                <img src={selectedMember.profile.coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
              )}
            </div>

            {/* Avatar & Info */}
            <div className="px-5 sm:px-6 pb-6 relative z-10 border-b border-slate-800/80">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4 -mt-10 sm:-mt-12 mb-4 min-w-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-1 shadow-2xl shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center">
                    {selectedMember.profile?.photoUrl ? (
                      <img src={selectedMember.profile.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                        {selectedMember.profile?.fullName?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-1.5 flex-wrap break-words">
                    <span>{selectedMember.profile?.fullName || selectedMember.email}</span>
                    {selectedMember.profile?.verifiedAlumni && (
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium mt-0.5 break-words">
                    Batch {selectedMember.profile?.batchYear || "N/A"} • {selectedMember.profile?.occupation || "Alumni Member"}
                  </p>
                </div>
              </div>

              {selectedMember.profile?.isMentor && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-950 border border-teal-800 text-teal-300 text-xs font-bold">
                  <HeartHandshake className="w-4 h-4 text-teal-400" /> Active Career Mentor
                </span>
              )}
            </div>

            {/* Details Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Bio */}
              {selectedMember.profile?.bio && (
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 min-w-0 overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Biography
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
                    {selectedMember.profile.bio}
                  </p>
                </div>
              )}

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 space-y-2 min-w-0 break-words">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase text-[11px]">
                    <GraduationCap className="w-4 h-4 shrink-0" /> Academic Credentials
                  </h4>
                  <div><strong>SSC Batch:</strong> Batch {selectedMember.profile?.batchYear || "N/A"}</div>
                  {selectedMember.profile?.rollNumber && (
                    <div className="break-words"><strong>Roll Number:</strong> {selectedMember.profile.rollNumber}</div>
                  )}
                  <div><strong>Institution:</strong> Pirojpur Govt. High School</div>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 space-y-2 min-w-0 break-words">
                  <h4 className="font-bold text-teal-400 flex items-center gap-1.5 uppercase text-[11px]">
                    <Briefcase className="w-4 h-4 shrink-0" /> Professional Information
                  </h4>
                  <div className="break-words"><strong>Occupation:</strong> {selectedMember.profile?.occupation || "Alumni"}</div>
                  <div className="break-words"><strong>Organization:</strong> {selectedMember.profile?.organization || "N/A"}</div>
                  <div className="break-words">
                    <strong>Location:</strong> {selectedMember.profile?.city || "Bangladesh"}{selectedMember.profile?.country ? `, ${selectedMember.profile.country}` : ""}
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              {Array.isArray(selectedMember.profile?.skills) && selectedMember.profile.skills.length > 0 && (
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 min-w-0">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Skills & Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.profile.skills.map((sk: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 text-xs font-medium break-words">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Links */}
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 space-y-3 min-w-0">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Contact Information & Network Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 min-w-0">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{selectedMember.email}</span>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 min-w-0">
                    <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="truncate">{selectedMember.profile?.phone || "Phone not added"}</span>
                  </div>

                  {selectedMember.profile?.linkedinUrl ? (
                    <a
                      href={selectedMember.profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:underline min-w-0"
                    >
                      <Globe className="w-4 h-4 shrink-0" />
                      <span className="truncate">LinkedIn Profile</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/40 text-slate-500 min-w-0">
                      <Globe className="w-4 h-4 shrink-0" />
                      <span>No LinkedIn</span>
                    </div>
                  )}

                  {selectedMember.profile?.facebookUrl ? (
                    <a
                      href={selectedMember.profile.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 hover:underline min-w-0"
                    >
                      <Link className="w-4 h-4 shrink-0" />
                      <span className="truncate">Facebook Profile</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/40 text-slate-500 min-w-0">
                      <Link className="w-4 h-4 shrink-0" />
                      <span>No Facebook</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
