import { z } from "zod";

export const userInfoSchema = z.object({
    address: z.object({
        streetName: z.string(),
        number: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string()
    }),
    phone: z.string(),
    document: z.string(),
    birthday: z.string(),
    firstName: z.string(),
    lastName: z.string(),
})
