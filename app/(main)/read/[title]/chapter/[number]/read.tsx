'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bookmark, ChevronLeft, ChevronRight, List, Settings2 } from 'lucide-react'
import { ChapterInfo, NumChapters } from '@/lib/actions/site'
import { useRouter } from 'next/navigation'

type Chapter = {
    chapter: number;
    author: string;
    id: string;
    title: string;
    from: string;
    story: string;
    duration: string;
}

interface PageProps {
  params: Promise<{
    title: string;
    number: string;
  }>;
}

export default function ReaderPage({ params } : PageProps) {
  const [chapter, setChapter] = useState(0)
  const [fontSize, setFontSize] = useState(18)
  const [saved, setSaved] = useState(false)
  const [chapterData, setChapterData] = useState<Chapter | null>(null)

  const { title, number } = use(params);
  const cleanTitle = decodeURIComponent(title)
  const chapterNo = parseFloat(number)

  const [numChapters, setNumChapters] = useState(0)

  const router = useRouter()

  useEffect(() => {
    const getData = async () => {
      const data = await ChapterInfo(cleanTitle, chapterNo)
      const num = await NumChapters(cleanTitle)
      setChapterData(data)
      setChapter(chapterNo)
      setNumChapters(num)
    }

    getData()
  }, [])

  return (
    <main className="min-h-screen bg-white text-[#e9e0d4]">
      <header className="top-0 z-20 border-b border-[#3b3329] bg-[#11100f]/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
         
          <Link href="/" className="flex items-center gap-2 text-sm text-[#bcb2a4]">
            <ArrowLeft size={16} /> Back to shelf
          </Link>

          <div className="flex items-center gap-2">
            
            <button onClick={() => setSaved(!saved)} className="rounded-full border border-[#3b3329] p-2 text-[#d5a85d]" aria-label="Bookmark story">    
              <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
            </button>
            
            {/* <button className="rounded-full border border-[#3b3329] p-2 text-[#bcb2a4]" aria-label="Reader settings">
              <Settings2 size={17} />
            </button> */}
            
          </div>
          
        </div>

      </header>

      <article className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <p className="text-center text-sm uppercase tracking-[.25em]" style={{fontWeight: 700, color: 'rgb(14, 126, 255)'}}>{chapterData?.from}</p>
        <h1 className="mt-5 text-center text-4xl font-semibold tracking-tight sm:text-5xl" style={{color: 'rgb(0, 0, 0)'}}>Chapter {chapterData?.chapter}: {chapterData?.title}</h1>
        <p className="mt-4 text-center text-sm text-[#8f877c]" style={{color: 'rgb(205, 0, 0)'}}>{chapterData?.author} · <span style={{color: 'rgb(72, 78, 255)'}}>{chapterData?.duration} read</span></p>
        
        <div className="mt-14 space-y-7 leading-8 text-[#c7bbad]" style={{ fontSize }}>
          <p className="whitespace-pre-line" style={{color: 'rgb(43, 42, 42)'}}>{chapterData?.story}</p>
        </div>
        
        <div className="mt-16 flex items-center justify-between border-t border-black pt-6">
          
          <button style={{fontWeight: 600}} disabled={chapter === 1} onClick={() => {router.push(`/read/${cleanTitle}/chapter/${chapterNo - 1}`)} } className="flex items-center gap-2 text-sm text-black disabled:opacity-30"><ChevronLeft size={16} /> Previous</button>
          <span className="text-sm text-black">{chapter} / {numChapters}</span>
          <button style={{color: 'rgb(255, 68, 0)', fontWeight: 600}} disabled={chapter === numChapters} onClick={() => {router.push(`/read/${cleanTitle}/chapter/${chapterNo + 1}`)}} className="flex items-center gap-2 text-sm disabled:opacity-30">Next <ChevronRight size={16} /></button>
        
        </div>
        
        <div className="mt-10 flex items-center justify-center gap-3 text-xs text-black">
          <span>Text size</span>
          <button onClick={() => setFontSize(Math.max(15, fontSize - 1))} className="rounded border border-[#3b3329] px-2">A−</button>
          <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} className="rounded border border-[#3b3329] px-2">A+</button>
          {/* <List size={15} className="ml-3" /> */}
        </div>
        
      </article>
      
    </main>
  )}
