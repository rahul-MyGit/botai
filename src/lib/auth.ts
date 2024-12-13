import { prisma } from "@/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth"
import Google from "next-auth/providers/google";
import { NextResponse } from "next/server";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Google],
    pages: {
        signIn: '/signIn'
    },
    
    callbacks: {
        async session({session, token}) {
            if(session?.user) {
                session.user.id = token.sub || ''
            }
            return session
        },

        async jwt({token, user}){
            if(user){
                token.sub = user.id
            }
            return token
        }
    },
    session: {
        strategy: "jwt"
    }
});

declare module "next-auth" {
    interface Session {
        user: {
            id: string,
            name: string,
            email: string,
            image?: string
        }
    }
}

export const authMiddleware = auth((req) => {
    const isLoggedIn = !!req.auth;
    const isHomePage = req.nextUrl.pathname === '/';
    const isPublicFile = req.nextUrl.pathname.includes('.');

    if (isHomePage || isPublicFile) {
        return NextResponse.next();
    }

    if (!isLoggedIn) {
        const redirectUrl = new URL('/', req.nextUrl)
        redirectUrl.searchParams.set('auth', 'required')
        return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next();
});