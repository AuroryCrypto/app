'use client'

import { env } from "@/env.mjs";
import { type Asset } from "@/repositories/AssetsRepository";
import { type UserAsset } from "@/repositories/UserAssetsRepository";
import { type UserTransaction } from "@/repositories/UserTransactionsRepository";
import { setFirebaseIdToken } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { getApp, getApps, initializeApp, type FirebaseError } from "firebase/app";
import { GoogleAuthProvider, OAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword as signInWithEmailAndPasswordFB, signInWithPopup, type User } from "firebase/auth";
import { collection, getFirestore, limit, onSnapshot, orderBy, query, type QueryConstraint } from "firebase/firestore";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

const app = getApps().length ? getApp() : initializeApp({
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

const auth = getAuth(app);
const authProviders = {
    google: new GoogleAuthProvider(),
    microsoft: new OAuthProvider('microsoft.com'),
    apple: new OAuthProvider('apple.com'),
}
type AuthProvider = keyof typeof authProviders;

const signInWithProvider = async (provider: AuthProvider) => signInWithPopup(auth, authProviders[provider])
const signInWithEmailAndPassword = async (email: string, password: string) => signInWithEmailAndPasswordFB(auth, email, password)

const signUpWithEmailAndPassword = async (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password)

function useUser() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

    return user;
}

export const FirebaseContext = createContext<{
    user: User | null;
    auth: typeof auth;
    // logout: () => void;
    // updateUser: () => void;
}>({
    user: null,
    auth,
    // logout: () => { },
    // updateUser: () => { },
})

export const useFirebaseContext = () => useContext(FirebaseContext);

function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    console.log({user});

    useEffect(() => {
        setUser(getAuth(app).currentUser);
        const unsubscribe = getAuth().onAuthStateChanged((user) => {
            console.log("onAuthStateChanged", user);
            setUser(user)
        });
        return () => unsubscribe();
    }, []);

    return {
        auth,
        // user,
        // updateUser: () => getAuth().updateCurrentUser(getAuth().),
        logout: () => {
            getAuth().signOut().then(() => {
                setUser(null);
                router.push('/').catch((error) => {
                    console.error(error);
                })
            }).catch((error) => {
                console.error(error);
            })
        },
    };
}

function useLoginObserver() {
    useEffect(() => {
        const unsubscribe = auth.onIdTokenChanged(user => {
            console.log('user', user);
            user?.getIdToken().then(idToken => {
                setFirebaseIdToken(idToken);
            }).catch((error: FirebaseError) => {
                console.error(error);
            })
        });
        return () => unsubscribe();
    }, []);
}

export const FirebaseQueryContext = createContext<{
    refetchAll: () => void;
    refetchList: Array<() => void>;
    addRefetch: (refetch: () => void) => void;
    removeRefetch: (refetch: () => void) => void;
}>({
    refetchAll: () => {
        throw new Error("refetchAll not implemented");
    },
    refetchList: [],
    addRefetch: () => {
        throw new Error("addRefetch not implemented");
    },
    removeRefetch: () => {
        throw new Error("removeRefetch not implemented");
    },
})

export const useFirebaseQueryContext = () => useContext(FirebaseQueryContext);

export function FirebaseQueryProvider({children}: { children: React.ReactNode }) {
    const [refetchList, setRefetchList] = useState<Array<() => void>>([]);
    const addRefetch = (refetch: () => void) => setRefetchList((prev) => [...prev, refetch]);
    const removeRefetch = (refetch: () => void) => setRefetchList((prev) => prev.filter((r) => r !== refetch));
    const refetchAll = () => refetchList.forEach((refetch) => refetch());

    return (
        <FirebaseQueryContext.Provider value={{ refetchAll, refetchList, addRefetch, removeRefetch }}>
            {children}
        </FirebaseQueryContext.Provider>
    )
}

function useFirebaseQuery<T>(path: string, ...options: QueryConstraint[]) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { user } = useFirebaseContext();
    const [shallRefetch, setShallRefetch] = useState(false);
    const { addRefetch, removeRefetch } = useFirebaseQueryContext();
    const refetch = () => {
        setLoading(true);
        setError(null);
        setShallRefetch((prev) => !prev);
    };

    useEffect(() => {
        addRefetch(refetch);
        return () => removeRefetch(refetch);
    }, [])

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(getFirestore(), path), ...options), (querySnapshot) => {
            console.log('[useFirebaseQuery][', path, '] ', querySnapshot.size, ' documents', querySnapshot.docs);
            const documents: T[] = [];
            querySnapshot.forEach((doc) => {
                documents.push({
                    id: doc.id,
                    ...doc.data(),
                } as T);
            });
            setData(documents as T);
            setLoading(false);
        }, (error) => {
            console.error('useFirebaseQuery error', error);
            setError(error);
            setLoading(false);
        });
        
        return () => unsubscribe();
    }, [user, shallRefetch]);

    return {
        data,
        loading,
        error,
        refetch,
    };
}

export function useTransactions() {
    const { user } = useFirebaseContext()
    // if (typeof window === 'undefined' || !user) {
    //     return {
    //         data: [],
    //         loading: false,
    //         error: null,
    //     }
    // }
    console.log('[useTransactions] uid', user?.uid);
    return useFirebaseQuery<UserTransaction[]>(`users/${user?.uid}/transactions`, orderBy('createdAt', 'desc'), limit(10))
}

export function useBalance() {
    const { user } = useFirebaseContext()
    // if (typeof window === 'undefined' || !user) {
    //     return {
    //         data: [],
    //         loading: false,
    //         error: null,
    //     }
    // }
    console.log('[useBalance] uid', user?.uid);

    return useFirebaseQuery<UserAsset[]>(`users/${user?.uid}/assets`, orderBy('symbol', 'desc'))
}

export function useInvalidateBalanceRelatedQueries() {
    const c = useQueryClient()
    return () => Promise.allSettled([c.invalidateQueries(['balance']), c.invalidateQueries(['transactions'])])
}

export function useAssets() {
    return useFirebaseQuery<Asset[]>('assets', orderBy('symbol', 'desc'))
}

export {
    app,
    auth,
    authProviders, signInWithEmailAndPassword, signInWithProvider, signUpWithEmailAndPassword, useAuth,
    useLoginObserver, useUser
};
