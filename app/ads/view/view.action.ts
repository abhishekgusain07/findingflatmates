'use server'
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";
import { ads, conversations } from "@prisma/client";
import { uid } from "uid";

export async function getAd(): Promise<ads[]> {
    try {
        const ads = await prisma.ads.findMany();
        return ads
    } catch (error) {
        console.log(error)
        throw new Error("Failed to get ads")
    }
}

export async function checkExistingConversationWithAdId(adId: number): Promise<conversations | null> {
    try {
        const conversation = await prisma.conversations.findFirst({
            where: {
                ad_id: adId
            }
        })
        return conversation
    }catch(error){
        console.log(error)
        throw new Error("Failed to check existing conversation with ad id")
    }
}

export async function createConversationWithOwner(adId: number, ownerId: string): Promise<conversations> {
    try {
        const {userId} = await auth()
        const conversationId = uid(32)
        const messageId = uid(32)
        const conversation = await prisma.conversations.create({
            data: {
                id: conversationId,
                ad_id: adId,
                user1_id: userId as string,
                user2_id: ownerId,
                messages: {
                    create: {
                        id: messageId,
                        content: "system generated",
                        sender_id: userId as string,
                    }
                }
            }
        })
        return conversation
    }catch(error){
        console.log(error)
        throw new Error("Failed to create conversation")
    }
}   