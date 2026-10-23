import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendNest — Revenue Intelligence Inbox",
  description: "Sales interaction intelligence, operational governance, and decision workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light h-full antialiased" style={{ colorScheme: 'light' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Google+Sans+Text:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#f8fafc] text-slate-900" style={{ colorScheme: 'light' }}>{children}</body>
    </html>
  );
}
