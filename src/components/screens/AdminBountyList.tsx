"use client";
import { api } from "@/trpc/react";
import React from "react";
import { BountyCard } from "../bounty-card";

function AdminBoutnyList() {
  const { data } = api.project.getAllProjects.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes

    refetchOnWindowFocus: false, // Prevent refetch on window focus
    enabled: true, // Ensure this is set to false if conditional fetching is required
  });
  if (!data) return <div>loading</div>;
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((bounty) => (
        <BountyCard key={bounty.id} {...bounty} isAdmin={true} />
      ))}
    </div>
  );
}

export default AdminBoutnyList;
