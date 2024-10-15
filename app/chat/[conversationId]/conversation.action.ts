'use server'
import prisma from "@/lib/prisma";

import { messages } from "@prisma/client";

export async function getMessageofConversation(conversationId: string): Promise<messages[] | null>{
    try{
        const messages = await prisma.messages.findMany({
            where: {
            conversation_id: conversationId,
            },
        });
        return messages;
    } catch (error) {
        console.error(error);
        throw error;
    }
}   