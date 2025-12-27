"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Conversation, Message, PolicyChecklist, ScheduledMessage } from "@/lib/types";
import { ConversationList } from "@/components/ConversationList";
import { MessageThread } from "@/components/MessageThread";
import { Composer } from "@/components/Composer";
import { PolicyBanner } from "@/components/PolicyBanner";
import { SchedulePanel } from "@/components/SchedulePanel";

interface ConversationResponse {
  conversations: Conversation[];
}

interface MessagesResponse {
  messages: Message[];
}

interface ScheduledResponse {
  scheduled: ScheduledMessage[];
}

export default function HomePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledMessage[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId),
    [conversations, activeConversationId]
  );

  const loadConversations = useCallback(async () => {
    const response = await fetch("/api/messages", { cache: "no-store" });
    const data = (await response.json()) as ConversationResponse;
    setConversations(data.conversations);
    if (!activeConversationId && data.conversations.length > 0) {
      setActiveConversationId(data.conversations[0].id);
    }
  }, [activeConversationId]);

  const loadMessages = useCallback(async (conversationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (!response.ok) {
        throw new Error("Unable to load messages");
      }
      const data = (await response.json()) as MessagesResponse;
      setMessages(data.messages);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadScheduled = useCallback(async () => {
    const response = await fetch("/api/schedule", { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as ScheduledResponse;
    setScheduled(data.scheduled);
  }, []);

  useEffect(() => {
    loadConversations();
    loadScheduled();
    const interval = setInterval(() => {
      loadConversations();
      if (activeConversationId) {
        loadMessages(activeConversationId);
      }
      loadScheduled();
    }, 15_000);
    return () => clearInterval(interval);
  }, [activeConversationId, loadConversations, loadMessages, loadScheduled]);

  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
    }
  }, [activeConversationId, loadMessages]);

  const handleSend = async ({ body, checklist }: { body: string; checklist: PolicyChecklist }) => {
    if (!activeConversation) {
      throw new Error("Select a conversation first");
    }
    const response = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: activeConversation.phoneNumber,
        conversationId: activeConversation.id,
        body,
        sendNow: true,
        policyContext: {
          hasConsent: checklist.consentObtained,
          templateApproved: checklist.templateApproved,
          notes: checklist.fallbackCopy
        }
      })
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    await loadMessages(activeConversation.id);
    await loadConversations();
  };

  const handleSchedule = async ({
    body,
    scheduleAt,
    checklist
  }: {
    body: string;
    scheduleAt: string;
    checklist: PolicyChecklist;
  }) => {
    if (!activeConversation) {
      throw new Error("Select a conversation first");
    }
    const response = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: activeConversation.phoneNumber,
        conversationId: activeConversation.id,
        body,
        scheduleAt,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        policyContext: {
          hasConsent: checklist.consentObtained,
          templateApproved: checklist.templateApproved,
          notes: checklist.fallbackCopy
        }
      })
    });

    if (!response.ok) {
      throw new Error("Failed to schedule message");
    }

    await loadScheduled();
  };

  const handleCancelSchedule = async (id: string) => {
    const response = await fetch(`/api/schedule?id=${id}`, { method: "DELETE" });
    if (response.ok) {
      await loadScheduled();
    }
  };

  return (
    <main className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">
          Responsible WhatsApp Automation
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Manage conversations, draft compliant responses, and schedule outreach while honoring consent and policy checkpoints.
        </p>
      </header>

      <PolicyBanner />

      <div className="flex flex-col gap-4 md:flex-row">
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={setActiveConversationId}
        />
        <div className="flex flex-1 flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">
                  {activeConversation?.name || activeConversation?.phoneNumber || "Select a conversation"}
                </h2>
                {activeConversation && (
                  <p className="text-xs text-slate-400">
                    Consent status: {activeConversation.consentStatus}
                  </p>
                )}
              </div>
              {isLoading && <span className="text-xs text-slate-500">Refreshing…</span>}
            </div>
            <div className="mt-4">
              <MessageThread messages={messages} />
            </div>
            {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
          </div>

          <Composer onSend={handleSend} onSchedule={handleSchedule} />
        </div>
      </div>

      <SchedulePanel scheduled={scheduled} onCancel={handleCancelSchedule} />
    </main>
  );
}
