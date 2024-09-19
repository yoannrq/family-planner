import { z } from 'zod';

export const calendarEntrySchema = z.object({
  title: z
    .string({
      required_error: "The field 'title' is required.",
      invalid_type_error: "The field 'title' must be a string.",
    })
    .min(3, {
      message: "The field 'title' must be at least 3 characters long.",
    })
    .max(30, {
      message: "The field 'title' must be at most 30 characters long.",
    }),

  description: z
    .string({
      invalid_type_error: "The field 'description' must be a string.",
    })
    .min(3, {
      message: "The field 'description' must be at least 3 characters long.",
    })
    .max(100, {
      message: "The field 'description' must be at most 100 characters long.",
    })
    .optional(),

  startAt: z
    .string({
      required_error: "The field 'startAt' is required.",
    })
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, {
      message: "The field 'startAt' must be ISO 8601 formatted.",
    })
    .datetime({
      message: "The field 'startAt' must be a valid date.",
    }),

  endAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, {
      message: "The field 'endAt' must be ISO 8601 formatted.",
    })
    .datetime({
      message: "The field 'endAt' must be a valid date.",
    })
    .optional(),

  allDay: z
    .boolean({
      invalid_type_error: "The field 'allDay' must be a boolean.",
    })
    .optional(),

  location: z
    .string({
      invalid_type_error: "The field 'location' must be a string.",
    })
    .min(3, {
      message: "The field 'location' must be at least 3 characters long.",
    })
    .max(30, {
      message: "The field 'location' must be at most 100 characters long.",
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

  colorId: z
    .number({
      required_error: "The field 'colorId' is required.",
      invalid_type_error: "The field 'colorId' must be a number.",
    })
    .min(1, {
      message: "The field 'colorId' must be at least 1 character long.",
    }),

  authorId: z
    .number({
      required_error: "The field 'authorId' is required.",
      invalid_type_error: "The field 'authorId' must be a number.",
    })
    .min(1, {
      message: "The field 'authorId' must be at least 1 character long.",
    }),
});

export type CalendarEntryInput = z.infer<typeof calendarEntrySchema>;
