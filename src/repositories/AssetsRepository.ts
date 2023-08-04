export interface Asset {
    id?: string
    name: string
    symbol: string
    precision: number
    type: "crypto" | "fiat"
    usdPrice: number

    metadata?: Record<string, any>
    createdAt: Date
    updatedAt: Date
}

export interface AssetsRepository {
    getAssets: () => Promise<Asset[]>
    getAsset: (assetId: string) => Promise<Asset>
    createAsset: (asset: Asset) => Promise<Asset>
    updateAsset: (assetId: string, asset: Asset) => Promise<Asset>
    deleteAsset: (assetId: string) => Promise<{}>
}