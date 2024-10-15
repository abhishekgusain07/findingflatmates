"use client"

import { messages } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getMessageofConversation } from "./conversation.action";
import { toast } from "sonner";

interface ChatComponentProps {
    conversationId: string;
}

const ChatComponent = ({conversationId}: ChatComponentProps) => {
    const [messages, setMessages] = useState<messages[] | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const router = useRouter();
    const {user} = useUser();
    const userId = user?.id;
    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/ws/${conversationId}/${userId}`);
        setSocket(socket);

        socket.onopen = () => {
            console.log("WebSocket connection opened");
        };

        //fetch previous message for this conversation id
        const fetchPreviousMessages = async () => {
            try{
                const messages = await getMessageofConversation(conversationId);
                setMessages(messages);
                toast.success("Messages fetched successfully");
            } catch (error) {
                console.error(error);
                toast.error("Error fetching messages of this conversation");
            }
        }
        fetchPreviousMessages();
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => prevMessages ? [...prevMessages, message] : [message]);
        };
    }, [conversationId, userId]);
    return (
        <div className="mt-5 flex flex-col items-center justify-center">
            <h1>Chat Component</h1>
            <div className="flex flex-col items-center justify-center p-5">
                <h1 className="text-muted-foreground">user: {userId}</h1>
            </div>
            <div className="flex flex-col items-center justify-center mt-5 gap-3">
                {messages?.map((message) => (
                    <div key={message.id} className="flex flex-col items-center justify-center">
                        <h1>{message.content}</h1>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChatComponent;