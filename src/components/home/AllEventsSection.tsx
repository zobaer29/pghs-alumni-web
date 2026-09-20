import { Calendar, ExternalLink, MapPin, Trash2 } from "lucide-react";

interface AllEventsSectionProps {
  currentUser: any;
  dbEvents: any[];
  dbCampaigns: any[];
  onOpenDetail: (item: any, type: "event" | "campaign") => void;
  onDeleteEvent: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
  onOpenModeration: () => void;
}

export function AllEventsSection({
  currentUser,
  dbEvents,
  dbCampaigns,
  onOpenDetail,
  onDeleteEvent,
  onDeleteCampaign,
  onOpenModeration,
}: AllEventsSectionProps) {
  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white">
            All Events & Fundraising Campaigns
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Discover upcoming school events, reunions, and active alumni fundraising campaigns
          </p>
        </div>

        {currentUser && currentUser.role === "ADMIN" && (
          <button
            onClick={onOpenModeration}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Calendar className="w-4 h-4" />
            + Create Event / Campaign
          </button>
        )}
      </div>

      {dbCampaigns.length === 0 && dbEvents.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="mb-4">No active events or fundraising campaigns found in the database.</p>
          {currentUser && currentUser.role === "ADMIN" ? (
            <button
              onClick={onOpenModeration}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md"
            >
              + Add New Event from Admin Panel
            </button>
          ) : (
            <p className="text-xs text-slate-500">
              Logged-in Admins can publish events from the Moderation Panel.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dbEvents.map((ev) => (
            <div key={ev.id} className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl flex flex-col justify-between overflow-hidden min-w-0 break-words">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold shrink-0">
                    Upcoming Event
                  </span>
                  {currentUser?.role === "ADMIN" && (
                    <button
                      onClick={() => onDeleteEvent(ev.id)}
                      className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-400 hover:text-rose-200 hover:bg-rose-900/60 transition-all shrink-0"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-3 mb-2 break-words">{ev.title}</h3>
                <div
                  className="text-xs text-slate-300 mb-4 line-clamp-3 break-words"
                  dangerouslySetInnerHTML={{ __html: ev.description || "" }}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-4 mb-4 min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>{new Date(ev.startsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  {ev.location && (
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onOpenDetail(ev, "event")}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  See Details & Media
                </button>
              </div>
            </div>
          ))}

          {dbCampaigns.map((camp) => (
            <div key={camp.id} className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl flex flex-col justify-between overflow-hidden min-w-0 break-words">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-teal-950 text-teal-400 border border-teal-800 text-xs font-bold shrink-0">
                    Fundraising Campaign
                  </span>
                  {currentUser?.role === "ADMIN" && (
                    <button
                      onClick={() => onDeleteCampaign(camp.id)}
                      className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-400 hover:text-rose-200 hover:bg-rose-900/60 transition-all shrink-0"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-3 mb-2 break-words">{camp.title}</h3>
                <div
                  className="text-xs text-slate-300 mb-4 line-clamp-3 break-words"
                  dangerouslySetInnerHTML={{ __html: camp.description || "" }}
                />
              </div>

              <div>
                <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 mb-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full"
                    style={{
                      width: `${Math.min(100, ((camp.raisedAmount || 0) / (camp.goalAmount || 1)) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex flex-wrap justify-between gap-1 text-xs text-slate-400 font-semibold mb-4">
                  <span>Raised: ৳{camp.raisedAmount}</span>
                  <span>Target Goal: ৳{camp.goalAmount || "N/A"}</span>
                </div>

                <button
                  onClick={() => onOpenDetail(camp, "campaign")}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                  See Details & Media
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
