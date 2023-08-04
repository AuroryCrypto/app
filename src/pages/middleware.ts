import { getAuth } from 'firebase-admin/auth'
import { NextResponse } from 'next/server'
import type { NextMiddleware, NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {
    // getAuth().verifyIdToken
}

export const config = {
    matcher: [
        '/account/(.*)',
    ]
}
