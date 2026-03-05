import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "AutoML — AI Analytics Platform",
  description: "Upload a CSV, train AutoML models, and get AI-powered insights instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <AppProvider>
          <Sidebar />
          <div id="main-scroll" className="relative z-10 flex-1 flex flex-col overflow-y-auto">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
