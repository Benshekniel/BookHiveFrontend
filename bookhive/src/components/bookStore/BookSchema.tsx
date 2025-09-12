import { z } from "zod";

const nonEmptyString = z.string()
	.min(1, "Field is required")
	.refine(val => val.trim().length > 0, { message: "Field cannot be just whitespace" })
	.transform(val => val.trim());

const arraySchema = z.string()
	.min(1, "Field is required")
	.refine(val => val.trim().length > 0, { message: "Field cannot be just whitespace" })
	.transform((str) => {
		return str
			.split(",")
			.map(item => item.trim())
			.filter(item => item.length > 0)
			.map(item => item.charAt(0).toUpperCase() + item.slice(1));
	})
	.pipe(z.array(z.string()));

const pricingSchema = z.object({
	sellPrice: z.coerce.number().min(0, "Sale price must be positive"),
	lendPrice: z.coerce.number().min(0, "Lend price must be positive")
}).partial();

const cleanPricingSchema = pricingSchema.transform(data => {
	return Object.fromEntries(
		Object.entries(data).filter(([_, value]) => value !== undefined)
	);
});

const seriesInfoSchema = z.object({
	series: z.string().min(1, "Series name is required"),
	seriesNumber: z.coerce.number().int().positive(),
	totalBooks: z.coerce.number().int().positive()
}).partial();

const imagesSchema = z.any()
	.refine(
		(files) => files &&
			Array.isArray(files) &&
			files.length > 0 && files.length <= 3 &&
			files.every(
				(file) => file instanceof File &&
					["image/jpeg", "image/png", "image/jpg"].includes(file.type)
			), { message: "You can upload up to 3 images (JPEG/PNG only)" }
	);

const optionalString = z.string().optional().or(z.literal("")).transform(val => val || undefined);

const bookSchema = z.object({
	title: nonEmptyString,
	authors: arraySchema,
	genres: arraySchema,
	tags: arraySchema,
	condition: z.enum(["NEW", "USED", "FAIR"]),
	description: nonEmptyString,
	status: z.enum(["AVAILABLE", "INVENTORY", "SOLD", "LENT", "AUCTION"]).optional().nullable(),
	listingType: z.enum(["SELL_ONLY", "LEND_ONLY", "SELL_AND_LEND", "DONATE"]).optional().nullable(),
	pricing: cleanPricingSchema.optional(),
	terms: optionalString,
	isbn: z.string()
		.min(13, "ISBNs contain 13 digits!")
		.refine(val => val.trim().length > 0, { message: "Field cannot be just whitespace" })
		.transform(val => val.trim()),
	publisher: optionalString,
	publishedYear: z.coerce.number().int().positive().optional(),
	language: nonEmptyString,
	pageCount: z.coerce.number().int().positive().optional(),
	lendingPeriod: z.coerce.number().int().positive().optional().or(z.literal("")),
	bookCount: z.coerce.number(),
	seriesInfo: seriesInfoSchema.optional(),
	// coverImage: z.any().refine((file) => file && file[0]
	//                 && ['image/jpeg', 'image/png', 'image/jpg'].includes(file[0].type), 
	//                 'Please upload a valid image (JPEG/PNG)')
	//                 .optional(),
	coverImage: z.any()
		.optional()
		.refine(
			(files) => !files || 
			(files && files[0] && files[0] instanceof File &&
			["image/jpeg", "image/png", "image/jpg"].includes(files[0].type)),
			"Please upload a valid cover image (JPG/JPEG/PNG only)"
		),
	// coverImage: z.any()
	// 	.optional()
	// 	.refine(
	// 		(files) => {
	// 			if (!files) return false;
	// 			if (files instanceof FileList) {
	// 				return files.length > 0 &&
	// 					files[0] instanceof File &&
	// 					['image/jpeg', 'image/png', 'image/jpg'].includes(files[0].type);
	// 			}
	// 			if (files instanceof File) {
	// 				return ['image/jpeg', 'image/png', 'image/jpg'].includes(files.type);
	// 			}
	// 			if (files && files[0]) {
	// 				return files[0] instanceof File &&
	// 					['image/jpeg', 'image/png', 'image/jpg'].includes(files[0].type);
	// 			}
	// 			return false; // Required field, so false if nothing matches
	// 		},
	// 		'Please upload a valid cover image (JPEG/PNG only)'
	// 	),
	images: z.any()
		.optional()
		.refine(
			(files) => !files ||
				(Array.isArray(files) &&
					files.length <= 3 &&
					files.every(
						(file) =>
							file instanceof File &&
							["image/jpeg", "image/png", "image/jpg"].includes(file.type)
					)),
			"You can upload up to 3 images (JPEG/PNG only)"
		)
});
export default bookSchema;