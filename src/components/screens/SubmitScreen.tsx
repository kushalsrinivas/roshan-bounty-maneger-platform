"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";

export default function SubmitProject({ userId }: { userId: string }) {
  const { id } = useParams();
  const [demoLink, setDemoLink] = useState("");
  const [demoVideo, setDemoVideo] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const router = useRouter();
  const createSubmission = api.submission.createSubmission.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <Card className="mx-auto max-w-md rounded-lg border p-6">
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
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground w-full"
            >
              Submit Project
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
