import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

import auth from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      const session = await auth()
      if (!session) throw new UploadThingError("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      return { uploadedBy: metadata.userId }
    }),

  categoryImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()
      if (!session) throw new UploadThingError("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Category image upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
