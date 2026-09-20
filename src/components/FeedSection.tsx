"use client";

import React, { useState, useEffect } from "react";
import { confirmAction, showError, showSuccess } from "@/lib/alerts";
import { apiUrl } from "@/lib/api";
import { Image as ImageIcon, Send, ShieldCheck, Clock, RefreshCw, Sparkles, MessageCircle, Trash2, Lock, LogIn, LoaderCircle } from "lucide-react";
import { ImageUploader } from "./ImageUploader";

interface FeedSectionProps {
  currentUser: any;
  onRequireLogin: () => void;
  onOpenAuthorProfile?: (author: any) => void;
}

export const FeedSection: React.FC<FeedSectionProps> = ({ currentUser, onRequireLogin, onOpenAuthorProfile }) => {
  const [postContent, setPostContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const [posts, setPosts] = useState<any[]>([]);

  const token = currentUser?.token;

  const fetchPosts = async (page = 1, append = false) => {
    if (!token) return;
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    try {
      const res = await fetch(apiUrl(`/api/posts?page=${page}&limit=10`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setPosts((prev) => (append ? [...prev, ...(data.posts || [])] : data.posts || []));
        setCurrentPage(data.pagination?.page || page);
        setHasMore((data.pagination?.page || page) < (data.pagination?.totalPages || page));
      }
    } catch (error) {
      console.error("Failed to fetch feed posts:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const handleDeletePost = async (postId: string) => {
    if (!token) return;
    if (!(await confirmAction("Delete this post?", "This post will be permanently removed."))) return;
    try {
      const res = await fetch(apiUrl(`/api/posts/${postId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        showSuccess("Post deleted");
      } else {
        showError("Could not delete post", "Please try again.");
      }
    } catch (err) {
      console.error("Delete post error:", err);
      showError("Could not delete post", "The server could not be reached.");
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (!postContent.trim()) return;

    setIsSubmitting(true);
    setNoticeMessage(null);

    try {
      const res = await fetch(apiUrl("/api/posts"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: postContent,
          imageUrl: imageUrl || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.autoApproved) {
          setNoticeMessage("Your post has been published directly (Verified Alumni Auto-Approved)!");
          fetchPosts();
        } else {
          setNoticeMessage("Your post has been submitted and is awaiting admin review (Pending Moderation Queue).");
        }
        setPostContent("");
        setImageUrl("");
      } else {
        setNoticeMessage(data.error || "Failed to create post.");
      }
    } catch {
      setNoticeMessage("Unable to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-20 text-center select-none">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-10 sm:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />
          <div className="w-16 h-16 rounded-3xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
            Alumni Member Login Required
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed mb-8">
            To safeguard member privacy and foster an authentic verified alumni environment, viewing or posting in the Community Feed is restricted to registered alumni members.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onRequireLogin()}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <LogIn className="w-4 h-4" />
              Log In to Access Feed
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      {/* Create Post Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 mb-8 shadow-xl shadow-slate-950/50 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-white shadow-md">
              {currentUser?.profile?.photoUrl ? (
                <img
                  src={currentUser.profile.photoUrl}
                  alt={`${currentUser.profile?.fullName || "Alumni"} avatar`}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser?.profile?.fullName?.charAt(0) || "U"
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {currentUser ? currentUser.profile?.fullName : "Join Member Feed"}
              </h3>
              <p className="text-xs text-slate-400">
                {currentUser?.profile?.verifiedAlumni ? (
                  <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Alumni (Auto-Approve Active)
                  </span>
                ) : currentUser ? (
                  "New posts will be published after admin review"
                ) : (
                  "Login first to publish a post"
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchPosts(1)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <form onSubmit={handleCreatePost}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Share school memories, job opportunities, or updates..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all resize-none h-28"
          />

          {/* Image Uploader Component */}
          <div className="mt-3">
            <ImageUploader
              value={imageUrl}
              onChange={setImageUrl}
              token={token}
              label="Attach Photo / Image"
            />
          </div>

          {noticeMessage && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{noticeMessage}</span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Images & Media supported (ImgBB CDN)</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !postContent.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? "Publishing..." : "Post Now"}
            </button>
          </div>
        </form>
      </div>

      {/* Feed List */}
      {posts.length === 0 ? (
        isLoading ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
            <LoaderCircle className="w-8 h-8 text-orange-400 mx-auto mb-3 animate-spin" />
            Loading posts...
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
            <MessageCircle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            No posts published yet. Be the first to share an update!
          </div>
        )
      ) : (
        <>
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-lg hover:border-slate-700/80 transition-all overflow-hidden min-w-0 break-words"
              >
              {/* Author Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onOpenAuthorProfile?.(post.author)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-white shadow-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-400/70 transition-all"
                    title="View author profile"
                  >
              {post.author?.profile?.photoUrl ? (
                <img
                  src={post.author.profile.photoUrl}
                  alt={`${post.author.profile?.fullName || "Alumni"} avatar`}
                  className="w-full h-full object-cover"
                />
              ) : (
                post.author?.profile?.fullName?.charAt(0) || "U"
              )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenAuthorProfile?.(post.author)}
                        className="text-sm font-bold text-white truncate hover:text-orange-300 transition-colors text-left"
                      >
                        {post.author?.profile?.fullName || post.author?.email}
                      </button>
                      {post.author?.profile?.verifiedAlumni && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-800/60 font-semibold shrink-0">
                          <ShieldCheck className="w-3 h-3" /> Verified Alumni
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      Batch {post.author?.profile?.batchYear || "N/A"} •{" "}
                      {post.author?.profile?.occupation || "Alumni"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 ml-auto">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{" "}
                    {new Date(post.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {(currentUser?.role === "ADMIN" || currentUser?.id === post.author?.id) && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-400 hover:text-rose-200 hover:bg-rose-900/60 transition-all"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line mb-4 font-normal break-words [overflow-wrap:anywhere]">
                {post.content}
              </p>

              {/* Post Image */}
              {post.imageUrl && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-slate-800 max-h-96">
                  <img
                    src={post.imageUrl}
                    alt="Post attachment"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              </article>
            ))}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={() => fetchPosts(currentPage + 1, true)}
              disabled={isLoadingMore}
              className="mx-auto mt-8 flex items-center gap-2 rounded-xl border border-orange-400/30 bg-orange-400/10 px-5 py-2.5 text-xs font-semibold text-orange-200 transition-all hover:bg-orange-400/20 disabled:cursor-wait disabled:opacity-60"
            >
              <LoaderCircle className={`h-4 w-4 ${isLoadingMore ? "animate-spin" : ""}`} />
              {isLoadingMore ? "Loading more..." : "Load more posts"}
            </button>
          )}
        </>
      )}
    </section>
  );
};
