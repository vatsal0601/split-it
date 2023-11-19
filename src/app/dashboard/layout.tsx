import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Dashboard - SplitIt",
  description: "Dashboard for SplitIt",
};

export default function DashboardLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="container h-full">{children}</main>
      {modal}
    </>
  );
}
