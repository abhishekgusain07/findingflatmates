'use client'
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { sendMessage } from "./conversation.action";
import { PartialMessage } from "./chatComponent";

interface MessageInputProps {
    conversationId: string;
    userId: string | undefined;
}

export const formSchema = z.object({
    message: z.string().min(1, {
      message: "message must be at least 1 characters.",
    })
})

const MessageInput = ({conversationId, userId}: MessageInputProps) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          message: "",
        },
      })
    
      async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
          //server action to send message
          await sendMessage(conversationId, values.message, userId)
          toast.success("Message sent successfully")
          form.reset()
        } catch (error) {
            toast.error("Failed to send message")
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      }
    if(!userId) {
        router.push('/sign-in')
    }
    return (
        <div className="flex items-center justify-center w-full">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center px-2 bg-white  rounded-full shadow-md">
                <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                    <FormItem className="flex-grow px-4 py-2 bg-transparent outline-none">
                    <FormControl>
                        <Input
                        type='text'
                        placeholder='Enter message ...'
                        {...field}
                        className="border-none focus:outline-none outline-none"
                        disabled={isLoading}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <button
                    type="submit"
                    className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    {
                        isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4 hover:scale-95" />
                    }
                </button>
            </form>
            </Form>
        </div>
    )
}

export default MessageInput;