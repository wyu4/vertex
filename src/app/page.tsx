"use server";

import { headers } from "next/headers";
import HomePanel from "./HomePanel";
import { auth } from "@/utils/auth/server";
import { redirect } from "next/navigation";
import TopBar from "./reusable/TopBar";

export default async function Home() {
  const result = await auth.api.getSession({ headers: await headers() });

  const loggedIn = result !== null;
  if (!loggedIn) redirect("/login");
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-10 gap-5">
      <TopBar />
      <HomePanel />
    </div>
  );
}
