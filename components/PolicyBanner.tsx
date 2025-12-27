"use client";

const checkpoints = [
  {
    title: "Consent",
    description: "Only message contacts who have explicitly opted in and always honor opt-outs.",
    link: "https://www.whatsapp.com/legal/business-policy/"
  },
  {
    title: "Template Usage",
    description: "Use approved templates for marketing or re-engagement messages outside the 24-hour session window.",
    link: "https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates"
  },
  {
    title: "Data Minimization",
    description: "Avoid storing or exposing personal data longer than necessary and protect PII at rest and in transit.",
    link: "https://www.whatsapp.com/legal/business-policy/"
  },
  {
    title: "Automation Guardrails",
    description: "Provide human hand-off, respect rate limits, and monitor for policy violations.",
    link: "https://developers.facebook.com/docs/whatsapp"
  }
];

export function PolicyBanner() {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow">
      <h2 className="text-lg font-semibold text-slate-200">Policy Guardrails</h2>
      <p className="mt-1 text-sm text-slate-400">
        Automations must comply with WhatsApp Business and Commerce policies. Review the checkpoints before sending.
      </p>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {checkpoints.map((item) => (
          <a
            key={item.title}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border border-slate-800 bg-slate-900/60 p-3 transition hover:border-emerald-500/60 hover:bg-slate-900"
          >
            <p className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300">
              {item.title}
            </p>
            <p className="mt-1 text-xs text-slate-400 group-hover:text-slate-200">
              {item.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
