'use server'
import { auth } from "@clerk/nextjs/server"
import { formSchema } from "./page"
import { z } from "zod"
import prisma from "@/lib/prisma"


export async function createAd(values: z.infer<typeof formSchema>) {
    try {
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized")
        }

        const user = await prisma.user.findUnique({
            where: {
                user_id: userId
            }
        })
        
        if (!user) {
            throw new Error("User not found")
        }

        const ad = await prisma.ads.create({
            data: {
                user_id: userId,
                title: values.title,
                description: values.description,
                location: values.location,
                price: Number(values.price),
                looking_for: values.looking_for,
                occupancy_type: values.occupancy_type,
                photos: values.photos,
                features: {
                    create: {
                        name: 'Parking'
                    }
                },
                amenities: {
                    create: {
                        name: 'Wifi'
                    }
                },
                preferences: {
                    create: {
                        name: 'Smoking'
                    }
                },
            }
        })

        return {
            success: true,
            message: "Ad created successfully",
            ad: ad
        }
    } catch (error) {
        throw new Error("Failed to create ad")
        console.log(error)
    }
}


export const fetchUserImage = async () => {
    const { userId } = auth()
    if (!userId) {
        throw new Error("Unauthorized")
    }
    const user = await prisma.user.findUnique({
        where: {
            user_id: userId
        }
    })
    return user?.profile_photo
}

export const changeProfilePhoto = async (photoUrl: string) => {
    try {
        const { userId } = auth()
        if (!userId) {
            throw new Error("Unauthorized")
        }
        const user = await prisma.user.findUnique({
            where: {
            user_id: userId
            }
        })
        if (!user) {
            throw new Error("User not found")
        }
        const updatedUser = await prisma.user.update({
            where: {
                user_id: userId
            },
            data: {
                profile_photo: photoUrl
            }
        })
        return updatedUser
    } catch (error) {
        throw new Error("Failed to upload profile photo")
    }
}