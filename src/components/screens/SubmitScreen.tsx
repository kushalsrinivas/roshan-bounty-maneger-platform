"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect, useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";

export default function SubmitProject({ userId }: { userId: string }) {
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false); // Track if the user has already submitted

  const { id } = useParams();
  const [demoLink, setDemoLink] = useState("");
  const [demoVideo, setDemoVideo] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const createSubmission = api.submission.createSubmission.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Here you would typically send the data to your backend
    createSubmission.mutate({
      projectId: id as string,
      userId: userId,
      demoLink: demoLink,
      demoVideo: demoVideo,
      githubRepo: githubRepo,
    });
    // Redirect to a thank you page or back to the bounty page
    router.push(`/bounty/${id as string}`);
  };
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
  useEffect(() => {
    if (submissions && userId) {
      const hasAlreadySubmitted = submissions.some(
        (submission) => submission.user?.id === userId,
      );
      setHasSubmitted(hasAlreadySubmitted);
    }
  }, [submissions, userId]);
  if (hasSubmitted) {
    redirect(`/bounty/${id as string}`);
  }
  if (!submissions) {
    return (
      <div className="flex h-screen items-center justify-center gap-3 text-center text-3xl font-bold text-main">
        loading <Loader2 className="animate-spin"></Loader2>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <Card className="mx-auto max-w-md rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-white transition-colors hover:bg-zinc-900">
          <h1 className="text-primary mb-6 text-2xl font-bold">
            Submit Your Project
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="demoLink">Demo Link</Label>
              <Input
                id="demoLink"
                type="url"
                value={demoLink}
                onChange={(e) => setDemoLink(e.target.value)}
                required
                className="bg-muted text-black"
              />
            </div>
            <div>
              <Label htmlFor="demoVideo">Demo Video URL</Label>
              <Input
                id="demoVideo"
                type="url"
                value={demoVideo}
                onChange={(e) => setDemoVideo(e.target.value)}
                required
                className="bg-muted text-black"
              />
            </div>
            <div>
              <Label htmlFor="githubRepo">GitHub Repository</Label>
              <Input
                id="githubRepo"
                type="url"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                required
                className="bg-muted text-black"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
              disabled={isLoading}
            >
              Submit Project
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
