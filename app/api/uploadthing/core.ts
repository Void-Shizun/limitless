import { CreateNovel, editNovelInfo } from "@/lib/actions/admin";
import { createUploadthing, type FileRouter } from "uploadthing/next"

import { z } from "zod";

const f = createUploadthing()

export const ourFileRouter = {

    mediaUploader: f({
        image: { maxFileSize: "4MB", maxFileCount: 1, }
      })
      .input(
        z.object({
          type: z.string(),
          title: z.string(),
          author: z.string(),
          status: z.string(),
          genre: z.string(),
          blurb: z.string(),
        })
      )
      .middleware(async ({ input }) => {
        return { user: input }; 
      })
      .onUploadComplete(async ({ metadata, file }) => {
        if(metadata.user.type !== 'edit')
            await CreateNovel(metadata.user.title, metadata.user.author, metadata.user.genre, metadata.user.status, 0, 5, file.ufsUrl, metadata.user.blurb)
        else{
            await editNovelInfo(metadata.user.title, metadata.user.author, metadata.user.genre, metadata.user.status, metadata.user.blurb, file.ufsUrl)
        }  
      }),

} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter