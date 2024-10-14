'use client'
import prisma from "@/lib/prisma";
import { ads } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const ViewAdPage = async () => {
    const [isLoading, setIsLoading] = useState(true);
    const [ads, setAds] = useState<ads[]>([]);

    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            const data = await prisma.ads.findMany();
            setAds(data);
            setIsLoading(false);
        }
        fetchAds();
    }, []);
    if(isLoading) return (
        <div className="flex flex-col h-screen w-full items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
        </div>
    )
    return (
        <div>
            {
                ads.map((ad) => (
                    <div key={ad.id}>
                        <h1>{ad.title}</h1>
                    </div>
                ))
            }
        </div>
    )
}

export default ViewAdPage;  