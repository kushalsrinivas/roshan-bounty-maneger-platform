import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

import BoutnyList from "@/components/screens/BoutnyList";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
          Available Bounties
        </h1>
        <BoutnyList></BoutnyList>
      </main>
    </div>
  );
}
