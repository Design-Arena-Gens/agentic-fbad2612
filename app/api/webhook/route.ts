import { NextResponse } from "next/server";
import { ingestInboundMessage } from "@/lib/whatsapp";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFICATION_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const payload = await request.json();

  const entries = payload.entry ?? [];
  for (const entry of entries) {
    const changes = entry.changes ?? [];
    for (const change of changes) {
      const messages = change.value?.messages ?? [];
      for (const message of messages) {
        if (message.type === "text" && message.from && message.text?.body) {
          ingestInboundMessage({
            conversationId: message.from,
            from: message.from,
            body: message.text.body,
            messageId: message.id
          });
        }
      }
    }
  }

  return NextResponse.json({ status: "received" });
}
