'use server'
import prisma from "@/lib/prisma";
import { conversations, messages } from "@prisma/client";
import { uid } from 'uid';

export async function createConversation(): Promise<conversations | null> {
    try {
        const messageId = uid(32);
        const conversationId = uid(32);
        const conversation = await prisma.conversations.create({
            data: {
                id: conversationId,
                ad_id: 2,
                user1_id: "user_2nN90ep6t1Eh1xhyjajG0dEBzhl",
                user2_id: "user_2nPrPN4y1SMLXOJPO3oedvz3foT",
                messages: {
                    create: {
                        content: "Hello, how are you?",
                        sender_id: "user_2nN90ep6t1Eh1xhyjajG0dEBzhl",
                        id: messageId,
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

export async function getConversationById(id: string): Promise<conversations | null> {
    try {
        const conversation = await prisma.conversations.findUnique({
            where: {
                id: id,
            },
        });
        return conversation;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export async function getMessagesByConversationId(id: string): Promise<messages[] | null> {
    try {
        const messages = await prisma.messages.findMany({
            where: {
                conversation_id: id,
            },
        });
        return messages;
    } catch (error) {
        console.error(error);
        throw error;
    }
}