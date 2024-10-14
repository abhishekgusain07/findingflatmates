import ChatComponent from "./chatComponent";

export default function ChatPage({ params }: { params: { conversationId: string } }) {
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