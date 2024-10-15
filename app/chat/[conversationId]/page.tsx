'use client'
import { useEffect, useState } from "react";
import ChatComponent from "./chatComponent";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ChatPage({ params }: { params: { conversationId: string } }) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
    const {user} = useUser();
    useEffect(() => {
        setIsLoading(true);
        if(!user){
            router.push("/login");
        }
        setIsLoading(false);
    }, []);

    if(isLoading) return(
        <div className="flex flex-col h-screen w-full items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
        </div>
    )
    return (
        <div className="flex flex-col h-screen w-full items-center justify-center">
            <div className="flex flex-col p-5 gap-4">
                <h1>Chat {params.conversationId}</h1>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-semibold text-muted-foreground">Messages</h1>
                    </div>
                </div>
                <ChatComponent conversationId={params.conversationId} />
            </div>
        </div>
    )
}