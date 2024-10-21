'use client'
import { useUser } from "@clerk/nextjs";
import { PartialMessage } from "./chatComponent"
import MessageInput from "./messageInput";
import MessageBox from "./messagebox";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ChatScreenProps {
    messages: Partial<PartialMessage>[] | null
    conversationId: string
    userId: string | undefined
}


const ChatScreen = ({ messages, conversationId, userId }: ChatScreenProps) => {
    const {user} = useUser();
    const [chatmessages, setChatMessages] = useState<Partial<PartialMessage>[] | null>(messages)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        setIsLoading(true)
        setChatMessages(messages)
        setIsLoading(false)
    }, [messages])
    return (
        <>
            <div className="flex h-full flex-col w-screen">
                {chatmessages?.map((message, idx) => {
                    if(message.sender_id === user?.id){
                        return <MessageBox key={message.content} content={message.content} dir="right" idx={idx}/>
                    }
                    else{
                        return <MessageBox key={message.content} content={message.content} dir="left" idx={idx}/>
                    }
                })}
                {isLoading && <div className="flex items-center justify-center h-full"><Loader2 className="size-4 animate-spin" /></div>}
            </div>
            <MessageInput conversationId={conversationId} userId={userId} />
        </>
    )
}

export default ChatScreen;