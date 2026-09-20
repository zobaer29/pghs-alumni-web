import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen flex flex-1 items-center justify-center bg-transparent px-6 text-white">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-400/30 bg-orange-400/10 shadow-[0_0_32px_rgba(249,115,22,0.18)]">
          <LoaderCircle className="h-8 w-8 animate-spin text-orange-400" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">Loading alumni network</p>
          <p className="mt-1 text-xs text-slate-400">Preparing your community space...</p>
        </div>
      </div>
    </main>
  );
}
