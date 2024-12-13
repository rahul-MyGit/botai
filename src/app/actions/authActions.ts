'use server'

import { signIn, signOut } from "@/lib/auth"

export async function googleSignInAction(){
    await signIn("google", {redirectTo: "/"});
}

export async function userSignOutAction(){
    await signOut({redirectTo: "/"});
}