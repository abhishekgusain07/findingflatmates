'use server'
import {z} from 'zod'
import { formSchema } from './page'
import { auth } from '@clerk/nextjs/server'
export const createAd = async(values: z.infer<typeof formSchema>) => {
    const {userId} = auth()
    console.log(values)
}