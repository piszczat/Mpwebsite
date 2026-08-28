import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarcinP.com — D365 F&O Developer",
  description:
    "Marcin Piszczat — Microsoft Dynamics 365 Finance & Operations development, integrations and evidence-first diagnostics.",
  keywords: [
    "Dynamics 365 Finance and Operations",
    "D365 F&O developer",
    "X++",
    "Power Automate",
    "API integrations",
    "Azure DevOps",
  ],
  openGraph: {
    title: "MarcinP.com — D365 F&O Developer",
    description:
      "X++, integrations, posting flows and evidence-first D365 F&O diagnostics.",
    type: "website",
  },
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
      <body>
        {children}
        <script src="/analytics-loader.js" defer />
      </body>
    </html>
  );
}
