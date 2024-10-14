import { formSchema } from "./page"
import { z } from "zod"


export async function createAd(values: z.infer<typeof formSchema>) {
    console.log(values)
}