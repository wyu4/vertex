import { auth } from "@/utils/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginPanel from "./LoginPanel";

export default async function Home() {
  const result = await auth.api.getSession({ headers: await headers() });

  const loggedIn = result !== null;

  if (loggedIn) redirect("/");

  return (
    <div className="relative min-w-full min-h-screen bg-bg-primary flex flex-col items-center justify-center p-10 gap-5">
      <LoginPanel />
    </div>
  );
}
