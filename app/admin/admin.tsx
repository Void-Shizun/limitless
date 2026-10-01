'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BarChart3, BookOpen, Check, FilePlus2, LayoutDashboard, Menu, PenLine, Upload, X } from 'lucide-react'
import { AddChapter, CreateNovel, editNovelInfo, getAllNovels, recommendNovel } from '@/lib/actions/admin'
import { NovelInfo } from '@/lib/actions/site'
import {useDropzone} from 'react-dropzone'
import { useUploadThing } from '@/lib/uploadthing'
import Image from 'next/image'
import { auth } from '@/lib/auth'

const stories = ['The Archivist of Ash', 'Neon Pilgrim', 'The Last Bellflower', 'Saltwater Saints']

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

function Cover({ novel, className = '' }: { novel: Novels; className?: string }) {
  return <div className={`overflow-hidden rounded-xl bg-[#25201b] ${className}`}><img src={novel.cover} alt={`${novel.title} cover`} className="h-full w-full object-cover transition duration-500 hover:scale-105" /></div>
}

type Session = typeof auth.$Infer.Session

export default function AdminPage({session} : {session : Session | null}) {
  
  const [section, setSection] = useState('Publish chapter')
  const [published, setPublished] = useState(false)
  const [added, setAdded] = useState(false)
  
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [status, setStatus] = useState('')
  const [cover, setCover] = useState('')
  const [blurb, setBlurb] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const [from, setFrom] = useState('')
  const [writer, setWriter] = useState('')
  const [chapter, setChapter] = useState(1)
  const [heading, setHeading] = useState('')
  const [duration, setDuration] = useState('')
  const [story, setStory] = useState('')

  const [novels, setNovels] = useState<Novels []>([])

  const [selected, setSelected] = useState<Novels | null>(null)
  const [editNovel, setEditNovel] = useState('')

  const [editAuthor, setEditAuthor] = useState('')
  const [editGenre, setEditGenre] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editCover, setEditCover] = useState('')
  const [editBlurb, setEditBlurb] = useState('')

  const[file, setFile] = useState<File | null>(null)
  const[isLoading, setIsLoading] = useState(false)

  const[preview, setPreview] = useState<string | null>(null)
  const[progress, setProgress] = useState(0)
  
  const nav = [/*{ name: 'Overview', icon: LayoutDashboard },*/ { name: 'Create novel', icon: FilePlus2 }, { name: 'Publish chapter', icon: PenLine }, { name: 'Manage stories', icon: BookOpen }]
  
  const addNovel = async () => {
    try{
      const novel = await CreateNovel(title, author, genre, status, 0, 5, '', blurb)
      setPublished(true)
    }
    catch(e){
      console.log('Error publishing new novel: ', e)
      setPublished(false)
    }
  }

  const createChapter = async () => {
    const newChapter = await AddChapter(from, writer, chapter, heading, story, duration)

    if(newChapter?.success === true){
      setAdded(true)
    }
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: {"image/*": []},
    maxFiles: 1,
    onDrop : (files) => { 
      const f = files[0]
      console.log(files)
      setPreview(URL.createObjectURL(f))
      setFile(f)
  }})

  const { startUpload, isUploading} = useUploadThing('mediaUploader', {
    onClientUploadComplete: async () => {
      setFile(null)
      setPreview(null)
      setSelected(null)
      setEditNovel('')
      setProgress(0)
    },
    onUploadProgress: setProgress
  })

  useEffect(()=>{
    const getData = async () => {
      const allNovels = await getAllNovels()
      setNovels(allNovels)    
    }

    getData()
  }, [])

  useEffect(()=>{
    const getData = async () => {
    
      if(editNovel !== ''){
         const novelData = await NovelInfo(editNovel)
         setSelected(novelData)
      }
    }

    getData()
  }, [editNovel])

  useEffect(()=>{
    const setData = async () => {
      if(selected){
        setEditAuthor(selected.author)
        setEditGenre(selected.genre)
        setEditBlurb(selected.blurb)
        setEditStatus(selected.status)
        setEditCover(selected.cover)
      }  
    }
    setData()
  }, [selected])

  return( 
  
   <main className="min-h-screen text-black" style = {{backgroundColor: 'rgb(246, 246, 246)'}}>
   
     <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#3b3329] bg-white p-6 md:block">
      
       <Link href="/" className="flex items-center font-semibold text-xl text-[rgb(255,54,54)]">limit<span className="text-[rgb(0,123,255)]">less</span></Link>
       
       <p className="mt-1 text-xs text-[rgb(78,78,78)]">Creator studio</p>
       
       <nav className="mt-12 space-y-2">{nav.map(({ name, icon: Icon }) => <button key={name} onClick={() => setSection(name)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm ${section === name ? 'bg-[rgb(242,0,0)] text-white' : 'text-black hover:text-white hover:bg-[#25201b]'}`}><Icon size={17} />{name}</button>)}</nav>
      
     </aside>
     
     <div className="md:ml-64">
      
       <header className="flex items-center justify-between border-b border-[#3b3329] bg-white px-5 py-4 md:px-10">
        
        <div className="flex items-center gap-3">
          
        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">         
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
          
          <span className="text-sm text-[#8f877c]">Studio /</span>
          
          <span className="text-sm">{section}</span>
          
        </div>
        
        <Link href="/" className="flex items-center gap-2 text-sm text-[#d5a85d]" style={{color : 'rgb(243, 0, 0)'}}>
          <ArrowLeft size={15} /> View site
        </Link>

       </header>

        <nav className={`${menuOpen ? 'flex' : 'hidden'} mt-4 space-y-2 px-3 lg:hidden`}>
          {nav.map(({ name, icon: Icon }) => 
              <button key={name} onClick={() => setSection(name)} 
                  className={`flex w-full items-center justify-center gap-3 rounded-lg px-3 py-3 underline text-left text-sm 
                  ${section === name ? 'border border-[rgb(0,0,0)]' : 'text-black hover:text-white hover:bg-[#25201b]'}`}
              >
                <Icon size={17} />
                {name}
              </button>)}
        </nav>

       <section className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        
        {/* 
            <div className="mb-10">
              <p className="text-xs uppercase tracking-[.22em] text-[#d5a85d]">Hello, Calleb</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">{section}</h1>
            </div> 
        */}
        
      {/*
        section === 'Overview' && 
          <div className="grid gap-5 sm:grid-cols-3">
            <Stat icon={BarChart3} label="Readers this month" value="12.8k" />
            <Stat icon={PenLine} label="Draft chapters" value="7" />
            <div className="sm:col-span-3 rounded-xl border border-[#3b3329] bg-[#171513] p-6">
              <h2 className="font-medium">Recent activity</h2>
              <div className="mt-5 space-y-4 text-sm text-[#a79d91]">
                <p className="flex justify-between border-b border-[#3b3329] pb-4">Chapter 42 published to The Archivist of Ash 
                  <span>2h ago</span>
                </p>
                <p className="flex justify-between border-b border-[#3b3329] pb-4">Neon Pilgrim received 128 new bookmarks 
                  <span>Yesterday</span>
                </p>
                <p className="flex justify-between">New reader milestone reached 
                  <span>3d ago</span>
                </p>
              </div>
            </div>
          </div>
      */}
          
      {section === 'Manage stories' && 
          <div className="space-y-3">
          {novels.map((story) => 
            
            <div key={story.id} className="flex items-center justify-between rounded-xl border border-[#3b3329] bg-white p-5">
              
              <div>
                <p className="font-medium">{story.title}</p>
                <p className="mt-1 text-sm text-[#8f877c]">{story.status} · {story.chapters} chapters</p>
              </div>

              <div className='flex gap-2'>
                  <button className="rounded-full border border-[#4a3c2e] hover:border-black px-4 py-2 text-sm" style = {{color:'rgb(255, 34, 0)'}} onClick={()=>{recommendNovel(story.title)}}>Display</button>
                  <button className="rounded-full border border-[#4a3c2e] hover:border-black px-4 py-2 text-sm" style = {{color:'rgb(0, 123, 255)'}} onClick={()=>{setEditNovel(story.title)}}>Edit</button>
              </div>
              
            </div>)}

          </div>}

      {(section === 'Create novel') && 
          <div className="max-w-2xl rounded-xl border border-[#3b3329] bg-white p-6">
            
            <div className="space-y-5">
            
              <label className="block text-sm text-black">
              
                {'Novel title'}
              
                <input value={title} onChange={ (e) => setTitle(e.target.value) } className="mt-2 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder={"enter your novel's name"} />
            
              </label>

              <label className="block text-sm text-black">
              
                {'Author'}
              
                <input value={author} onChange={ (e) => setAuthor(e.target.value) } className="mt-2 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder={"author's full name"} />
            
              </label>

              <label className="block text-sm text-black">
              
                {'Genre'}
              
                <input value={genre} onChange={ (e) => setGenre(e.target.value) } className="mt-2 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder={"e.g fantasy"} />
            
              </label>

              <label className="block text-sm text-black">
              
                {'Status'}
              
                <input value={status} onChange={ (e) => setStatus(e.target.value) } className="mt-2 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder={"e.g serializing / completed"} />
            
              </label>
              
              <label className="block text-sm text-black">
                
                {'Synopsis'}
                <textarea value={blurb} onChange={ (e) => setBlurb(e.target.value) } className="mt-2 min-h-32 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder="Start writing..." />
              
              </label>
           
              <label className="block text-sm text-black">
                
                  {'Cover'}
                <div className='mt-2'>  
                  <div 
                    {...getRootProps()} 
                    className={`border border-dashed rounded-lg p-10 text-center cursor-pointer transition 
                                ${
                                  isDragActive
                                  ? "border-[rgb(0,123,255)] bg-blue-50"
                                  : "border-[#4a3c2e] bg-[rgb(247,247,247)]"
                                }`}>
                    <input {...getInputProps()} />
                    {!preview 
                      ? (<p className={`text-gray-600 text-sm text-gray-50`} >
                          Drag and drop or click to select image
                        </p>) 
                      : (<div className='space-y-2'> 
                        {file?.type.startsWith("image/") && (
                          <Image
                            src={preview}
                            alt="ID document preview"
                            width={400}
                            height={300}
                            className="max-h-64 mx-auto rounded"/>
                        )}
                          <div>{file?.name}</div>
                        </div>)
                    }
                  </div>
                  { file && !isUploading 
                    && <button onClick={() => startUpload([file], {type: 'create', title, author, status, genre, blurb})} className="flex items-center gap-2 rounded-full bg-[rgb(0,123,255)] mt-3 px-5 py-3 text-sm font-medium text-[#11100f]">
                          {published ? <> <Check size={16} /> Published! </> : 'Publish'}
                      </button>
                  }

                {isUploading && 
                  <div className = 'space-y-2 mt-3'>
                    <div className = "bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${progress}%` }}/>
                    </div>
                    <p className="text-center text-sm">{progress}%</p>
                  </div>
                }
                </div>
              </label>

              
              
             </div>

            </div>}

        {(section === 'Publish chapter') && 
            <div className="max-w-2xl rounded-xl border border-[#3b3329] bg-white p-6">
              
              <div className="space-y-5">
              
                <label className="block text-sm text-black">
                
                  {'Novel'}
                
                  <input value={from} onChange={ (e) => setFrom(e.target.value) } className="mt-2 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder={'The Kitsune'} />
              
                </label>

                <label className="block text-sm text-black">
                
                  {'Author'}
                
                  <input value={writer} onChange={ (e) => setWriter(e.target.value) } className="mt-2 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder={'Cosmic Drifter'} />
              
                </label>

                <label className="block text-sm text-black">
              
                  {'Chapter'}
              
                  <input value={chapter} onChange={ (e) => setChapter(e.target.valueAsNumber) }  type='number' className="mt-2 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder={"10"} />
            
                </label>

                <label className="block text-sm text-black">
              
                  {'Chapter title'}
              
                  <input value={heading} onChange={ (e) => setHeading(e.target.value) } className="mt-2 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder={"A New Dawn"} />
            
                </label>

                <label className="block text-sm text-black">
              
                  {'Duration'}
              
                  <input value={duration} onChange={ (e) => setDuration(e.target.value) } className="mt-2 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder={"8 min"} />
            
                </label>
                
                <label className="block text-sm text-black">
                  
                  {'Story'}
                  <textarea value={story} onChange={ (e) => setStory(e.target.value) } className="mt-2 min-h-32 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder="Start writing..." />
                
                </label>

                <button onClick={async () => await createChapter()} className="flex items-center gap-2 rounded-full bg-[rgb(0,123,255)] px-5 py-3 text-sm font-medium text-[#11100f]">
                  {added ? <> <Check size={16} /> Uploaded! </> : 'Upload'}
                </button>
                
              </div>

              </div>}
      
       </section>
  
     </div>

     {selected && 
      <div className="fixed inset-0 z-50 grid place-items-center bg-[#11100f]/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true">
        
        <div className="overflow-y-auto [scrollbar-width:none] rounded-2xl mb-6 border border-[#4a3c2e] bg-white shadow-2xl" style={{width: '400px', maxHeight: '98%'}}>
          
          <div className="flex items-center justify-between bg-white w-[390px] p-5 rounded-2xl" style={{position: 'fixed'}}>

            <span className="text-xs uppercase tracking-[.2em] text-black">Edit Story: {selected.title}</span>
            
            <button onClick={() => {setSelected(null), setEditNovel('')}} aria-label="Close preview"><X size={20} color='black'/></button>
          
          </div>
          {
            //grid gap-6 p-6 sm:grid-cols-[160px_1fr]
          }
         <div className="rounded-xl mt-12 bg-white p-6" style={{}}>
            
            <div className="space-y-5">

              <label className="block text-sm text-black">
              
                {'Author'}
              
                <input value={editAuthor} onChange={ (e) => setEditAuthor(e.target.value) } className="mt-2 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder={"author's full name"} />
            
              </label>

              <label className="block text-sm text-black">
              
                {'Genre'}
              
                <input value={editGenre} onChange={ (e) => setEditGenre(e.target.value) } className="mt-2 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder={"e.g fantasy"} />
            
              </label>

              <label className="block text-sm text-black">
              
                {'Status'}
              
                <input value={editStatus} onChange={ (e) => setEditStatus(e.target.value) } className="mt-2 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder={"e.g serializing / completed"} />
            
              </label>
              
              <label className="block text-sm text-black">
                
                {'Synopsis'}
                <textarea value={editBlurb} onChange={ (e) => setEditBlurb(e.target.value) } className="mt-2 min-h-32 w-full rounded-lg border border-[#4a3c2e] bg-[rgb(247,247,247)] px-4 py-3 text-black outline-none focus:border-[rgb(0,123,255)]" placeholder="Start writing..." />
              
              </label>
           
              <label className="block text-sm text-black">
                
                  {'Cover'}
                <div className='mt-2'>  
                  <div 
                    {...getRootProps()} 
                    className={`border border-dashed rounded-lg p-10 text-center cursor-pointer transition 
                                ${
                                  isDragActive
                                  ? "border-[rgb(0,123,255)] bg-blue-50"
                                  : "border-[#4a3c2e] bg-[rgb(247,247,247)]"
                                }`}>
                    <input {...getInputProps()} />
                    {!preview 
                      ? (<p className={`text-gray-600 text-sm text-gray-50`} >
                          Drag and drop or click to select image
                        </p>) 
                      : (<div className='space-y-2'> 
                        {file?.type.startsWith("image/") && (
                          <Image
                            src={preview}
                            alt="ID document preview"
                            width={400}
                            height={300}
                            className="max-h-64 mx-auto rounded"/>
                        )}
                          <div>{file?.name}</div>
                        </div>)
                    }
                  </div>
                  { file && !isUploading 
                    && <button onClick={() => startUpload([file], {type: 'edit', title: selected.title, author: editAuthor, status: editStatus, genre: editGenre, blurb: editBlurb})} className="flex items-center gap-2 rounded-full bg-[rgb(0,123,255)] mt-3 px-5 py-3 text-sm font-medium text-[#11100f]">
                          {published ? <> <Check size={16} /> Edit! </> : 'Edit'}
                      </button>
                  }

                {isUploading && 
                  <div className = 'space-y-2 mt-3'>
                    <div className = "bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${progress}%` }}/>
                    </div>
                    <p className="text-center text-sm">{progress}%</p>
                  </div>
                }
                </div>
              </label>

              {/* <button onClick={async () => await editNovelInfo(selected.title, editAuthor, editGenre, editStatus, editBlurb, editCover)} className="flex items-center gap-2 rounded-full bg-[rgb(0,123,255)] px-5 py-3 text-sm font-medium text-[#11100f]">
                {published ? <> <Check size={16} /> Edited! </> : 'Edit'}
              </button> */}
              
             </div>

            </div>

        </div>

      </div>}

  </main>
  )}

function Stat({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: string }) { return <div className="rounded-xl border border-[#3b3329] bg-[#171513] p-5"><Icon size={18} className="text-[#d5a85d]" /><p className="mt-6 text-3xl font-semibold">{value}</p><p className="mt-1 text-sm text-[#8f877c]">{label}</p></div> }
