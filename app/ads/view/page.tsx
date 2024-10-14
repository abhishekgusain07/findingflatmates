'use client'
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { ads } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAd } from "./view.action";

const ViewAdPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [ads, setAds] = useState<ads[]>([]);
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
                    <div key={ad.id}>
                        <h1>{ad.title}</h1>
                        <p className="text-muted-foreground">{ad.description}</p>
                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default ViewAdPage;  