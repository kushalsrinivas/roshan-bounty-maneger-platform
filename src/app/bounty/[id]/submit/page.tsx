import SubmitProject from "@/components/screens/SubmitScreen";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div>
      <SubmitProject userId={session.user.id} />
    </div>
  );
}

export default page;
