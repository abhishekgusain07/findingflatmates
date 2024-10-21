"use client"

import { messages } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getMessageofConversation } from "./conversation.action";
import { toast } from "sonner";
import MessageInput from "./messageInput";
import ChatScreen from "./Chatscreen";

interface ChatComponentProps {
    conversationId: string;
}

export interface PartialMessage {
    content: string;
    sender_id: string;
}

const ChatComponent = ({conversationId}: ChatComponentProps) => {
    const [messages, setMessages] = useState<Partial<PartialMessage>[] | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const router = useRouter();
    const {user} = useUser();
    const userId = user?.id;
    const generateRandomId = () => {
        return Math.random().toString(36).substring(2, 15);
    }
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
                if(messages){
                    //format message so that it only contains content, sender_id
                    const formattedMessages = messages?.map((message) => ({
                        content: message.content,
                        sender_id: message.sender_id,
                    }));
                    setMessages(formattedMessages);
                }else setMessages(null);
                toast.success("Messages fetched successfully");
            } catch (error) {
                console.error(error);
                toast.error("Error fetching messages of this conversation");
            }
        }
        fetchPreviousMessages();
        socket.onmessage = (event) => {
            console.log("WebSocket message received");
            console.log(event.data);
            try {
                const { message, sender_id } = JSON.parse(event.data);
                // Create a new message object to match the expected structure
                const newMessage = { content: message, sender_id: sender_id };
                setMessages((prevMessages) => prevMessages ? [...prevMessages, newMessage] : [newMessage]);
            } catch (error) {
                console.error("Error parsing message:", error);
                toast.error("Received invalid message format");
            }
        };
        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };
    }, [conversationId, userId]);
    return (
        <div className="mt-5 flex flex-col items-center justify-center">
            <h1>Chat Component</h1>
            <div className="flex flex-col items-center justify-center p-5">
                <h1 className="text-muted-foreground">user: {userId}</h1>
            </div>
            <div className="flex flex-col items-center justify-center mt-5 gap-3">
                <ChatScreen messages={messages} conversationId={conversationId} userId={userId} />
            </div>
        </div>
    )
}

export default ChatComponent;