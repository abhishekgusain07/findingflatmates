const page = ({params}: {params: {adId: string}}) => {
    return (
        <div className="flex flex-col h-full w-full items-center justify-center">
            <h1>single Ad</h1>
            <p className="text-muted-foreground">{params.adId}</p>
        </div>
    )
}

export default page;