import { getFirestore } from "firebase-admin/firestore";
import { UserInfo, UserInfoRepository } from "../UserInfoRepository";

export class UserInfoRepositoryFirebase implements UserInfoRepository {
    private db: FirebaseFirestore.Firestore = getFirestore()
    private collection: FirebaseFirestore.CollectionReference<UserInfo>
    constructor(
        private userId: string
    ) {
        this.collection = this.db.collection(`users`) as FirebaseFirestore.CollectionReference<UserInfo>
    }
    async getUserInfo(): Promise<UserInfo> {
        const doc = await this.collection.doc(this.userId).get();
        return {
            ...doc.data(),
            id: doc.id,
        } as UserInfo;
    }
    async createUserInfo(userInfo: UserInfo): Promise<UserInfo> {
        const doc = await this.collection.add(userInfo);
        return {
            ...userInfo,
            id: doc.id,
        } as UserInfo;
    }
    async updateUserInfo(userInfo: UserInfo): Promise<UserInfo> {
        await this.collection.doc(this.userId).set(userInfo, { merge: true });
        return {
            ...userInfo,
            id: this.userId,
        } as UserInfo;
    }
    async deleteUserInfo(): Promise<{}> {
        await this.collection.doc(this.userId).delete();
        return await Promise.resolve("User info deleted");
    }

}