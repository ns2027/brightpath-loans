import { z } from "zod";

export const EMPLOYMENT_TYPES = ["SALARIED", "SELF_EMPLOYED", "UNEMPLOYED"] as const;
export const APPLICATION_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Enter a valid date",
  }),
  address: z.string().min(5, "Address is required"),
});

export const employmentInfoSchema = z.object({
  employmentType: z.enum(EMPLOYMENT_TYPES),
  employerName: z.string().optional(),
  monthlyIncome: z.coerce.number().positive("Monthly income must be positive"),
  yearsEmployed: z.coerce.number().min(0, "Cannot be negative"),
});

export const loanDetailsSchema = z.object({
  loanAmount: z.coerce.number().positive("Loan amount must be positive"),
  loanPurpose: z.string().min(2, "Purpose is required"),
  loanTermMonths: z.coerce.number().int().min(6).max(360),
});

export const applicationSchema = personalInfoSchema
  .merge(employmentInfoSchema)
  .merge(loanDetailsSchema);

export type ApplicationInput = z.infer<typeof applicationSchema>;
