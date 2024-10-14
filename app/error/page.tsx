'use client'
import { Button } from "@/components/ui/button"
import { TriangleAlert } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function Error() {
    const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <div className="flex flex-row items-center gap-3">
            <TriangleAlert className="size-10 text-red-500 mb-6"/>
            <h1 className="text-2xl font-bold text-black mb-4">Oops! Something went wrong</h1>
        </div>
        <p className="text-gray-600 mb-4">We apologize for the inconvenience. An unexpected error has occurred.</p>
          <p className="text-sm text-gray-500 mb-4">Try Again After Some Time, The Error is from our side</p>
        <div className="flex justify-center">
          <Button
            onClick={() => {
                router.push('/')
            }}
            variant='outline'
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}