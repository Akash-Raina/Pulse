import * as z from "zod"

export const signupSchema  = z.object({
    username: z.string().min(3).max(20),
    email: z.email(),
    password: z.string().min(8).max(20)
});

export type SignupBody = z.infer<typeof signupSchema>;
