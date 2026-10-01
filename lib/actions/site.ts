'use server'

import { redirect } from 'next/navigation'
import prisma from '../db'
import { auth } from '../auth'
import { headers } from 'next/headers'

export const NovelInfo = async (title: string) => {
    const novel = await prisma.novel.findUnique({
        where: {title: title}
    })

    if(novel === null)
        console.log('No Novel With That Name Was Found')

    return novel
}

export const ChapterInfo = async (from: string, chapter: number) => {
    const chapterData = await prisma.chapter.findFirst({
        where: {from: from, chapter: chapter}
    })

    if(chapterData === null){
        console.log('That chapter could not be found')
        redirect('/')
    }

    return chapterData
}

export const NumChapters = async (from: string) => {
    const chapters = await prisma.chapter.count({
        where: {from: from}
    })

    if(chapters === null)
        return 0

    return chapters
}

export const signInSocial = async (provider: 'google') => {
    const {url} = await auth.api.signInSocial({
        body: {
            provider,
            callbackURL: '/'
        }
    })
    if(url){
        redirect(url)
    }
}

export const signOut = async () => {
    const result = await auth.api.signOut({ headers: await headers() })

    return result
}