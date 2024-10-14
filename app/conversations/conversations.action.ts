'use server'
import prisma from "@/lib/prisma";
import { conversations } from "@prisma/client";

export async function createConversation(): Promise<conversations | null> {
    try {
        const conversation = await prisma.conversations.create({
            data: {
                ad_id: 2,
                user1_id: "user_2nN90ep6t1Eh1xhyjajG0dEBzhl",
                user2_id: "user_2nPrPN4y1SMLXOJPO3oedvz3foT",
                messages: {
                    create: {
                        content: "Hello, how are you?",
                        sender_id: "user_2nN90ep6t1Eh1xhyjajG0dEBzhl",
                    },
                },
            },
        });
        return conversation;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getConversation(): Promise<conversations[] | null> {
    try {
        const conversation = await prisma.conversations.findMany()
        return conversation;
    } catch (error) {
        console.error(error);
        throw error;
    }
}   