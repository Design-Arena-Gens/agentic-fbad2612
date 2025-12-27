import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { sendWhatsAppTextMessage } from "@/lib/whatsapp";
import { scheduleMessage } from "@/lib/scheduler";
import { ScheduledMessage } from "@/lib/types";

interface SendRequest {
  to: string;
  conversationId: string;
  body: string;
  sendNow?: boolean;
  scheduleAt?: string;
  timeZone?: string;
  policyContext?: {
    hasConsent: boolean;
    templateApproved: boolean;
    notes?: string;
  };
}

export async function POST(request: Request) {
  const payload = (await request.json()) as SendRequest;

  if (!payload.to || !payload.body) {
    return NextResponse.json(
      { error: "Recipient and message body are required" },
      { status: 400 }
    );
  }

  if (payload.scheduleAt) {
    const scheduleDate = new Date(payload.scheduleAt);
    if (Number.isNaN(scheduleDate.getTime()) || scheduleDate.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "Scheduled time must be in the future" },
        { status: 400 }
      );
    }

    const scheduled: ScheduledMessage = {
      id: uuid(),
      to: payload.to,
      conversationId: payload.conversationId || payload.to,
      body: payload.body,
      scheduleAt: scheduleDate.toISOString(),
      timeZone: payload.timeZone ?? "UTC",
      status: "scheduled",
      createdAt: new Date().toISOString(),
      policyContext: {
        hasConsent: payload.policyContext?.hasConsent ?? false,
        templateApproved: payload.policyContext?.templateApproved ?? false,
        notes: payload.policyContext?.notes
      }
    };

    scheduleMessage({
      id: scheduled.id,
      scheduleAt: scheduleDate,
      message: scheduled
    });

    return NextResponse.json({ scheduled });
  }

  const result = await sendWhatsAppTextMessage({
    to: payload.to,
    body: payload.body,
    context: { conversationId: payload.conversationId }
  });

  return NextResponse.json({ messageId: result.id });
}
