import { authMiddleware } from "@/lib/auth";

export default authMiddleware;

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
