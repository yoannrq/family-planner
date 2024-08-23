import { z } from 'zod';
const groupSchema = z.object({
    name: z
        .string({
        required_error: "The field 'name' is required.",
        invalid_type_error: "The field 'name' must be a string.",
    })
        .min(3, {
        message: "The field 'name' must be at least 3 characters long.",
    })
        .max(30, {
        message: "The field 'name' must be at most 30 characters long.",
    }),
    colorId: z
        .number({
        required_error: "The field 'colorId' is required.",
        invalid_type_error: "The field 'colorId' must be a number.",
    })
        .min(1, {
        message: "The field 'colorId' must be at least 1 character long.",
    }),
});
export default groupSchema;
