import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { UserAsset, UserAssetsRepository } from "../UserAssetsRepository";
import { AssetsRepository } from "../AssetsRepository";

export class UserAssetsRepositoryFirebase implements UserAssetsRepository {
    private db: FirebaseFirestore.Firestore;
    private collection: FirebaseFirestore.CollectionReference<UserAsset>
    constructor(
        private assetsRepository: AssetsRepository,
        private userId: string
    ) {
        this.db = getFirestore()
        this.collection = this.db.collection(`users/${this.userId}/assets`) as FirebaseFirestore.CollectionReference<UserAsset>
    }
    async getUserAssets(): Promise<UserAsset[]> {
        const snapshot = await this.collection.get();
        return snapshot.docs.map((doc) => {
            return {
                ...doc.data(),
                id: doc.id,
            } as UserAsset;
        });
    }
    async getUserAsset(assetId: string): Promise<UserAsset> {
        const doc = await this.collection.doc(assetId).get();
        return {
            ...doc.data(),
            id: doc.id,
        } as UserAsset;
    }
    async incrementUserAssetBalance(assetId: string, amount: number): Promise<UserAsset> {
        const asset = await this.assetsRepository.getAsset(assetId)
        await this.collection.doc(assetId).set({
            ...asset,
            amount: FieldValue.increment(amount),
            updatedAt: new Date(),
        }, { merge: true });
        return {
            ...asset,
            id: assetId,
            amount: amount,
            updatedAt: new Date(),
        } as UserAsset;
    }
}