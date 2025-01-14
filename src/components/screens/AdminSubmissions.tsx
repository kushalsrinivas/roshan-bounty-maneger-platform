"use client";
import { api } from "@/trpc/react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { Github, Youtube, Link2, Crown, Mail } from "lucide-react";
function AdminSubmissions({ id }: { id: string }) {
  const { data: submissions } = api.submission.getAllSubmissions.useQuery({
    projectId: id,
  });
  const shortList = api.submission.shortList.useMutation();
  const decideWinner = api.submission.decideWinner.useMutation();
  return (
    <div className="grid grid-cols-3 gap-10 p-6">
      <Card className="mx-auto mt-5 w-full rounded-lg p-6">
        <CardTitle className="text-primary mb-4 text-3xl font-bold">
          Submissions
        </CardTitle>
        <div>
          {submissions && submissions.length > 0 ? (
            submissions.map((submission, index) => (
              <Card key={submission.submission.id} className="mb-4">
                <CardHeader>
                  <CardTitle>
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
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row justify-between">
                  <div>
                    <Link href={submission.submission.githubRepo ?? ""}>
                      <Button
                        disabled={
                          submission.submission.githubRepo ? false : true
                        }
                      >
                        <Github></Github>
                      </Button>
                    </Link>
                    <Link href={submission.submission.demoVideo ?? ""}>
                      <Button
                        disabled={
                          submission.submission.demoVideo ? false : true
                        }
                      >
                        <Youtube></Youtube>
                      </Button>
                    </Link>
                    <Link href={submission.submission.demoLink ?? ""}>
                      <Button
                        disabled={submission.submission.demoLink ? false : true}
                      >
                        <Link2></Link2>
                      </Button>
                    </Link>
                  </div>
                  <Button
                    onClick={() => {
                      shortList.mutate({
                        projectId: submission.submission.projectId,
                        userId: submission.user?.id ?? "",
                      });
                    }}
                  >
                    Short List
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No Submissions yet</div>
          )}
        </div>
      </Card>
      <Card className="mx-auto mt-5 w-full rounded-lg p-6">
        <CardTitle className="text-primary mb-4 text-3xl font-bold">
          Short Listed
        </CardTitle>
        <div>
          {submissions && submissions.length > 0 ? (
            submissions.map((submission, index) => (
              <div key={submission.submission.id}>
                {submission.submission.isShortListed && (
                  <Card className="mb-4">
                    <CardHeader>
                      <CardTitle>
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
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-row justify-between">
                      <div>
                        <Link href={submission.submission.githubRepo ?? ""}>
                          <Button
                            disabled={
                              submission.submission.githubRepo ? false : true
                            }
                          >
                            <Github></Github>
                          </Button>
                        </Link>
                        <Link href={submission.submission.demoVideo ?? ""}>
                          <Button
                            disabled={
                              submission.submission.demoVideo ? false : true
                            }
                          >
                            <Youtube></Youtube>
                          </Button>
                        </Link>
                        <Link href={submission.submission.demoLink ?? ""}>
                          <Button
                            disabled={
                              submission.submission.demoLink ? false : true
                            }
                          >
                            <Link2></Link2>
                          </Button>
                        </Link>
                      </div>
                      <Button
                        onClick={() => {
                          decideWinner.mutate({
                            projectId: submission.submission.projectId,
                            userId: submission.user?.id ?? "",
                          });
                        }}
                      >
                        <Crown></Crown>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))
          ) : (
            <div>No Submissions yet</div>
          )}
        </div>
      </Card>
      <Card className="mx-auto mt-5 w-full rounded-lg p-6">
        <CardTitle className="text-primary mb-4 text-3xl font-bold">
          Winner
        </CardTitle>
        <div>
          {submissions && submissions.length > 0 ? (
            submissions.map((submission, index) => (
              <div key={submission.submission.id}>
                {submission.submission.isShortListed &&
                  submission.submission.isWinner && (
                    <Card key={submission.submission.id} className="mb-4">
                      <CardHeader>
                        <CardTitle>
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
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-row justify-between">
                        <div>
                          <Link href={submission.submission.githubRepo ?? ""}>
                            <Button
                              disabled={
                                submission.submission.githubRepo ? false : true
                              }
                            >
                              <Github></Github>
                            </Button>
                          </Link>
                          <Link href={submission.submission.demoVideo ?? ""}>
                            <Button
                              disabled={
                                submission.submission.demoVideo ? false : true
                              }
                            >
                              <Youtube></Youtube>
                            </Button>
                          </Link>
                          <Link href={submission.submission.demoLink ?? ""}>
                            <Button
                              disabled={
                                submission.submission.demoLink ? false : true
                              }
                            >
                              <Link2></Link2>
                            </Button>
                          </Link>
                        </div>
                        <Button>
                          <Link href={`mailto:${submission.user?.email}`}>
                            <Mail></Mail>
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
              </div>
            ))
          ) : (
            <div>No submissions yet</div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default AdminSubmissions;
