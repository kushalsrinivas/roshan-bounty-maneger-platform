import AdminBoutnyList from "@/components/screens/AdminBountyList";
import AdminDashboard from "@/components/screens/AdminScreen";

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
      <AdminDashboard userId={session.user.id}></AdminDashboard>
      <div className="conainter mx-auto flex-grow px-4 py-8">
        <h1 className="p-5 text-center text-3xl font-extrabold text-main">
          Your Bounties
        </h1>
        <AdminBoutnyList></AdminBoutnyList>
      </div>
    </div>
  );
}

export default page;
