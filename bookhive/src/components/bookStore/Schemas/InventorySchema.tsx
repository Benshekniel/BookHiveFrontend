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

const InventorySchema = z.object({
  title: nonEmptyString,

  authors: commaSeparatedArray,
  genres: commaSeparatedArray,
  tags: commaSeparatedArray,
  category: nonEmptyString,

  condition: z.enum(["NEW", "USED", "FAIR"]).optional(),

  description: nonEmptyString,
  terms: z.string().optional(),

  isbn: z.string().min(13, "ISBN contain 13 characters"),
  publisher: z.string().optional(),
  publishedYear: z.coerce.number().int().optional(),
  language: nonEmptyString,
  pageCount: z.coerce.number().int().optional(),

  seriesName: z.string().optional(),
  seriesInstallment: z.coerce.number().int().optional(),
  seriesTotalBooks: z.coerce.number().int().optional(),

  stockCount: z.coerce.number().int().default(0),
  sellableCount: z.coerce.number().int().default(0),
  sellPrice: z.coerce.number().optional(),
});

export type InventoryFormFields = z.infer<typeof InventorySchema>;
export { InventorySchema };