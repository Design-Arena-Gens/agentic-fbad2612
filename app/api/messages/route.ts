import { NextResponse } from "next/server";
import { listConversations, getConversationMessages, resetUnread } from "@/lib/store";
import { fetchRemoteConversations, fetchRemoteMessages } from "@/lib/whatsapp";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  if (conversationId) {
    const messages = await fetchRemoteMessages(conversationId);
    resetUnread(conversationId);
    return NextResponse.json({ messages });
  }

  const conversations = await fetchRemoteConversations();
  return NextResponse.json({ conversations });
}
