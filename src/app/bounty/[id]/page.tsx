import BountyDetail from "@/components/screens/BountyDetail";

export default function BountyPage({ params }: { params: { id: string } }) {
  return <BountyDetail id={params.id}></BountyDetail>;
}
