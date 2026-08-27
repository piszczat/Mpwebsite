import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarcinP.com — D365 F&O Developer",
  description:
    "Marcin Piszczat — Microsoft Dynamics 365 Finance & Operations development, integrations and evidence-first diagnostics.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
