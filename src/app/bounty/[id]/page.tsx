import BountyDetail from "@/components/screens/BountyDetail";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function BountyPage() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return <BountyDetail userId={session.user.id}></BountyDetail>;
}
