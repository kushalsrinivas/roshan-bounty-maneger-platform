import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {  projects, submissions, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
export interface Submission {
  id: string; // Unique identifier for the submission
  userId: string; // Foreign key referencing the users table
  projectId: string; // Foreign key referencing the projects table
  demoLink?: string; // Optional link to the demo application
  demoVideo?: string; // Optional link to the demo video
  githubRepo?: string; // Optional link to the GitHub repository
  isShortListed: boolean; // Indicates whether the submission is shortlisted
}
export const submissionRouter = createTRPCRouter({
    getAllSubmissions: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          submission: submissions,
          user: users, // Include user details
        })
        .from(submissions)
        .leftJoin(users, eq(submissions.userId, users.id)) // Join users table
        .where(eq(submissions.projectId, input.projectId)); // Filter by projectId
    }),

  createSubmission: publicProcedure
  .input(
    z.object({
      userId: z.string().min(1), // The user making the submission
      projectId: z.string().min(1), // The project ID
      demoLink: z.string().url().optional(), // Link to the demo
      demoVideo: z.string().url().optional(), // Link to the demo video
      githubRepo: z.string().url().optional(), // Link to the GitHub repository
    })
  )
  .mutation(async ({ input, ctx }) => {
    // Insert a new submission into the database
    await ctx.db.insert(submissions).values({
      id: crypto.randomUUID(), // Generate a unique ID
      userId: input.userId,
      projectId: input.projectId,
      demoLink: input.demoLink ?? "",
      demoVideo: input.demoVideo ?? "",
      githubRepo: input.githubRepo ?? "",
      isShortListed : false
    });

    return { message: "Submission created successfully!" };
  }),
  shortList:publicProcedure
  .input(
    z.object({
      userId: z.string(), // User ID to be shortlisted
      projectId: z.string(), // Project ID associated with the user
    })
  )
  .mutation(async ({ ctx, input }) => {
    // Update the isShortlisted column to true for the matching userId and projectId
    const updated = await ctx.db
      .update(submissions)
      .set({
        isShortListed: true, // Update isShortlisted to true
      })
      .where(
        eq(submissions.userId, input.userId) && eq(submissions.projectId, input.projectId)
      )
      

    // Check if any rows were updated
   

    return {
      message: "User successfully shortlisted!",
      updated : updated
    };
  }),
  decideWinner:publicProcedure
  .input(
    z.object({
      userId: z.string(), // User ID to be shortlisted
      projectId: z.string(), // Project ID associated with the user
    })
  )
  .mutation(async ({ ctx, input }) => {
    // Update the isShortlisted column to true for the matching userId and projectId
    const updated = await ctx.db
      .update(submissions)
      .set({
        isWinner: true, // Update isShortlisted to true
      })
      .where(
        eq(submissions.userId, input.userId) && eq(submissions.projectId, input.projectId)
      )
      

    // Check if any rows were updated
   

    return {
      message: "User successfully shortlisted!",
      updated : updated
    };
  }),


});
