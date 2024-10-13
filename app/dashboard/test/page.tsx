'use client'
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TestPage = () => {
    const [loading, setLoading] = useState(false);
    const handleFetchAds = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://5e6e-103-89-43-210.ngrok-free.app/api/ads');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Failed to fetch ads:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <div className="flex flex-col gap-4">
                <h1>Test Page</h1>
                <Button variant="default" onClick={handleFetchAds} disabled={loading}>{loading ? "Loading..." : "Click me to fetch ads"}</Button>
                
            </div>
        </div>
    )
};

export default TestPage;