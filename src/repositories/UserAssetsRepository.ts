import { Asset } from "./AssetsRepository"

export interface UserAsset extends Asset {
    amount: number

    metadata?: Record<string, any>
    createdAt: Date
    updatedAt: Date
}

export interface UserAssetsRepository {
    getUserAssets: () => Promise<UserAsset[]>
    getUserAsset: (assetId: string) => Promise<UserAsset>
    incrementUserAssetBalance: (assetId: string, amount: number) => Promise<UserAsset>
}