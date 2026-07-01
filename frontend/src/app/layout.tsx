"use client";

import React from "react";
import "@/app/globals.css";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen font-sans bg-[#09090B] text-slate-100">
        {isLandingPage ? (
          // Standalone landing page view
          <div className="w-full min-h-screen flex flex-col">
            {children}
          </div>
        ) : (
          // Clinician workspace view with Sidebar navigation
          <div className="relative flex min-h-screen w-full">
            <Sidebar />
            <main className="flex-1 md:pl-64 min-h-screen flex flex-col transition-all duration-300">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
