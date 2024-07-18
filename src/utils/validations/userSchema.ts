import { z } from 'zod';

// TODO Ajouter la vérification de l'url de profil

const userSchema = z.object({
  name: z
    .string({
      required_error: "The field 'name' is required.",
      invalid_type_error: "The field 'name' must be a string.",
    })
    .min(3, {
      message: "The field 'name' must be at least 3 characters long.",
    })
    .max(50, {
      message: "The field 'name' must be at most 50 characters long.",
    }),

  email: z
    .string({
      required_error: "The field 'email' is required.",
      invalid_type_error: "The field 'email' must be a string.",
    })
    .email({
      message: "The field 'email' must be a valid email address.",
    }),

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
});

export default userSchema;
