import { type UserTransaction, type UserTransactionsRepository } from "../UserTransactionsRepository";
import { getFirestore } from "firebase-admin/firestore";

export class UserTransactionsRepositoryFirestore implements UserTransactionsRepository {
    private db: FirebaseFirestore.Firestore = getFirestore()
    private collection: FirebaseFirestore.CollectionReference<UserTransaction>
    constructor(
        private userId: string
    ) {
        this.collection = this.db.collection(`users/${this.userId}/transactions`) as FirebaseFirestore.CollectionReference<UserTransaction>
    }
    async getUserTransactions(): Promise<UserTransaction[]> {
        const snapshot = await this.collection.get();
        return snapshot.docs.map((doc) => {
            return {
                ...doc.data(),
                id: doc.id,
            } as UserTransaction;
        });
    }
    async getUserTransaction(transactionId: string): Promise<UserTransaction> {
        const doc = await this.collection.doc(transactionId).get();
        return {
            ...doc.data(),
            id: doc.id,
        } as UserTransaction;
    }
    async createUserTransaction(transaction: UserTransaction): Promise<UserTransaction> {
        const doc = await this.collection.add(transaction);
        return {
            ...transaction,
            id: doc.id,
        } as UserTransaction;
    }
    async updateUserTransaction(transactionId: string, transaction: UserTransaction): Promise<UserTransaction> {
        await this.collection.doc(transactionId).set(transaction, { merge: true });
        return {
            ...transaction,
            id: transactionId,
        } as UserTransaction;
    }
    async deleteUserTransaction(transactionId: string): Promise<void> {
        await this.collection.doc(transactionId).delete();
    }
}