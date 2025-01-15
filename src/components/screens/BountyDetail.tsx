"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow, isPast } from "date-fns";
import {
  Calendar,
  DollarSign,
  Loader2,
  Send,
  Trophy,
  Users,
} from "lucide-react";
import Head from "next/head";
import { useParams } from "next/navigation";
import { Badge } from "../ui/badge";
function BountyDetail({ userId }: { userId: string }) {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState("");
  const [isDeadlinePassed, setIsDeadlinePassed] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false); // Track if the user has already submitted

  const { data: bounty } = api.project.getBountyById.useQuery(
    {
      projectId: id as string,
    },
    {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes

      refetchOnWindowFocus: false, // Prevent refetch on window focus
      enabled: true, // Ensure this is set to false if conditional fetching is required
    },
  );
  const { data: submissions } = api.submission.getAllSubmissions.useQuery(
    {
      projectId: id as string,
    },
    {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes

      refetchOnWindowFocus: false, // Prevent refetch on window focus
      enabled: true, // Ensure this is set to false if conditional fetching is required
    },
  );
  // Calculate the relative time and check if the deadline has passed
  useEffect(() => {
    if (bounty) {
      const calculateTimeLeft = () => {
        // Ensure deadline is a valid Date object
        const deadlineDate = new Date(bounty.deadline);

        if (isNaN(deadlineDate.getTime())) {
          console.error("Invalid deadline date");
          return;
        }

        // Convert to UTC to ensure consistent time calculations
        const utcDeadline = new Date(
          deadlineDate.getUTCFullYear(),
          deadlineDate.getUTCMonth(),
          deadlineDate.getUTCDate(),
          deadlineDate.getUTCHours(),
          deadlineDate.getUTCMinutes(),
          deadlineDate.getUTCSeconds(),
        );

        setIsDeadlinePassed(isPast(utcDeadline));
        setTimeLeft(formatDistanceToNow(utcDeadline, { addSuffix: true }));
      };

      calculateTimeLeft();

      // Update the timer every minute
      const timerInterval = setInterval(calculateTimeLeft, 60 * 1000);

      return () => clearInterval(timerInterval); // Clean up interval on unmount
    }
  }, [bounty]);
  useEffect(() => {
    if (submissions && userId) {
      const hasAlreadySubmitted = submissions.some(
        (submission) => submission.user?.id === userId,
      );
      setHasSubmitted(hasAlreadySubmitted);
    }
  }, [submissions, userId]);
  if (!bounty)
    return (
      <div className="flex h-screen items-center justify-center gap-3 text-center text-3xl font-bold text-main">
        loading <Loader2 className="animate-spin"></Loader2>
      </div>
    );
  return (
    
    <main className="container mx-auto grid gap-6 px-4 py-12 lg:grid-cols-[1fr_400px]">
      <Head>
        <title>
          {bounty.title} | {"$" + bounty.reward}
        </title>
        <meta name="description" content={bounty.description} />
        <meta name="keywords" content="bounty, project, submissions, rewards" />
        <meta property="og:title" content={bounty.title} />
        <meta property="og:description" content={bounty.description} />
        <meta property="og:rewards" content={"$" + bounty.reward} />

        <meta property="og:type" content="website" />
      </Head>
      <div className="space-y-6">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {" "}
                  {bounty.title}
                </h1>{" "}
                <p
                  className="mt-2 text-zinc-400"
                  dangerouslySetInnerHTML={{
                    __html: bounty.description.replace(/\n/g, "<br>"),
                  }}
                ></p>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                <span className="f font-mono text-xl text-emerald-500">
                  {bounty.reward}
                </span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Calendar className="h-4 w-4" />
                Deadline: {new Date(bounty.deadline).toDateString()}
              </div>
              <Badge variant="default" className="bg-red-500/10 text-red-500">
                {isDeadlinePassed
                  ? "Deadline Passed"
                  : `Time Left: ${timeLeft}`}
              </Badge>
            </div>

            <Button
              className="mt-6 w-full bg-emerald-500/10 text-emerald-500"
              variant="default"
              disabled={isDeadlinePassed || hasSubmitted}
            >
              {" "}
              <Link
                className="flex flex-row items-center gap-1"
                href={`/bounty/${bounty.projectId}/submit`}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Project
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Winner
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissions && submissions.length > 0 ? (
              <div className="flex flex-col gap-4">
                {submissions.map((submission, index) => {
                  return (
                    <div key={submission.submission.id}>
                      {submission.submission.isShortListed &&
                        submission.submission.isWinner && (
                          <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                            {index + 1}
                            <Avatar>
                              <AvatarImage src={submission.user?.image ?? ""} />
                              <AvatarFallback>
                                {submission.user?.name?.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-white">
                                {submission.user?.name}
                              </p>
                              <p className="text-sm text-zinc-400">Winner</p>
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-main">No Submissions yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-emerald-500" />
              Short Listed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {submissions && submissions.length > 0 ? (
              <div className="flex flex-col gap-4">
                {submissions.map((submission, index) => {
                  return (
                    <div key={submission.submission.id}>
                      {submission.submission.isShortListed && (
                        <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                          {index + 1}
                          <Avatar>
                            <AvatarImage src={submission.user?.image ?? ""} />
                            <AvatarFallback>
                              {submission.user?.name?.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">
                              {submission.user?.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-main">No Submissions yet</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Send className="h-5 w-5 text-blue-500" />
              Submissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {submissions && submissions.length > 0 ? (
              <div className="flex flex-col gap-4">
                {submissions.map((submission, index) => {
                  return (
                    <div key={submission.submission.id}>
                      {
                        <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                          {index + 1}
                          <Avatar>
                            <AvatarImage src={submission.user?.image ?? ""} />
                            <AvatarFallback>
                              {submission.user?.name?.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">
                              {submission.user?.name}
                            </p>
                          </div>
                        </div>
                      }
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-main">No Submissions yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default BountyDetail;
