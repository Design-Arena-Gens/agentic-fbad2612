import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Responsible WhatsApp Automation",
  description: "Automate WhatsApp messaging responsibly with policy-aware assistance."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-6 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
