"use client"

import { deleteCookie } from "@/lib/utils/utill_methods";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default async function Logout() {
    const router = useRouter();

    useLayoutEffect(() => {
        deleteCookie('auth_token');
        deleteCookie('role');
        localStorage.removeItem('auth');
        router.replace('/');
        router.refresh();
    }, [])

    return (
        <></>
    );
}
