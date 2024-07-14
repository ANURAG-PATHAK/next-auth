import authConfig from "./auth.config"
import NextAuth from "next-auth"
import {
    DEFAULT_LOGIN_REDIRECT,
    apiRoutesPrefix,
    authRoutes,
    publicRoutes,
} from "@/routes"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = req.url.startsWith(apiRoutesPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    if (isApiAuthRoute) {
        return;
    }
    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return;
    }
    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/login", nextUrl));
    }
    return;
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
