"use server";

import { headers } from "next/headers";
import { auth } from "@/utils/auth/server";
import { redirect } from "next/navigation";
import TopBar from "../reusable/TopBar";
import PerformancePanel from "./PerformancePanel";
import { CopyrightP } from "../reusable/Copyright";
export default async function Home() {
  const result = await auth.api.getSession({ headers: await headers() });

  if (result === null) redirect("/login");

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-10 gap-5">
      <TopBar currentPage="performance" />
      <PerformancePanel />
      <CopyrightP />
    </div>
  );
}
