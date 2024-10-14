'use client'
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { ads } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { checkExistingConversationWithAdId, createConversationWithOwner, getAd } from "./view.action";
import { useRouter } from "next/navigation";

const ViewAdPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [ads, setAds] = useState<ads[]>([]);
    const router = useRouter();
    const fetchAds = async () => {
        setIsLoading(true)
        try {
            const data = await getAd()
            setAds(data)
        } catch (error) {
            toast.error("Failed to fetch ads")
        } finally {
            setIsLoading(false)
        }
    }
    const createConversation = async (adId: number, ownerId: string) => {
        try {
            const conversation = await checkExistingConversationWithAdId(adId);
            if(conversation){
                router.push(`/chat/${conversation.id}`)
                toast.success("Conversation already exists, Redirecting to conversation")
            }else{
                const newConversation = await createConversationWithOwner(adId, ownerId);
                router.push(`/chat/${newConversation.id}`)
                toast.success("Conversation created, Redirecting to conversation")
            }
        } catch (error) {
            toast.error("Failed to create conversation")
        }
    }
    if(isLoading) return (
        <div className="flex flex-col h-screen w-full items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
        </div>
    )
    return (
        <div className="flex flex-col h-screen w-full items-center justify-center">
            <div className="flex flex-col gap-4">
                <Button onClick={fetchAds} variant="ghost">
                    Fetch Ads
                    {
                        isLoading && <Loader2 className="size-4 animate-spin" />
                    }
                </Button>
            {
                ads.map((ad) => (
                    <div key={ad.id} >
                        <h1>{ad.title}</h1>
                        <p className="text-muted-foreground">{ad.description}</p>
                        <Button variant="ghost" onClick={() => {
                            createConversation(ad.id, ad.user_id);
                        }}>
                            Chat with Owner
                        </Button>
                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default ViewAdPage;  