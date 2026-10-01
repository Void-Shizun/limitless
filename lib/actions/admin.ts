'use server'

import prisma from '../db'

import { NumChapters } from './site'

export const CreateNovel = async (title: string, author: string, genre: string, status: string, chapters: number, rating: number, cover: string, blurb: string) => {
    try{
        const newNovel = await prisma.novel.create({
            data:{
                title,
                author,
                genre,
                status,
                chapters,
                rating,
                cover,
                blurb
            }
        })

    }
    catch (e) {
        console.log('Error adding new novel: ', e)
    }
} 

export const getAllNovels = async () => {
    const novels = await prisma.novel.findMany()

    return novels
}

export const editNovelInfo = async (title: string,author: string, genre: string, status: string, blurb: string, cover: string ) => {

    try{
        const novel = await prisma.novel.update({
            where: {title: title},
            data: {
                author,
                genre,
                status,
                cover,
                blurb,
            }
        })
    }
    catch(e){
        console.log('Error Editing Chapter Info', e)
    }
}

export const recommendNovel = async (title: string) => {
    const check = await prisma.recommended.findUnique({
        where: {count: 1}
    })

    if(check !== null){
        const upd = await prisma.recommended.update({
            where: {count: 1},
            data:{
                title
            }
        })
    }
    else{
        const cre = await prisma.recommended.create({
            data:{
                count: 1,
                title
            }
        })
    }
}

export const getRecommendation = async () => {
    const check = await prisma.recommended.findFirst({
        where: {count: 1}
    })

    const novelTitle = check ? check.title : 'Soul Land'

    return novelTitle
}

export const AddChapter = async (from: string, author: string, chapter: number, title: string, story: string, duration: string) => {
   
    try {
        const novelFound = await prisma.novel.findUnique({
            where: {title: from}
        })

        if(novelFound === null){
            console.log('Error adding new chapter, no novel with that name was found')
            return {success: false, msg: 'Novel With That Name Does Not Exist'}
        }

        const chapterData = await prisma.chapter.findFirst({
            where: {from: from, chapter: chapter}
        })
    
        if(chapterData !== null){
            console.log(`Chapter ${chapter} of ${from} Already Exists`)
            return {success: false, msg: 'That Chapter Already Exists'}
        }    

        const newChapter = await prisma.chapter.create({
            data:{
                from,
                author,
                chapter,
                title,
                story,
                duration
            }
        })

        let chapters = await NumChapters(from)

        const update = await prisma.novel.update({
            where: {title: from},
            data: {
                chapters
            }
        })

        return {success: true, msg: 'A new chapter has been added'}
    }

    catch(e){
        console.log('Error adding new chapter', e)
    }

}

