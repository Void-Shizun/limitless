import { headers } from "next/headers"
import HomePage from "./home"
import { auth } from "@/lib/auth"

export default async function () {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return(
        <HomePage session={session}/>
    )
}