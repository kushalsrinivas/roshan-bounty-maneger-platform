import AdminSubmissions from "@/components/screens/AdminSubmissions";
import React from "react";

function page({ params }: { params: { id: string } }) {
  return (
    <div>
      <AdminSubmissions id={params.id}></AdminSubmissions>
    </div>
  );
}

export default page;
