"use client";
import BountyDetail from "@/components/screens/BountyDetail";
import { useParams } from "next/navigation";

export default function BountyPage() {
  const { id } = useParams();
  return <BountyDetail id={id as string}></BountyDetail>;
}
