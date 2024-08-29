import { z } from 'zod';

// TODO Ajouter la vérification de l'url de profil

const contactSchema = z.object({
  firstname: z
    .string({
      required_error: "The field 'firstname' is required.",
      invalid_type_error: "The field 'firstname' must be a string.",
    })
    .min(3, {
      message: "The field 'firstname' must be at least 3 characters long.",
    })
    .max(30, {
      message: "The field 'firstname' must be at most 30 characters long.",
    }),

  lastname: z
    .string({
      required_error: "The field 'lastname' is required.",
      invalid_type_error: "The field 'lastname' must be a string.",
    })
    .min(3, {
      message: "The field 'lastname' must be at least 3 characters long.",
    })
    .max(30, {
      message: "The field 'lastname' must be at most 30 characters long.",
    }),

  colorId: z
    .number({
      required_error: "The field 'colorId' is required.",
      invalid_type_error: "The field 'colorId' must be a number.",
    })
    .min(1, {
      message: "The field 'colorId' must be at least 1 character long.",
    }),

  email: z
    .string({
      invalid_type_error: "The field 'email' must be a string.",
    })
    .email({
      message: "The field 'email' must be a valid email address.",
    })
    .optional(),

  phone: z
    .string({
      invalid_type_error: "The field 'phone' must be a string.",
    })
    .min(10, {
      message: "The field 'phone' must be at least 10 characters long.",
    })
    .max(10, {
      message: "The field 'phone' must be at most 10 characters long.",
    })
    .optional(),

  address: z
    .string({
      invalid_type_error: "The field 'address' must be a string.",
    })
    .min(3, {
      message: "The field 'address' must be at least 3 characters long.",
    })
    .max(100, {
      message: "The field 'address' must be at most 100 characters long.",
    })
    .optional(),

  type: z
    .string({
      invalid_type_error: "The field 'type' must be a string.",
    })
    .min(3, {
      message: "The field 'type' must be at least 3 characters long.",
    })
    .max(30, {
      message: "The field 'type' must be at most 30 characters long.",
    })
    .optional(),

  content: z
    .string({
      invalid_type_error: "The field 'content' must be a string.",
    })
    .min(3, {
      message: "The field 'content' must be at least 3 characters long.",
    })
    .max(100, {
      message: "The field 'content' must be at most 100 characters long.",
    })
    .optional(),

  groupId: z
    .number({
      required_error: "The field 'groupId' is required.",
      invalid_type_error: "The field 'groupId' must be a number.",
    })
    .min(1, {
      message: "The field 'groupId' must be at least 1 character long.",
    }),
});

export default contactSchema;
