import { NextResponse } from "next/server";
import { cancelScheduledMessage } from "@/lib/scheduler";
import { listScheduledMessages } from "@/lib/store";

export async function GET() {
  const scheduled = listScheduledMessages();
  return NextResponse.json({ scheduled });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing schedule id" }, { status: 400 });
  }

  cancelScheduledMessage(id);
  return NextResponse.json({ id });
}
