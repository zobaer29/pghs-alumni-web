import { ArrowRight, Calendar, ExternalLink, MapPin, Trash2 } from "lucide-react";

interface EventListSectionProps {
  title: string;
  subtitle: string;
  events: any[];
  campaigns: any[];
  currentUser: any;
  onOpenDetail: (item: any, type: "event" | "campaign") => void;
  onDeleteEvent: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
  onViewAll: () => void;
}

export function EventListSection({
  title,
  subtitle,
  events,
  campaigns,
  currentUser,
  onOpenDetail,
  onDeleteEvent,
  onDeleteCampaign,
  onViewAll,
}: EventListSectionProps) {
  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white">{title}</h2>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
        >
          View All Events <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {events.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center text-slate-400 text-sm">
          No upcoming events in the database. New events added by Admins will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-white mb-2">{ev.title}</h3>
                  {currentUser?.role === "ADMIN" && (
                    <button
                      onClick={() => onDeleteEvent(ev.id)}
                      className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-400 hover:text-rose-200 hover:bg-rose-900/60 transition-all"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div
                  className="text-xs text-slate-300 mb-4 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: ev.description || "" }}
                />
              </div>

              <div>
                <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>{new Date(ev.startsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  {ev.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>{ev.location}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onOpenDetail(ev, "event")}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  See Details & Media
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {campaigns.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Fundraising Campaigns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((camp) => (
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
        </div>
      )}
    </section>
  );
}
