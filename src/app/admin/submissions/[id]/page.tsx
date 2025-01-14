"use client";
import AdminSubmissions from "@/components/screens/AdminSubmissions";
import { useParams } from "next/navigation";
import React from "react";

function Page() {
  const { id } = useParams();
  return (
    <div>
      <AdminSubmissions id={id as string}></AdminSubmissions>
    </div>
  );
}

export default Page;
