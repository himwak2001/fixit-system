import { z } from "zod";

export const assignTicketSchema = z.object({
  ticketNumber: z.string(),
  technicianId: z
    .string()
    .uuid({ message: "Please select a technician" })
    .min(1, { message: "Please select a technician" }),
});
