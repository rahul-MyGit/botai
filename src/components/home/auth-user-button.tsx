'use client'

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { googleSignInAction, userSignOutAction } from "@/app/actions/authActions";

export function UserAuthButton() {
    const { data: session } = useSession();

    console.log('after', session)

    if (session && session?.user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 bg-teal-500 hover:bg-teal-700">
                            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                            <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-teal-300" align="end">
                    <DropdownMenuItem className="flex flex-col items-start border-black border-b">
                        <div className="font-medium">{session.user.name}</div>
                        <div className="text-sm text-muted-foreground">{session.user.email}</div>
                    </DropdownMenuItem>
                            <DropdownMenuItem onClick={userSignOutAction} className="text-red-600 cursor-pointer">
                                Log out
                            </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
        );
    }

    return (
        <Button variant="ghost" className="relative h-10 w-10 rounded-full" onClick={() => googleSignInAction()}>
            <Avatar className="h-10 w-10">
                <AvatarImage>X</AvatarImage>
                <AvatarFallback className="bg-teal-400 hover:bg-teal-700">U</AvatarFallback>
            </Avatar>
        </Button>
    );
}