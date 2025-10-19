import { z } from "zod";

const nonEmptyString = z.string()
  .min(1, "Field is required")
  .refine((val) => val.trim().length > 0, { message: "Field cannot be just whitespace" })
  .transform((val) => val.trim());

const commaSeparatedArray= z.string()
  .transform((val) => val
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
  )
  .refine((arr) => arr.length > 0, {
    message: "At least one value is required",
  });

const BookSchema = z.object({
  title: z.string().min(1, "Title is required"),

  authors: commaSeparatedArray,
  genres: commaSeparatedArray,
  tags: commaSeparatedArray,

  condition: z.enum(["NEW", "USED", "FAIR"]).optional(),
  description: nonEmptyString,

  sellPrice: z.coerce.number().optional(),
  lendFee: z.coerce.number().optional(),
  terms: z.string().optional(),

  lendingPeriod: z.coerce.number().int().optional(),
  lateFee: z.coerce.number().optional(),
  minTrustScore: z.coerce.number().optional(),

  isbn: z.string().min(13, "ISBN contain 13 characters"),
  publisher: z.string().optional(),
  publishedYear: z.coerce.number().int().optional(),
  language: nonEmptyString,
  pageCount: z.coerce.number().int().optional(),

  seriesName: z.string().optional(),
  seriesInstallment: z.coerce.number().int().optional(),
  seriesTotalBooks: z.coerce.number().int().optional(),

  isForSelling: z.boolean().default(false),
});
export type BookFormFields = z.infer<typeof BookSchema>;
export { BookSchema };