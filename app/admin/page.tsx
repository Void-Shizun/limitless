import { auth } from '@/lib/auth'
import AdminPage from './admin'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function () {
    const session = await auth.api.getSession({
            headers: await headers()
        })

    if(session?.user.email === 'malcomprime10@gmail.com' || session?.user.email === 'tefocalleb19@gmail.com')
        return (
            <AdminPage session={session}/>
        )
    else{
        redirect('/')
    }    
}