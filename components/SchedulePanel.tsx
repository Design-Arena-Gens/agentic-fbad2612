"use client";

import { format } from "date-fns";
import { ScheduledMessage } from "@/lib/types";

interface SchedulePanelProps {
  scheduled: ScheduledMessage[];
  onCancel: (id: string) => Promise<void>;
}

export function SchedulePanel({ scheduled, onCancel }: SchedulePanelProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Scheduled sends</h3>
        <span className="text-xs text-slate-500">{scheduled.length} queued</span>
      </div>
      <div className="mt-3 space-y-3">
        {scheduled.length === 0 && (
          <p className="text-sm text-slate-500">No scheduled messages.</p>
        )}
        {scheduled.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-sm text-slate-100">{item.body}</p>
              <p className="text-xs text-slate-500">
                {format(new Date(item.scheduleAt), "MMM d, yyyy HH:mm")} · {item.timeZone}
              </p>
              <p className="text-xs text-emerald-300">
                Consent: {item.policyContext.hasConsent ? "Yes" : "No"} · Template approved: {item.policyContext.templateApproved ? "Yes" : "No"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onCancel(item.id)}
              className="self-start rounded-lg border border-rose-500 px-3 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
