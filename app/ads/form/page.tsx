"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { createAd } from "./form.action"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { toast } from "sonner"

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
})

export function ProfileForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price: "",
      looking_for: "any",
      occupancy_type: "any",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await createAd(values)
      toast.success("Ad created successfully")
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ProfileForm