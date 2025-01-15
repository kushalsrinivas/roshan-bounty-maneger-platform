"use client";
import React, { useEffect, useState } from "react";
import { Card, CardTitle } from "../ui/card";
import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  formatDistance,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  isPast,
} from "date-fns";
import { Loader2 } from "lucide-react";
import Head from "next/head";
import { useParams } from "next/navigation";
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
    <div className="flex flex-col items-start md:flex-row lg:flex-row">
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
      <div className="flex w-full flex-col md:min-h-screen lg:min-h-screen">
        <main className="container mx-auto flex-grow px-4 py-8">
          <Card className="relative mx-auto max-w-2xl rounded-lg p-6">
            {/* Timer on the top-left */}

            {/* Bounty Details */}
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="text-primary mb-4 text-3xl font-bold">
                {bounty.title}
              </CardTitle>
              <CardTitle className="">
                {isDeadlinePassed
                  ? "Deadline Passed"
                  : `Time Left: ${timeLeft}`}
              </CardTitle>
            </div>
            <p
              className="text-muted-foreground mb-6"
              dangerouslySetInnerHTML={{
                __html: bounty.description.replace(/\n/g, "<br>"),
              }}
            ></p>
            <div className="mb-6 flex justify-between">
              <span className="font-bold">${bounty.reward}</span>
              <span className="text-primary">
                Deadline: {new Date(bounty.deadline).toDateString()}
              </span>
            </div>

            {/* Submit Button */}
            <Button
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground w-full"
              disabled={isDeadlinePassed || hasSubmitted} // Disable button if deadline passed or user already submitted
            >
              <Link href={`/bounty/${bounty.projectId}/submit`}>
                Submit Project
              </Link>
            </Button>
          </Card>

          {/* Submissions Section */}
          <Card className="mx-auto mt-5 max-w-2xl rounded-lg p-6">
            <CardTitle className="text-primary mb-4 text-3xl font-bold">
              Submissions
            </CardTitle>
            <div>
              {submissions && submissions.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {submissions.map((submission, index) => (
                    <div
                      className="flex flex-row items-center gap-5"
                      key={submission.submission.id}
                    >
                      {index + 1}{" "}
                      <Avatar>
                        <AvatarImage
                          src={submission.user?.image ?? ""}
                        ></AvatarImage>
                        <AvatarFallback>
                          {submission.user?.name?.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {submission.user?.name}
                    </div>
                  ))}
                </div>
              ) : (
                <div>No Submissions yet</div>
              )}
            </div>
          </Card>
        </main>
      </div>
      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto mt-5 max-w-2xl rounded-lg p-6">
          <CardTitle className="text-primary mb-4 text-3xl font-bold">
            Winner
          </CardTitle>
          <div>
            {submissions && submissions.length > 0 ? (
              <div className="flex flex-col gap-4">
                {submissions.map((submission, index) => {
                  return (
                    <div key={submission.submission.id}>
                      {submission.submission.isShortListed &&
                        submission.submission.isWinner && (
                          <div className="flex flex-row items-center gap-5">
                            {index + 1}{" "}
                            <Avatar>
                              <AvatarImage
                                src={submission.user?.image ?? ""}
                              ></AvatarImage>
                              <AvatarFallback>
                                {submission.user?.name?.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            {submission.user?.name}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>No Submissions yet</div>
            )}
          </div>
        </Card>
        {/* Submissions Section */}
        <Card className="mx-auto mt-5 max-w-2xl rounded-lg p-6">
          <CardTitle className="text-primary mb-4 text-3xl font-bold">
            Short Listed
          </CardTitle>
          <div>
            {submissions && submissions.length > 0 ? (
              <div className="flex flex-col gap-4">
                {submissions.map((submission, index) => {
                  return (
                    <div key={submission.submission.id}>
                      {submission.submission.isShortListed && (
                        <div className="flex flex-row items-center gap-5">
                          {index + 1}{" "}
                          <Avatar>
                            <AvatarImage
                              src={submission.user?.image ?? ""}
                            ></AvatarImage>
                            <AvatarFallback>
                              {submission.user?.name?.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          {submission.user?.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>No Submissions yet</div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}

export default BountyDetail;
