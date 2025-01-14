"use client";
import { api } from "@/trpc/react";
import React from "react";
import { BountyCard } from "../bounty-card";
import { Loader2 } from "lucide-react";

function BoutnyList() {
  const { data } = api.project.getAllProjects.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes

    refetchOnWindowFocus: false, // Prevent refetch on window focus
    enabled: true, // Ensure this is set to false if conditional fetching is required
  });
  if (!data)
    return (
      <div className="flex h-screen items-center justify-center gap-3 text-center text-3xl font-bold text-main">
        loading <Loader2 className="animate-spin"></Loader2>
      </div>
    );
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((bounty) => (
        <BountyCard key={bounty.id} {...bounty} isAdmin={false} />
      ))}
    </div>
  );
}

export default BoutnyList;
