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

        //send notification to web socket 
        const response: Response = await fetch(`http://127.0.0.1:8000/ws/notify/${conversationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: newMessage.content,
                sender_id: newMessage.sender_id,
            }),
        })
        console.log(response.status);

        return newMessage;
    } catch (error) {
        console.error(error);
        throw error;
    }
}   