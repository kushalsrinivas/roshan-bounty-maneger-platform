import { z } from "zod";

import {
  createTRPCRouter,

  publicProcedure,
} from "@/server/api/trpc";
import {  projects } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const project = createTRPCRouter({
  getAllProjects : publicProcedure.query(async ({ctx})=>{

    return await ctx.db.query.projects.findMany()
  }),
  getBountyById : publicProcedure.input(z.object({
    projectId : z.string()
  })).query(async ({input , ctx})=>{
    return await ctx.db.query.projects.findFirst({
      where : eq(projects.projectId , input.projectId)
    })
  }),
    createProject: publicProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        reward: z.string().min(1),
        deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        }), // Ensure deadline is a valid date string
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(projects).values({
        id: crypto.randomUUID(), // Auto-generate ID
        projectId: input.projectId,
        title: input.title,
        description: input.description,
        reward: input.reward,
        deadline: new Date(input.deadline), // Convert to Date object
        isCompleted: false, // Default to false
      });
  
      return { message: "Project created successfully!" };
    }),



});
