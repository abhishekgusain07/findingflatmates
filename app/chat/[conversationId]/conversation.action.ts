'use server'
import prisma from "@/lib/prisma";

import { messages } from "@prisma/client";
import {uid} from "uid"

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

export async function sendMessage(conversationId: string, message: string, userId: string | undefined){
    try{
        if(!userId) throw new Error("User not logged in");
        const newMessage = await prisma.messages.create({
            data: {
                id: uid(32),
                conversation_id: conversationId,
                content: message,
                sender_id: userId!,
            }
        })
        return newMessage;
    } catch (error) {
        console.error(error);
        throw error;
    }
}   