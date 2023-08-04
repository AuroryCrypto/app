import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { userInfoSchema } from "@/shared/validators";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { z } from "zod";

export const authRouter = createTRPCRouter({
    getSession: authenticatedProcedure
        .query(({ ctx }) => {
            return {
                session: ctx.session
            }
        }),
    updateUserName: authenticatedProcedure
        .input(z.object({ name: z.string() }))
        .mutation( async ({ input, ctx }) => {
            if (!ctx.session) {
                throw new Error("No UID found in session");
            }
            await getAuth().updateUser(ctx.session.uid, { displayName: input.name })
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
