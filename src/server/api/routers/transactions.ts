import { z } from "zod";
import { authenticatedProcedure, createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getFirestore, CollectionReference, FieldValue } from "firebase-admin/firestore";

export const transactionsRouter = createTRPCRouter({
    deposit: authenticatedProcedure
        .input(z.object({
            amount: z.number(),
            assetId: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                if (!ctx.session) {
                    throw new Error("No UID found in session");
                }
                // 0. get asset
                const asset = await ctx.assetsRepository.getAsset(input.assetId)

                // fix the number precision
                const amount = parseFloat(input.amount.toFixed(asset.precision))
    
                // 1. update user asset balance
                ctx.userAssetsRepository.incrementUserAssetBalance(input.assetId, amount)
    
                // 2. create transaction
                ctx.userTransactionsRepository.createUserTransaction({
                    amount: input.amount,
                    asset: await ctx.assetsRepository.getAsset(input.assetId),
                    type: "income",
                    operation: "deposit",
                    createdAt: new Date(),
                    metadata: {
                        source: "deposit"
                    }
                })
            } catch (error) {
                console.error(error)
            }
        }),
    withdraw: authenticatedProcedure
        .input(z.object({
            amount: z.number(),
            assetId: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                if (!ctx.session) {
                    throw new Error("No UID found in session");
                }
                // 0. check if user has enough balance
                const userAsset = await ctx.userAssetsRepository.getUserAsset(input.assetId)
                if (userAsset.amount < input.amount) {
                    throw new Error("Sem saldo suficiente")
                }

                // fix the number precision
                const amount = parseFloat(input.amount.toFixed(userAsset.precision))
    
                // 1. update user asset balance
                ctx.userAssetsRepository.incrementUserAssetBalance(input.assetId, -amount)
    
                // 2. create transaction
                ctx.userTransactionsRepository.createUserTransaction({
                    amount: input.amount,
                    asset: await ctx.assetsRepository.getAsset(input.assetId),
                    type: "outcome",
                    operation: "withdraw",
                    createdAt: new Date(),
                    metadata: {
                        source: "withdraw"
                    }
                })
            } catch (error) {
                console.error(error)
            }
        }),
});
