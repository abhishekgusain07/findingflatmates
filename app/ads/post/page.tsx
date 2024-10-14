'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { z } from "zod"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export const formSchema = z.object({
    title: z.string().min(2, {
      message: "title must be at least 2 characters.",
    }),
    description: z.string().min(2, {
        message: "description must be at least 2 characters.",
    }),
    location: z.string().min(2, {
        message: "location must be at least 2 characters.",
    }),
    price: z.number().min(2, {
        message: "price must be at least 2 characters.",
    }),
    looking_for: z.string().min(2, {
        message: "looking_for must be at least 2 characters.",
    }),
    occupancy_type: z.string().min(2, {
        message: "occupancy_type must be at least 2 characters.",
    }),
})

const CreateAdPage = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        console.log(values)
        alert('ad created successfully')
        setLoading(false)
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
                    <form className='flex flex-col gap-2' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='title'
                                            placeholder='Enter title for ad...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' className='self-start'>
                        Submit
                            {
                                loading && <Loader2 className='animate-spin ml-2 size-4' />
                            }
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default CreateAdPage