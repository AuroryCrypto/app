import { type Asset } from "./AssetsRepository"

type FirebaseDate = Date & {
    toDate?: () => Date
}

export interface UserTransaction {
    id?: string
    type: "income" | "outcome"
    operation: "deposit" | "withdraw" | "transfer"
    amount: number
    asset: Asset
    createdAt: FirebaseDate
    metadata?: Record<string, unknown>
}

export interface UserTransactionsRepository {
    getUserTransactions: () => Promise<UserTransaction[]>
    getUserTransaction: (transactionId: string) => Promise<UserTransaction>
    createUserTransaction: (transaction: UserTransaction) => Promise<UserTransaction>
    updateUserTransaction: (transactionId: string, transaction: UserTransaction) => Promise<UserTransaction>
    deleteUserTransaction: (transactionId: string) => Promise<void>
}