'use server'

import { signIn, signOut } from "@/lib/auth"

export async function googleSignInAction() {
    await signIn("google", { redirectTo: "/" });
    return;
}

export async function userSignOutAction() {
    await signOut({ redirectTo: "/"});
    return;
}
