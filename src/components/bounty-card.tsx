import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Card key={id}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-primary text-2xl font-bold">
            {title}
          </CardTitle>
          <span className="text-secondary bg-secondary/10 min-w-20 rounded-md px-2 py-1 text-lg font-bold">
            $ {reward}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* <p className="text-muted-foreground mb-4">{description}</p> */}

        <div className="flex w-full items-center justify-between">
          <span className="text-primary text-sm">
            {new Date(deadline).toLocaleString()}
          </span>
          {isAdmin ? (
            <Link href={`/admin/submissions/${projectId}`}>
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">
                View submissions
              </Button>
            </Link>
          ) : (
            <Link href={`/bounty/${projectId}`}>
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">
                View Bounty
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
      <div className="from-primary to-secondary absolute left-0 top-0 h-1 w-full bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100"></div>
    </Card>
  );
}
