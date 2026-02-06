import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { TopNavigation } from "~/components/TopNavigation";

export const metadata: Metadata = {
  title: "Hustle - SLA/SLO Tracker",
  description: "24/7 SLA/SLO tracking system",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-slate-950 text-white">
        <TRPCReactProvider>
          <TopNavigation />
          <main className="min-h-screen">{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
