export interface UserInfo {
    id?: string
    name: string
    email: string
    birthDate: Date
    document: string
    status: "active" | "inactive"
    address: {
        street: string
        number: string
        city: string
        state: string
        zip: string
    }
    phone: string

    metadata?: Record<string, any>
    createdAt: Date
    updatedAt: Date
}

export interface UserInfoRepository {
    getUserInfo: () => Promise<UserInfo>
    createUserInfo: (userInfo: UserInfo) => Promise<UserInfo>
    updateUserInfo: (userInfo: UserInfo) => Promise<UserInfo>
    deleteUserInfo: () => Promise<{}>
}
