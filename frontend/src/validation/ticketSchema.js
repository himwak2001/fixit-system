import { z } from "zod";

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title cannot exceed 100 characters" }),

  description: z
    .string()
    .min(10, { message: "Please provide more detail (min 10 characters)" })
    .max(1000, { message: "Description cannot exceed 1000 characters" }),

  category: z.enum(["PLUMBING", "ELECTRICAL", "HVAC", "CLEANING", "OTHER"], {
    errorMap: () => ({ message: "Please select a category" }),
  }),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
    errorMap: () => ({ message: "Please select a priority level" }),
  }),

  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters" })
    .max(200, { message: "Location cannot exceed 200 characters" }),
});
