"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { v4 as uuid } from "uuid";
import { redirect } from "next/navigation";

export default function AdminDashboard({ userId }: { userId: string }) {
  // State for each field
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const create = api.project.createProject.useMutation();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    create.mutate({
      projectId: uuid(),
      deadline: deadline,
      reward: reward,
      description: description,
      title: title,
    });
    setIsLoading(false);
  };
  const createAuditor = api.auditor.create.useMutation();
  const { data } = api.auditor.findAuditor.useQuery(
    { id: userId },
    {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes

      refetchOnWindowFocus: false, // Prevent refetch on window focus
      enabled: true, // Ensure this is set to false if conditional fetching is required
    },
  );

  if (!data) {
    return <div>Loading...</div>;
  }
  if (data.length === 0) {
    redirect("/");
  }
  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-4 text-2xl font-bold text-main">Create a New Bounty</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-main" htmlFor="title">
            Title
          </Label>
          <Input
            id="title"
            placeholder="Bounty title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="text-main" htmlFor="description">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Detailed description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="text-main" htmlFor="reward">
            Reward ($)
          </Label>
          <Input
            id="reward"
            type="number"
            placeholder="500"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="text-main" htmlFor="deadline">
            Deadline
          </Label>
          <Input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Bounty"}
        </Button>
      </form>
      <div>
        <Label className="text-main" htmlFor="deadline">
          add people
        </Label>
        <Input
          id="deadline"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button
        onClick={() => {
          createAuditor.mutate({
            email: email,
          });
        }}
      >
        add people
      </Button>
    </div>
  );
}
