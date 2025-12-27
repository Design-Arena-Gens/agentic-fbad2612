"use client";

import { format } from "date-fns";
import { Message } from "@/lib/types";

interface MessageThreadProps {
  messages: Message[];
}

export function MessageThread({ messages }: MessageThreadProps) {
  return (
    <div className="flex h-[420px] flex-col gap-3 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      {messages.length === 0 && (
        <p className="text-sm text-slate-500">No messages yet.</p>
      )}
      {messages.map((message) => {
        const isOutbound = message.direction === "outbound";
        return (
          <div key={message.id} className="flex flex-col gap-1">
            <div
              className={`max-w-xl rounded-2xl px-4 py-2 text-sm shadow ${
                isOutbound
                  ? "self-end bg-emerald-500/20 text-emerald-50"
                  : "self-start bg-slate-800/80 text-slate-100"
              }`}
            >
              <p>{message.body}</p>
            </div>
            <div className={`text-xs ${isOutbound ? "self-end" : "self-start"}`}>
              <span className="text-slate-500">
                {format(new Date(message.timestamp), "MMM d, yyyy HH:mm")}
              </span>
              <span className="ml-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-slate-400">
                {message.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
