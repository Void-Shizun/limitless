'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Bookmark, BookOpen, ChevronRight, Clock3, Flame, Menu, Search, Sparkles, Star, X } from 'lucide-react'
import { NovelInfo, signInSocial, signOut } from '@/lib/actions/site'
import { BorderBeam } from '@/components/ui/border-beam'
import { getRecommendation } from '@/lib/actions/admin'
import { google } from 'better-auth'
import { auth } from '@/lib/auth'

type Novel = { id: string; title: string; author: string; genre: string; status: string; chapters: number; rating: number; cover: string; blurb: string }

const novels: Novel[] = [
  {id: '1', title: 'The Archivist of Ash', author: 'Mira Vey', genre: 'Fantasy', status: 'Serializing', chapters: 42, rating: 4.9, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80', blurb: 'A disgraced archivist discovers that every burned book still remembers its final reader.' },
  {id: '2', title: 'Neon Pilgrim', author: 'K. Osei', genre: 'Sci-fi', status: 'Serializing', chapters: 28, rating: 4.8, cover: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80', blurb: 'On a city-sized orbital, one courier carries a map to a planet that no longer exists.' },
  {id: '3', title: 'The Last Bellflower', author: 'Juniper Vale', genre: 'Romance', status: 'Complete', chapters: 67, rating: 4.7, cover: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80', blurb: 'Two botanists meet at the edge of winter and grow something neither planned to keep.' },
  {id: '4', title: 'Saltwater Saints', author: 'R. Calder', genre: 'Mystery', status: 'Serializing', chapters: 19, rating: 4.6, cover: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80', blurb: 'A tidepool diver hears a choir beneath the harbor and starts finding names in the foam.' },
  {id: '5', title: 'Saltwater Saints', author: 'R. Calder', genre: 'Mystery', status: 'Serializing', chapters: 19, rating: 4.6, cover: 'https://aniloot.kesug.com/wp-content/uploads/woocommerce-placeholder-300x300.png', blurb: 'A tidepool diver hears a choir beneath the harbor and starts finding names in the foam.' },

]

const updates = novels.map((novel, index) => ({ ...novel, chapter: novel.chapters + 1, ago: `${index + 1}h ago` }))

export interface Novels {
    id: string;
    title: string;
    author: string;
    genre: string;
    status: string;
    chapters: number;
    rating: number;
    cover: string;
    blurb: string;
}

function Cover({ novel, className = '' }: { novel: Novel; className?: string }) {
  return <div className={`overflow-hidden rounded-xl bg-[#25201b] ${className}`}><img src={novel.cover} alt={`${novel.title} cover`} className="h-full w-full object-cover transition duration-500 hover:scale-105" /></div>
}

type Session = typeof auth.$Infer.Session

export default function HomePage({session} : {session : Session | null}) {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('All')
  const [selected, setSelected] = useState<Novels | null>(null)
  const [recommended, setRecommended] = useState<Novels | null>(null)

  const [bookmarked, setBookmarked] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const genres = ['All', 'Fantasy', 'Mystery']
  const filtered = useMemo(() => novels.filter((novel) => (genre === 'All' || novel.genre === genre) && `${novel.title} ${novel.author}`.toLowerCase().includes(query.toLowerCase())), [genre, query])

  const handleSignInSocial = async (provider: 'google') => {
    try{
      await signInSocial(provider)
    }
    catch(e){
      console.log('Error Signing In With Social Provider', e)
      console.log('Failed to continue with social provider, please try again.')
    }
  }  

  useEffect(() => {
    const getData = async () => {
      const recommendedTitle = await getRecommendation()
      const novelInfo = await NovelInfo(recommendedTitle)
      setRecommended(novelInfo)
    }

    getData()
  }, [])

  return <main className="min-h-screen bg-white text-[#f4efe7] selection:bg-[#d5a85d] selection:text-[#11100f] pb-20">
    <header className="sticky top-0 z-40 border-b border-[#3b3329] bg-[#11100f]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 lg:px-8">
        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">    
          <span className="grid size-8 place-items-center rounded-lg bg-[rgb(4,138,255)] text-[#11100f]">
            <Sparkles size={16} color={'rgb(0, 0, 0)'} />
          </span>       
          <span className='text-[rgb(255,54,54)]'>limit<span style={{fontSize: 20, fontWeight: 600}} className="text-[rgb(59,75,250)] text-lg font-medium">less</span></span>        
        </Link>
        <nav className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col border-b border-[#3b3329] bg-[#171513] px-5 py-4 lg:static lg:flex lg:flex-row lg:border-0 lg:bg-transparent lg:p-0`}>
          {(session?.user.email === 'malcomprime10@gmail.com' || session?.user.email === 'tefocalleb19@gmail.com') &&
            <Link href="/admin" className="px-3 py-2 text-sm text-[rgb(255,4,4)] hover:text-[#f4efe7] w-[70px]">Studio</Link>
          }
          {!session ? <button onClick={() => handleSignInSocial('google')} className="md:hidden rounded-full w-[68px] px-3 py-2 text-sm font-medium text-[rgb(0,123,255)] sm:block hover:text-white">Sign in</button>
                   : <button onClick={() => signOut()} className="md:hidden rounded-full w-[78px] px-3 py-2 text-sm text-[rgb(255,54,54)] sm:block hover:text-white">Sign out</button>}

        </nav>
        <div className="ml-auto flex items-center gap-3">
          {!session ? <button onClick={() => handleSignInSocial('google')} className="hidden rounded-full bg-[rgb(0,123,255)] px-4 py-2 text-sm font-medium text-white sm:block">Sign in</button>
                  : <button onClick={() => signOut()} className="hidden rounded-full bg-[rgb(255,4,4)] px-4 py-2 text-sm font-medium text-white sm:block">Sign Out</button>
          }
        </div>
      </div>
    </header>

    <section className="mx-auto max-w-7xl px-5 pb-14 pt-12 lg:px-8 lg:pt-20" id="discover">

      <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_.8fr]">

        <div>
          
          <p className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-black">
            <Flame size={14} color='red'/> Stories worth staying up for
          </p>

          <h1 className="max-w-2xl text-5xl font-semibold leading-[.98] tracking-[-.05em] text-balance sm:text-7xl t text-black">Find your 
            
            <span className="text-[#d5a85d]" style={{color: 'rgb(255, 54, 54)'}}> <span style={{color: 'rgb(30, 154, 255)'}}>next</span>favorite</span> world.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7" style={{color: 'rgb(37, 36, 36)'}}>Independent fiction, beautifully told. Discover series from emerging voices and settle into a story with somewhere to go.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">{genres.map((item) => <button key={item} onClick={() => setGenre(item)} className={`rounded-full border px-4 py-2 text-sm transition ${genre === item ? 'border-black bg-yellow text-black' : 'border-[#3b3329] text-black hover:border-[#8b6d3c]'}`}>{item}</button>)}
          </div>

        </div>
        
        <div className="hidden justify-end lg:flex">

          <div className="max-w-xs border-l border-[#3b3329] pl-6">
          </div>

        </div>
        
        </div>

    </section>

    <section className="mx-auto max-w-7xl px-5 lg:px-8">
      
      <div className="grid overflow-hidden rounded-2xl border border-black bg-white lg:grid-cols-[.8fr_1.2fr]">
        
        <Cover novel={recommended?.cover ? recommended : novels[4]} className="h-72 rounded-none lg:h-[420px]" />
        
        <div className="flex flex-col justify-between p-7 lg:p-12">
          
          <div>
            
            <div className="flex items-center gap-3 text-xs uppercase tracking-[.2em] text-[#d5a85d]">
              <span  style={{color: 'rgb(255, 174, 0)', fontWeight: 700}}>Editor&apos;s pick</span>
              
              <span className="size-1 rounded-full bg-black" />
              
              <span  style={{color: 'rgb(236, 0, 0)', fontWeight: 500}}>{recommended ? recommended.genre : ''}</span>
            
            </div>
            
            <h2 className="mt-5 max-w-lg text-4xl font-semibold tracking-[-.04em] sm:text-5xl text-black">{recommended ? recommended.title : ''}</h2>
            
            <p className="mt-4 max-w-lg leading-7" style={{color: 'rgb(58, 58, 58)'}}>{recommended ? recommended.blurb : ''}</p>
            
          </div>
          
          <div className="mt-10 flex flex-wrap items-center gap-3">
            
            <button onClick={() => setSelected(recommended)} style={{backgroundColor: 'rgb(0, 136, 255)'}} className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-[#11100f]">Start reading              
              <ChevronRight size={16} />
            </button>
            
            <button onClick={() => setBookmarked((items) => items.includes(novels[0].title) ? items.filter((item) => item !== novels[0].title) : [...items, novels[0].title])} className="rounded-full border border-[#4a3c2e] p-3 text-[#d5a85d]" aria-label="Bookmark featured novel">
              <Bookmark size={18} fill={bookmarked.includes(novels[0].title) ? 'black' : 'none'} color='black'/>
            </button>
            
            <span className="text-sm text-black" style={{fontWeight: 600}}>{recommended?.chapters} chapters · {recommended?.status}</span>

          </div>

        </div>

      </div>

    </section>

    {selected && 
      <div className="fixed inset-0 z-50 grid place-items-center bg-[#11100f]/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true">
        
        <div className="overflow-hidden rounded-2xl border border-[#4a3c2e] bg-white shadow-2xl" style={{maxWidth: '700px', maxHeight: '60%'}}>
          
          <div className="flex items-center justify-between border-b border-[#3b3329] p-5">

            <span className="text-xs uppercase tracking-[.2em] text-black">Story preview</span>
            
            <button onClick={() => setSelected(null)} aria-label="Close preview"><X size={20} color='black'/></button>
          
          </div>
          {
            //grid gap-6 p-6 sm:grid-cols-[160px_1fr]
          }
          <div className="p-6 bg-white" style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '5%', width: '100%'}}>           
                     
            <div>

              <div style={{display:'flex', flexDirection: 'row', gap: '6%'}}>

                <div style={{width: '42%'}}>
                  <Cover novel={selected.cover ? selected : novels[4]}/>
                </div>

                <div>
                  
                  <h2 className="text-3xl font-semibold tracking-tight" style={{color: 'rgb(54, 178, 255)'}}>{selected.title}</h2>

                  <p className="mt-2 text-sm" style={{color: 'rgb(0, 0, 0)'}}>{selected.genre} · {selected.status}</p>
                  
                  <p className="mt-2 text-sm text-[#8f877c]">by {selected.author}</p>

                </div> 

              </div>
              
              <p className="mt-5 leading-7 text-[#bcb2a4]" style={{color: 'rgb(73, 73, 73)'}}>{selected.blurb}</p>
              
              <div className="mt-5 flex gap-3">
                
                <Link style={{backgroundColor: 'rgb(255, 54, 54)'}} href={`/read/${selected.title}/chapter/${1}`} className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-[#11100f]">
                  <BookOpen size={16} /> Read chapter one
                </Link>
             
              </div>

            </div>

          </div>

        </div>

      </div>}
  
  </main>
}