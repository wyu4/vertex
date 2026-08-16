"use server";

import { auth } from "@/utils/auth/server";
import { redirect } from "next/navigation";
import LoginPanel from "./LoginPanel";
import { headers } from "next/headers";

export default async function Home() {
  const result = await auth.api.getSession({ headers: await headers() });

  if (result !== null) redirect("/");

  return (
    <div className="relative min-w-full min-h-screen bg-bg-primary flex flex-col items-center justify-center p-10 gap-5">
      <LoginPanel />
    </div>
  );
}
