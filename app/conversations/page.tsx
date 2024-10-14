'use client'
import { Button } from "@/components/ui/button";
import { FileTextIcon, Loader2, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createConversation, getConversation } from "./conversations.action";
import { conversations } from "@prisma/client";

const ConversationsPage = () => {
    const [isSeedLoading, setIsSeedLoading] = useState<boolean>(false);
    const [isFetchLoading, setIsFetchLoading] = useState<boolean>(false);
    const [conversation, setConversation] = useState<conversations[] | null>(null);
    const seedConversation = async () => {
        setIsSeedLoading(true);
        try {
            await createConversation();
            toast.success("Conversation seeded");
        } catch (error) {
            console.error(error);
            toast.error("Error seeding conversation");
        } finally {
            setIsSeedLoading(false);
        }
    }
    const fetchConversation = async () => {
        setIsFetchLoading(true);
        try {
            const conversation = await getConversation();
            setConversation(conversation);
        } catch (error) {
            console.error(error);
            toast.error("Error fetching conversation");
        } finally {
            setIsFetchLoading(false);
        }
    }
    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <div className="flex flex-col justify-center items-center p-10 gap-4">
                <h1 className="text-2xl font-bold">Conversations</h1>
            </div>
            <Button onClick={seedConversation}>
                {isSeedLoading ? <Loader2 className="size-4 animate-spin" /> : <PlusIcon className="size-4" />} seed conversation
            </Button>
            <Button variant="ghost" onClick={fetchConversation}>
                {isFetchLoading ? <Loader2 className="size-4 animate-spin" /> : <FileTextIcon className="size-4" />} fetch conversation
            </Button>
            {
                conversation && conversation.map((conversation) => {
                    return (
                        <div key={conversation.id}>
                            <p className="text-sm text-gray-500">{conversation.id}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ConversationsPage;