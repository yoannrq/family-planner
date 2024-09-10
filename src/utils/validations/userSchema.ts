import { z } from 'zod';

// TODO Ajouter la vérification de l'url de profil

export const userSchema = z.object({
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

  email: z
    .string({
      required_error: "The field 'email' is required.",
      invalid_type_error: "The field 'email' must be a string.",
    })
    .email({
      message: "The field 'email' must be a valid email address.",
    })
    .toLowerCase(),

  password: z
    .string({
      required_error: "The field 'password' is required.",
      invalid_type_error: "The field 'password' must be a string.",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "The field 'password' must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.",
      },
    )
    .min(8, {
      message: "The field 'password' must be at least 8 characters long.",
    }),

  settingColorId: z
    .number({
      required_error: "The field 'settingColorId' is required.",
      invalid_type_error: "The field 'settingColorId' must be a number.",
    })
    .min(1, {
      message: "The field 'settingColorId' must be at least 1 character long.",
    }),

  profilePictureUrl: z
    .string({
      invalid_type_error: "The field 'profilePictureUrl' must be a string.",
    })
    .url({
      message: "The field 'profilePictureUrl' must be a valid URL.",
    })
    .optional(),

  refreshToken: z
    .string({
      invalid_type_error: "The field 'refreshToken' must be a string.",
    })
    .optional(),
});

export type UserInput = z.infer<typeof userSchema>;
