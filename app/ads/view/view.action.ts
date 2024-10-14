'use server'
import prisma from "@/lib/prisma"
import { ads } from "@prisma/client";

export async function getAd(): Promise<ads[]> {
    try {
        const ads = await prisma.ads.findMany();
        return ads
    } catch (error) {
        console.log(error)
        throw new Error("Failed to get ads")
    }
}