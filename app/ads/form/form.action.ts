'use server'
import { auth } from "@clerk/nextjs/server"
import { formSchema } from "./page"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { uid } from "uid"


export async function createAd(values: z.infer<typeof formSchema>) {
    const featureId = uid()
    const amenityId = uid()
    const preferenceId = uid()
    const adId = uid()
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
                id: adId,
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
                        id: featureId,
                        name: 'Parking'
                    }
                },
                amenities: {
                    create: {
                        id: amenityId,
                        name: 'Wifi'
                    }
                },
                preferences: {
                    create: {
                        id: preferenceId,
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