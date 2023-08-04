import { getFirestore } from "firebase-admin/firestore";
import { type Asset, type AssetsRepository } from "../AssetsRepository";

export class AssetsRepositoryFirebase implements AssetsRepository {
    private db: FirebaseFirestore.Firestore = getFirestore()
    private collection: FirebaseFirestore.CollectionReference<Asset> = this.db.collection("assets") as FirebaseFirestore.CollectionReference<Asset>

    async getAssets(): Promise<Asset[]> {
        const snapshot = await this.collection.get();
        return snapshot.docs.map((doc) => {
            return {
                ...doc.data(),
                id: doc.id,
            } as Asset;
        });
    }
    async getAsset(assetId: string): Promise<Asset> {
        const doc = await this.collection.doc(assetId).get();
        return {
            ...doc.data(),
            id: doc.id,
        } as Asset;
    }
    async createAsset(asset: Asset): Promise<Asset> {
        const doc = await this.collection.add(asset);
        return {
            ...asset,
            id: doc.id,
        } as Asset;
    }
    async updateAsset(assetId: string, asset: Asset): Promise<Asset> {
        await this.collection.doc(assetId).set(asset, { merge: true });
        return {
            ...asset,
            id: assetId,
        } as Asset;
    }
    async deleteAsset(assetId: string): Promise<void> {
        await this.collection.doc(assetId).delete();
    }
}