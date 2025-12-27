# Responsible WhatsApp Automation Dashboard

Modern Next.js dashboard for responsibly automating WhatsApp business messaging workflows. The app centralizes conversation review, real-time responses, scheduling, and policy guardrails built around the WhatsApp Business Platform (Cloud API).

## Features

- Conversation inbox with policy insights, unread tracking, and consent state
- Message thread viewer to review inbound/outbound sessions
- Policy-aware composer with consent & template safeguards before sending
- Scheduling engine to queue compliant follow-ups (in-memory jobs for demo)
- Webhook endpoint stub to ingest inbound Cloud API updates

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Environment

Create an `.env.local` file:

```
WHATSAPP_TOKEN=your_graph_api_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFICATION_TOKEN=your_webhook_token
```

Without credentials the dashboard falls back to demo data; sending/scheduling still works locally for preview.

## Deployment

Build for production and deploy (example assumes Vercel):

```bash
npm run build
```

Add the environment variables in your hosting platform before deploying.

## Compliance Notes

- Maintain opt-in records and respect customer opt-outs
- Use approved templates for proactive outreach outside the 24-hour session window
- Provide a human escalation path for sensitive cases
- Follow [WhatsApp Business Policy](https://www.whatsapp.com/legal/business-policy/) and Meta commerce guidelines

## Tech Stack

- Next.js 14 (App Router)
- React 18 with Tailwind CSS
- Node-schedule for in-memory job orchestration
- TypeScript with strict settings
