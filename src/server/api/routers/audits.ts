import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,

} from "@/server/api/trpc";
import { cretfiedAuditors , users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const auditRouter = createTRPCRouter({

  create: protectedProcedure
    .input(z.object({ email: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {

        const user = await ctx.db.query.users.findFirst({
            where : eq(users.email, input.email)
        })
        if(user){

            await ctx.db.insert(cretfiedAuditors).values(user);
        }
        
    }),

  getAllAuditors: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.query.cretfiedAuditors.findMany();

    return users ?? [];
  }),
  findAuditor : protectedProcedure.input(z.object({id : z.string().min(1)})).query(async ({ctx, input}) => {
    const user =  await ctx.db.query.cretfiedAuditors.findFirst({where : eq(users.id, input.id)}) ;
    if(user){
        return user;
    }
    return [];

  })


});
