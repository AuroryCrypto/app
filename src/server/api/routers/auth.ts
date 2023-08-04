import { z } from "zod";
import { authenticatedProcedure, createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { userInfoSchema } from "@/shared/validators";

export const authRouter = createTRPCRouter({
    getSession: authenticatedProcedure
        .query(({ ctx }) => {
            return {
                session: ctx.session
            }
        }),
    updateUserName: authenticatedProcedure
        .input(z.object({ name: z.string() }))
        .mutation(({ input, ctx }) => {
            if (!ctx.session) {
                throw new Error("No UID found in session");
            }
            getAuth().updateUser(ctx.session.uid, { displayName: input.name })
        }),
    saveUserInfo: authenticatedProcedure
        .input(userInfoSchema)
        .mutation(({ input, ctx }) => {
            if (!ctx.session) {
                throw new Error("No UID found in session");
            }
            const uid = ctx.session.uid
            const db = getFirestore()
            return db.collection(`users/${uid}`).doc("personal").set({
                ...input,
                updatedAt: new Date(),
                createdAt: new Date(),
                status: "active"
            })
        }),
});
