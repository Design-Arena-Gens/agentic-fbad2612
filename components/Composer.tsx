"use client";

import { useState } from "react";
import { PolicyChecklist } from "@/lib/types";

interface ComposerProps {
  onSend: (payload: { body: string; checklist: PolicyChecklist }) => Promise<void>;
  onSchedule: (payload: {
    body: string;
    scheduleAt: string;
    checklist: PolicyChecklist;
  }) => Promise<void>;
}

const initialChecklist: PolicyChecklist = {
  consentObtained: true,
  messageType: "service",
  templateApproved: true
};

export function Composer({ onSend, onSchedule }: ComposerProps) {
  const [body, setBody] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const [checklist, setChecklist] = useState(initialChecklist);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!body.trim()) {
      setError("Message body is required");
      return;
    }
    setError(null);
    setIsSending(true);
    try {
      await onSend({ body: body.trim(), checklist });
      setBody("");
      setScheduleAt("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  const handleSchedule = async () => {
    if (!body.trim() || !scheduleAt) {
      setError("Message body and schedule time are required");
      return;
    }
    setError(null);
    setIsSending(true);
    try {
      await onSchedule({ body: body.trim(), scheduleAt, checklist });
      setBody("");
      setScheduleAt("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="text-sm font-semibold text-slate-200">Message Composer</h3>
      <textarea
        className="mt-3 w-full rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
        rows={5}
        placeholder="Draft a policy-compliant response..."
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={checklist.consentObtained}
            onChange={(event) =>
              setChecklist((prev) => ({ ...prev, consentObtained: event.target.checked }))
            }
            className="h-4 w-4 rounded border-slate-700 bg-slate-900"
          />
          Consent confirmed
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={checklist.templateApproved ?? false}
            onChange={(event) =>
              setChecklist((prev) => ({ ...prev, templateApproved: event.target.checked }))
            }
            className="h-4 w-4 rounded border-slate-700 bg-slate-900"
          />
          Template approved
        </label>
        <select
          value={checklist.messageType}
          onChange={(event) =>
            setChecklist((prev) => ({
              ...prev,
              messageType: event.target.value as PolicyChecklist["messageType"]
            }))
          }
          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100"
        >
          <option value="service">Service</option>
          <option value="utility">Utility</option>
          <option value="marketing">Marketing</option>
          <option value="authentication">Authentication</option>
        </select>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-xs text-slate-400">Schedule (ISO datetime)</label>
          <input
            type="datetime-local"
            value={scheduleAt}
            onChange={(event) => setScheduleAt(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-100"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Policy notes</label>
          <input
            type="text"
            placeholder="Document policy context..."
            value={checklist.fallbackCopy ?? ""}
            onChange={(event) =>
              setChecklist((prev) => ({ ...prev, fallbackCopy: event.target.value }))
            }
            className="mt-1 w-full rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-100"
          />
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-progress disabled:opacity-60"
        >
          Send now
        </button>
        <button
          type="button"
          onClick={handleSchedule}
          disabled={isSending}
          className="rounded-lg border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/10 disabled:cursor-progress disabled:opacity-60"
        >
          Schedule
        </button>
      </div>
    </div>
  );
}
