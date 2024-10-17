"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, XIcon } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createAd, fetchUserImage } from "./form.action"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { useEdgeStore } from "@/lib/edgestore"
import Link from "next/link"
import { useConfirm } from "@/hooks/use-confirm"

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "description must be at least 5 characters.",
  }),
  location: z.string().min(2, {
    message: "location must be at least 2 characters.",
  }),
  price: z.string().min(1, {
    message: "price must be at least 1.",
  }),
  looking_for: z.union([z.literal("male"), z.literal("female"), z.literal("any")]),
  occupancy_type: z.union([z.literal("shared"), z.literal("single"), z.literal("any")]),
  photos: z.array(z.string()).optional(),
})

export function ProfileForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false)
  const [isUploadingFiles, setIsUploadingFiles] = useState<boolean>(false)
  const [uploadedFilesUrls, setUploadedFilesUrls] = useState<string[]>([])
  const [progress, setProgress] = useState<number>(0)
  const { edgestore } = useEdgeStore();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    setIsLoadingFiles(true)
    setSelectedFiles(acceptedFiles)
    setIsLoadingFiles(false)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userImage, setUserImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndSetUserImage = async () => {
      const image = await fetchUserImage()
      setUserImage(image || null)
    }
    fetchAndSetUserImage()
  }, [])

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "This will deactivate the current invite code and regenerate a new one"
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price: "",
      looking_for: "any",
      occupancy_type: "any",
      photos: [],
    },
  })
  const uploadProfilePhoto = async (file: File) => {
    try {
      const uploadedFiles = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setProgress((progress/100))
        }
      })
    } catch (error) {
      console.log(error)
    }
  } 
  const uploadFiles = async (files: File[]) => {
    try {
      let len = files.length;
      setIsUploadingFiles(true)
      const uploadedFilesUrls = []
      for (const file of files) {
        const uploadedFiles = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            setProgress((progress/len))
          }
        })
        uploadedFilesUrls.push(uploadedFiles.url)
      }
      setUploadedFilesUrls(uploadedFilesUrls)
    } catch (error) {
      console.log(error)
    } finally {
      setIsUploadingFiles(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      if(!userImage) {
        toast.error("Please upload a profile photo")
        return
      }
      values.photos = uploadedFilesUrls
      await createAd(values)
      toast.success("Ad created successfully")
      form.reset()
    } catch (error) {
        toast.error("Failed to create ad")
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='min-w-[500px]'>
      <CardHeader>
        <CardTitle>Find Roommate, Create Ad!</CardTitle>
        <CardDescription>
          Create an ad to find a roommate.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {
              !userImage ? (
                <div>
                  todo: profile image input components  
                </div>
              ) : (
                <div>
                  todo: show user profile image / do nothing removing this component.
                </div>
              )
            }
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Enter title for ad...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Enter description for ad...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>   
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Enter location for ad...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type='string'
                      placeholder='Enter price for ad...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="looking_for"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Looking For</FormLabel>
                  <FormControl>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Male" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupancy_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupancy Type</FormLabel>
                  <FormControl>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="shared" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="shared">Shared</SelectItem>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="any">Any</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photos</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2" >
                    <Input
                      type='file'
                      placeholder='Enter photos for ad...'
                      {...field}
                      multiple
                      className="cursor-pointer"
                    />
                    <Button>Upload</Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photos</FormLabel>
                  <FormControl>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {
                      isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    }
                  </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {
              isLoadingFiles ?  <Loader2 className = "size-4 animate-spin" /> :
              <>
                <div className="h-[6px] w-44 border rounded overflow-hidden">
                  <div className="h-full bg-blue-500" style={{width: `${progress * 100}%`}} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)} // Create a URL for the file
                        alt={`Preview ${index}`}
                        className="w-32 h-32 object-cover mr-2 rounded-md opacity-90 hover:opacity-100" // Adjust size as needed
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                        className="absolute top-0 right-2 mt-1 ml-1 bg-red-500 text-white rounded-full  opacity-40 hover:opacity-100"
                      >
                        <XIcon className="size-2" />
                      </Button>
                    </div>
                    ))}
                    <Button type="button" onClick={() => setSelectedFiles([])}>Clear</Button>
                    <Button type="button" 
                      disabled={isUploadingFiles}
                      onClick={() => {
                      uploadFiles(selectedFiles)
                    }}>upload {
                      isUploadingFiles && <Loader2 className = "size-4 animate-spin ml-2" />
                    }</Button>
                    {
                      uploadedFilesUrls.map((url, index) => (
                        <div key={index}>
                          <Link href={url} target="_blank">{url}</Link>
                        </div>
                      ))
                    }
                </div>
              </>
            }
            <Button type="submit">
              {
                isLoading ? <Loader2 className = "size-4 animate-spin" /> : "submit"
              }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ProfileForm