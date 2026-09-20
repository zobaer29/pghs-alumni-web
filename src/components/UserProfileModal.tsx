"use client";

import React, { useState, useEffect } from "react";
import { X, User, ShieldCheck, Mail, Phone, MapPin, Briefcase, GraduationCap, Globe, Link, Camera, Edit3, Save, Sparkles, Check, Lock, Award, HeartHandshake } from "lucide-react";
import { apiUrl, parseJsonResponse } from "@/lib/api";
import { ImageUploader } from "./ImageUploader";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onUpdateUser: (updatedUser: any) => void;
  readOnly?: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  readOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState<"view" | "edit">("view");

  const profile = currentUser?.profile || {};
  const token = currentUser?.token;

  // Editable Form States
  const [fullName, setFullName] = useState(profile.fullName || "");
  const [batchYear, setBatchYear] = useState<number | string>(profile.batchYear || 2020);
  const [rollNumber, setRollNumber] = useState(profile.rollNumber || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl || "");
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(profile.coverPhotoUrl || "");
  const [occupation, setOccupation] = useState(profile.occupation || "");
  const [organization, setOrganization] = useState(profile.organization || "");
  const [city, setCity] = useState(profile.city || "");
  const [country, setCountry] = useState(profile.country || "");
  const [skills, setSkills] = useState<string>(
    Array.isArray(profile.skills) ? profile.skills.join(", ") : ""
  );
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || "");
  const [facebookUrl, setFacebookUrl] = useState(profile.facebookUrl || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [isMentor, setIsMentor] = useState<boolean>(Boolean(profile.isMentor));
  const [hidePhone, setHidePhone] = useState<boolean>(profile.hidePhone !== false);
  const [hideEmail, setHideEmail] = useState<boolean>(profile.hideEmail !== false);

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.profile) {
      const p = currentUser.profile;
      setFullName(p.fullName || "");
      setBatchYear(p.batchYear || 2020);
      setRollNumber(p.rollNumber || "");
      setBio(p.bio || "");
      setPhotoUrl(p.photoUrl || "");
      setCoverPhotoUrl(p.coverPhotoUrl || "");
      setOccupation(p.occupation || "");
      setOrganization(p.organization || "");
      setCity(p.city || "");
      setCountry(p.country || "");
      setSkills(Array.isArray(p.skills) ? p.skills.join(", ") : "");
      setLinkedinUrl(p.linkedinUrl || "");
      setFacebookUrl(p.facebookUrl || "");
      setPhone(p.phone || "");
      setIsMentor(Boolean(p.isMentor));
      setHidePhone(p.hidePhone !== false);
      setHideEmail(p.hideEmail !== false);
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch(apiUrl("/api/users/me/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          batchYear: Number(batchYear),
          rollNumber,
          bio,
          photoUrl,
          coverPhotoUrl,
          occupation,
          organization,
          city,
          country,
          skills: skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
          linkedinUrl,
          facebookUrl,
          phone,
          isMentor,
          hidePhone,
          hideEmail,
        }),
      });

      const data = await parseJsonResponse<{ user?: { profile?: any }; message?: string }>(res);

      if (res.ok && data.user) {
        setSuccessMessage("Your alumni profile has been updated successfully!");
        onUpdateUser({
          ...currentUser,
          profile: data.user.profile,
        });
        setTimeout(() => setActiveTab("view"), 1000);
      } else {
        setErrorMessage(data.message || "Failed to update profile.");
      }
    } catch (err) {
      setErrorMessage("Unable to connect to the server.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Photo Header */}
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 overflow-hidden">
          {coverPhotoUrl ? (
            <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 border-b border-emerald-900/30 flex items-center justify-center text-slate-600 text-xs font-mono">
              Pirojpur Govt. High School Alumni Member
            </div>
          )}
        </div>

        {/* Profile Avatar & Primary Info Header Bar */}
        <div className="px-6 sm:px-10 pb-6 relative z-10 border-b border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-teal-800 p-1 shadow-2xl shrink-0">
                <div className="w-full h-full rounded-[22px] bg-slate-950 overflow-hidden flex items-center justify-center">
                  {photoUrl ? (
                    <img src={photoUrl} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl sm:text-5xl font-extrabold text-emerald-400">
                      {fullName?.charAt(0) || "A"}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {fullName || currentUser.email}
                  </h2>
                  {profile.verifiedAlumni && (
                    <span title="Verified Alumni Member">
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-slate-300 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800/80 text-emerald-400 font-bold">
                    Batch {batchYear || "N/A"}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span>{occupation || "Alumni Graduate"}</span>
                  {organization && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-300">{organization}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* View / Edit Mode Toggle Button */}
            {!readOnly && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab(activeTab === "view" ? "edit" : "view")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {activeTab === "view" ? (
                    <>
                      <Edit3 className="w-4 h-4" /> Edit Alumni Profile
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" /> View Profile Card
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Mentorship & Status Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {profile.isMentor && (
              <span className="px-3 py-1 rounded-xl bg-teal-950 border border-teal-800 text-teal-300 text-xs font-bold flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-teal-400" /> Active Career Mentor
              </span>
            )}
            <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" /> Account Status: <strong className="text-emerald-400 uppercase">{currentUser.status}</strong>
            </span>
          </div>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 sm:p-10">
          {activeTab === "view" ? (
            /* OVERVIEW DISPLAY MODE */
            <div className="space-y-8">
              {/* Bio Statement */}
              {bio && (
                <div className="bg-slate-950/60 border border-slate-800/80 p-6 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    About & Biography
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                    {bio}
                  </p>
                </div>
              )}

              {/* Grid Info Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Academic Info */}
                <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Academic Credentials
                  </h4>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-400">School:</span>
                      <span className="font-semibold text-white">Pirojpur Govt. High School</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-400">SSC Graduation Batch:</span>
                      <span className="font-bold text-emerald-400">Batch {batchYear}</span>
                    </div>
                    {rollNumber && (
                      <div className="flex justify-between border-b border-slate-800/60 pb-2">
                        <span className="text-slate-400">Class Roll / Identity:</span>
                        <span className="font-semibold text-slate-200">{rollNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Info */}
                <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Professional Profile
                  </h4>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-400">Current Occupation:</span>
                      <span className="font-semibold text-white">{occupation || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-400">Organization / Firm:</span>
                      <span className="font-semibold text-slate-200">{organization || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-semibold text-slate-200">
                        {city || country ? `${city || ""}${city && country ? ", " : ""}${country || ""}` : "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Expertise & Key Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((sk: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 text-xs font-semibold"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact & Social Links */}
              <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Contact & Verified Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>{currentUser.email}</span>
                  </div>
                  {phone && (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <Phone className="w-4 h-4 text-teal-400" />
                      <span>{phone}</span>
                    </div>
                  )}
                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 text-cyan-400 hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 text-blue-400 hover:underline"
                    >
                      <Link className="w-4 h-4" />
                      <span>Facebook Profile</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* EDIT PROFILE FORM MODE */
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {successMessage && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 shadow-lg">
                  <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Photo Uploaders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                <ImageUploader
                  value={photoUrl}
                  onChange={setPhotoUrl}
                  token={token}
                  label="Profile Avatar Photo"
                />
                <ImageUploader
                  value={coverPhotoUrl}
                  onChange={setCoverPhotoUrl}
                  token={token}
                  label="Profile Cover Banner Photo"
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SSC Batch Year *
                  </label>
                  <select
                    value={batchYear}
                    onChange={(e) => setBatchYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {Array.from({ length: 60 }, (_, i) => 2025 - i).map((yr) => (
                      <option key={yr} value={yr}>
                        Batch {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Class Roll Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Roll 04"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="+8801700000000"
                  />
                </div>
              </div>

              {/* Occupation & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Current Occupation
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Software Engineer / Doctor / Student"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Company or Institute Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Dhaka / Pirojpur"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Bangladesh"
                  />
                </div>
              </div>

              {/* Bio & Skills */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bio & Introduction
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                    placeholder="Share a brief overview of your journey after school..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Leadership, Public Health, Software Engineering, Teaching"
                  />
                </div>
              </div>

              {/* Social URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Facebook Profile URL
                  </label>
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="https://facebook.com/username"
                  />
                </div>
              </div>

              {/* Mentorship Toggle */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-emerald-400" /> Offer Career Mentorship
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Show a "Mentoring Available" badge to guide junior students and batchmates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isMentor}
                  onChange={(e) => setIsMentor(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Save Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("view")}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving Profile..." : "Save Alumni Profile"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
