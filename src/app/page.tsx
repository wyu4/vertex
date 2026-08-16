"use server";

import { cookies, headers } from "next/headers";
import HomePanel from "./HomePanel";
import { auth } from "@/utils/auth/server";
import { redirect } from "next/navigation";
import TopBar from "./reusable/TopBar";
import { parseStringifiedSession } from "@/utils/data/universal";
import { CACHE_KEY } from "@/utils/data/cache";
import { CopyrightP } from "./reusable/Copyright";
export default async function Home() {
  const result = await auth.api.getSession({ headers: await headers() });

  if (result === null) redirect("/login");

  const cachedData = (await cookies()).get(CACHE_KEY)?.value;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-10 gap-5">
      <TopBar currentPage="home" />
      <HomePanel
        cachedRecord={
          cachedData === undefined
            ? undefined
            : parseStringifiedSession(cachedData)
        }
      />
      <CopyrightP />
    </div>
  );
}
