import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign } from "lucide-react";

interface BountyCardProps {
  id: string;
  title: string;
  description: string;
  reward: string;
  deadline: Date;
  projectId: string;
  isAdmin: boolean | null;
}

export function BountyCard({
  id,
  title,

  reward,
  deadline,
  projectId,
  isAdmin,
}: BountyCardProps) {
  return (
    <Card className="group border-zinc-800 bg-zinc-900/50 transition-colors hover:bg-zinc-900">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="flex items-center gap-1 text-emerald-500">
            <DollarSign className="h-4 w-4" />
            <span className="font-mono text-sm">{reward}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
          <Calendar className="h-4 w-4" />
          {deadline.toDateString()}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        {isAdmin ? (
          <Link className="w-full" href={`/admin/submissions/${projectId}`}>
            <Button className="w-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
              View submissions
            </Button>
          </Link>
        ) : (
          <Link className="w-full" href={`/bounty/${projectId}`}>
            <Button className="w-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
              View Bounty
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
