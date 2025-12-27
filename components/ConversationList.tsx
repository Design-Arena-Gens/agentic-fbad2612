"use client";

import { formatDistanceToNow } from "date-fns";
import { Conversation } from "@/lib/types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (conversationId: string) => void;
}

export function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  return (
    <aside className="flex w-full flex-col gap-2 md:w-80">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Conversations
        </h2>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {conversations.map((conversation) => {
          const isActive = activeId === conversation.id;
          return (
            <button
              type="button"
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                isActive
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100">
                  {conversation.name || conversation.phoneNumber}
                </span>
                <span className="text-xs text-slate-500">
                  {formatDistanceToNow(new Date(conversation.lastUpdated), {
                    addSuffix: true
                  })}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-slate-300">
                {conversation.lastMessage || "No messages yet"}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                  {conversation.consentStatus.replace("_", " ")}
                </span>
                {conversation.unreadCount > 0 && (
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-200">
                    {conversation.unreadCount} unread
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
