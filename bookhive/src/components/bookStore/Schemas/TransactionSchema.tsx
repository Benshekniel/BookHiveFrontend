import { z } from "zod";

const TransactionSchema = z.object({
  transactionId: z.coerce.number().int().positive().optional(),

  storeId: z.coerce.number().int(),
  userId: z.coerce.number().int(),

  inventoryId: z.coerce.number().int().optional(),
  bookId: z.coerce.number().int().optional(),

  transactionType: z.enum(["SALE", "LEND", "DONATE", "AUCTION", "RETURN"]),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce.number().optional(),

});
export type TransactionFormFields = z.infer<typeof TransactionSchema>;
export { TransactionSchema };