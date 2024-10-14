"use client"

import { messages } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface ChatComponentProps {
    conversationId: string;
}

const ChatComponent = ({conversationId}: ChatComponentProps) => {
    const [messages, setMessages] = useState<messages[]>([]);
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

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };
    }, [conversationId, userId]);
    return (
        <div className="mt-5 flex flex-col items-center justify-center">
            <h1>Chat Component</h1>
            <div className="flex flex-col items-center justify-center p-5">
                <h1 className="text-muted-foreground">user: {userId}</h1>
            </div>
        </div>
    )
}

export default ChatComponent;