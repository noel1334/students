import { z } from "zod";

const optString = (max = 200) =>
  z
    .string()
    .trim()
    .max(max, `Must be at most ${max} characters`)
    .optional()
    .or(z.literal(""));

const optEmail = z
  .string()
  .trim()
  .email("Invalid email address")
  .max(255)
  .optional()
  .or(z.literal(""));

// Loose international phone: digits, optional +, spaces, dashes; 7–20 chars
const optPhone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid phone number")
  .optional()
  .or(z.literal(""));

const optDate = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine(
    (v) => {
      if (!v) return true;
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return false;
      if (d > new Date()) return false;
      const age = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 10 && age <= 120;
    },
    { message: "Enter a valid date of birth (age 10–120)" }
  );

export const GENDER_VALUES = ["MALE", "FEMALE"] as const;
export const MARITAL_VALUES = ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"] as const;
export const RELIGION_VALUES = ["CHRISTIANITY", "ISLAM", "TRADITIONAL", "OTHER"] as const;
export const BLOOD_GROUP_VALUES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export const GENOTYPE_VALUES = ["AA", "AS", "SS", "AC", "SC"] as const;
export const RELATIONSHIP_VALUES = [
  "PARENT",
  "SIBLING",
  "SPOUSE",
  "GUARDIAN",
  "RELATIVE",
  "FRIEND",
  "OTHER",
] as const;

export const studentProfileSchema = z.object({
  // Read-only account fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  otherName: z.string().optional(),
  email: z.string().optional(),
  regNo: z.string().optional(),

  // BioData / self-editable
  middleName: optString(60),
  dateOfBirth: optDate,
  gender: z.enum(GENDER_VALUES).optional().or(z.literal("")),
  nationality: optString(60),
  placeOfBirth: optString(80),
  religion: z.enum(RELIGION_VALUES).optional().or(z.literal("")),
  maritalStatus: z.enum(MARITAL_VALUES).optional().or(z.literal("")),

  // Contact
  phoneNumber: optPhone,
  permanentHomeAddress: optString(200),
  countryOfResidence: optString(60),
  stateOfResidence: optString(60),
  lgaOfResidence: optString(60),
  residentialAddress: optString(200),

  // Admission (read-only)
  admissionMode: z.string().optional(),
  yearOfEntry: z.string().optional(),
  currentLevel: z.string().optional(),
  yearOfGraduation: z.string().optional(),
  admissionNumber: z.string().optional(),

  // Medical
  bloodGroup: z.enum(BLOOD_GROUP_VALUES).optional().or(z.literal("")),
  genotype: z.enum(GENOTYPE_VALUES).optional().or(z.literal("")),

  // Sponsor (legacy)
  sponsorName: optString(80),
  sponsorPhone: optPhone,

  // Next of kin
  nokFullName: optString(80),
  nokRelationship: z.enum(RELATIONSHIP_VALUES).optional().or(z.literal("")),
  nokPhone: optPhone,
  nokEmail: optEmail,
  nokAddress: optString(200),

  // Guardian
  guardianFullName: optString(80),
  guardianRelationship: z.enum(RELATIONSHIP_VALUES).optional().or(z.literal("")),
  guardianPhoneInfo: optPhone,
  guardianEmail: optEmail,
  guardianOccupation: optString(80),
  guardianAddress: optString(200),
});

export type StudentProfileFormValues = z.infer<typeof studentProfileSchema>;

// Password schema
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must differ from current",
    path: ["newPassword"],
  });

export function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) && pw.length >= 12) s++;
  const label = ["Too weak", "Weak", "Fair", "Strong", "Very strong"][s];
  return { score: s as 0 | 1 | 2 | 3 | 4, label };
}