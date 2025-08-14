import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Plus } from 'lucide-react';

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
    salePrice: z.coerce.number()
        .min(0, "Sale price must be positive"),
        // .optional(),
    lendPrice: z.coerce.number()
        .min(0, "Lend price must be positive")
        // .optional()
}).partial();

const cleanPricingSchema = pricingSchema.transform(data => {
    return Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
    );
});

const seriesInfoSchema = z.object({
    series: z.string().min(1, "Series name is required"),
    seriesNumber: z.number().int().positive(),
    totalBooks: z.number().int().positive()
}).partial();

const bookSchema = z.object({
    title: nonEmptyString,
    authors: arraySchema,
    genres: arraySchema,
    tags: arraySchema,
    condition: z.enum(["NEW", "USED", "FAIR"]),
    description: nonEmptyString,
    status: z.enum(["UNAVAILABLE", "AVAILABLE", "SOLD", "LENT", "DONATED", "AUCTION"]),
    listingType: z.enum(["SELL_ONLY", "LEND_ONLY", "SELL_AND_LEND", "EXCHANGE", "DONATE"]),
    pricing: cleanPricingSchema,
    terms: nonEmptyString,
    isbn: z.string()
        .min(13, "ISBNs contain 13 digits!")
        .refine(val => val.trim().length > 0, { message: "Field cannot be just whitespace" })
        .transform(val => val.trim())
        .optional(),
    publisher: nonEmptyString,
    publishedYear: z.number(),
    language: nonEmptyString,
    pageCount: z.number(),
    lendingPeriod: z.number().optional(),
    bookCount: z.number(),
    seriesInfo: seriesInfoSchema,
});

type formFields = z.infer <typeof bookSchema>;

const AddBookForm = () => {
    const [showAddBookForm, setShowAddBookForm] = useState(false);

    const [isLendable, setIsLendable] = useState(false);
    const [isSellable, setIsSellable] = useState(false);

    const [isSeries, setIsSeries] = useState(false);

    const {register, handleSubmit, setError, formState: {errors, isSubmitting}, setValue } = useForm ({
        resolver: zodResolver(bookSchema)
    })

    const onSubmit: SubmitHandler<formFields> = async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // toast.success("Submission success!");
            console.log(data)
        }
        catch (error) {
            setError("root", {
                message: "HMM, SOME ROOT ERROR!"
            });
        }
    };

    return (
    <>
        <button 
            onClick={() => setShowAddBookForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-400 text-slate-800 rounded-lg hover:bg-amber-500 transition-colors duration-200 font-medium">
            <Plus className="w-4 h-4" /> <span>Add Book</span>
        </button>

        { showAddBookForm &&
            <form onSubmit={handleSubmit(onSubmit)}>

                <label htmlFor="title">Book Title:</label>
                    <input id="title" {...register("title")} type="text" placeholder="Book Title"/>
                {errors.title && (<div className="errorMsg">{errors.title.message}</div>)}

                <label htmlFor="authors">Authors (separate by commas):</label>
                    <input id="authors" {...register("authors")} placeholder="Book Title"/>
                {errors.authors && (<div className="errorMsg">{errors.authors.message}</div>)}

                <label htmlFor="genres">Genres (separate by commas):</label>
                    <input id="genres" {...register("genres")} placeholder="Book Genres"/>
                {errors.genres && (<div className="errorMsg">{errors.genres.message}</div>)}

                <label htmlFor="tags">Tags (separate by commas):</label>
                    <input id="tags" {...register("tags")} placeholder="Book Tags"/>
                {errors.tags && (<div className="errorMsg">{errors.tags.message}</div>)}

                <label htmlFor="condition">Select the book's condition:</label>
                    <select id="condition" {...register("condition")}>
                        <option value="NEW">New - Never been read</option>
                        <option value="USED">Used - Good readable condition</option>
                        <option value="FAIR">Fair - Shows wear but readable</option>
                    </select>
                {errors.condition && (<div className="errorMsg">{errors.condition.message}</div>)}
                
                <label htmlFor="description">Book Description:</label>
                    <input id="description" {...register("description")} placeholder="Provide a short summary of the book."/>
                {errors.description && (<div className="errorMsg">{errors.description.message}</div>)}

                <label htmlFor="listingType">Select the book's purpose/ listing type:</label>
                    <select id="listingType" {...register("listingType")}>
                            <option value="SELL_ONLY" onSelect={() => setIsSellable(true)}>Sell Only</option>
                            <option value="LEND_ONLY" onSelect={() => setIsLendable(true)}>Lend Only</option>
                            <option value="SELL_AND_LEND" onSelect={() => {setIsLendable(true); setIsLendable(true)}}>Sell & Lend</option>
                            <option value="EXCHANGE">Exchange</option>
                            <option value="DONATE">Donate</option>
                    </select>
                {errors.listingType && (<div className="errorMsg">{errors.listingType.message}</div>)}

                <label htmlFor="status">Make the book available or keep locked in inventory?</label>
                    <select id="status" {...register("status")}>
                            <option value="UNAVAILABLE">Unavailable</option>
                            <option value="AVAILABLE">Available</option>
                    </select>
                {errors.status && (<div className="errorMsg">{errors.status.message}</div>)}

                <label htmlFor="salePrice">Sale Price:</label>
                    <input disabled={!isSellable} id="salePrice" 
                        {...register("pricing.salePrice")} step="0.1" type="number" placeholder="Book Sale Price"/>
                {errors.pricing?.salePrice && (<div className="errorMsg">{errors.pricing?.salePrice.message}</div>)}

                <label htmlFor="lendPrice">Sale Price:</label>
                    <input disabled={!isSellable} id="lendPrice" 
                        {...register("pricing.lendPrice")} step="0.1" type="number" placeholder="Book Lend Price"/>
                {errors.pricing?.lendPrice && (<div className="errorMsg">{errors.pricing?.lendPrice.message}</div>)}
                
                <label htmlFor="terms">Terms:</label>
                    <input id="terms" {...register("terms")} placeholder="Market your book."/>
                {errors.terms && (<div className="errorMsg">{errors.terms.message}</div>)}

                <label htmlFor="lendingPeriod">Lending Period:</label>
                    <input disabled={!isLendable} id="lendingPeriod" type="number" {...register("lendingPeriod")} placeholder="Lending Period "/>
                {errors.lendingPeriod && (<div className="errorMsg">{errors.lendingPeriod.message}</div>)}

                <label htmlFor="isbn">Book ISBN:</label>
                    <input id="isbn" {...register("isbn")} placeholder="The 13-digit unique identifier for the book."/>
                {errors.isbn && (<div className="errorMsg">{errors.isbn.message}</div>)}

                <label htmlFor="publisher">Book Publisher:</label>
                    <input id="publisher" {...register("publisher")} placeholder="Book Publisher"/>
                {errors.publisher && (<div className="errorMsg">{errors.publisher.message}</div>)}
                
                <label htmlFor="publishedYear">Book Published Year:</label>
                    <input id="publishedYear" type="number" {...register("publishedYear")} placeholder="Published Year"/>
                {errors.publishedYear && (<div className="errorMsg">{errors.publishedYear.message}</div>)}

                <label htmlFor="language">Book Language:</label>
                    <input id="language" {...register("language")} placeholder="The language book is written in"/>
                {errors.language && (<div className="errorMsg">{errors.language.message}</div>)}
                
                <label htmlFor="pageCount">Book Published Year:</label>
                    <input id="pageCount" type="number" {...register("pageCount")} placeholder="Page Count"/>
                {errors.pageCount && (<div className="errorMsg">{errors.pageCount.message}</div>)}
                
                <label htmlFor="bookCount">Number of Books:</label>
                    <input id="bookCount" type="number" {...register("bookCount")} min={1} placeholder="Number of Books"/>
                {errors.bookCount && (<div className="errorMsg">{errors.bookCount.message}</div>)}

                <label htmlFor="isSeriesCheck">Is this part of a series?</label>
                    <input id="isSeriesCheck" type="checkbox" checked={isSeries} onChange={() => setIsSeries(!isSeries)} />

                {isSeries && 
                    <div>
                        <label htmlFor="series">Series Name:</label>
                            <input id="series" {...register("seriesInfo.series")} placeholder="Name of the Series"/>
                        {errors.seriesInfo?.series && (<div className="errorMsg">{errors.seriesInfo?.series.message}</div>)}
                        
                        <label htmlFor="seriesNumber">This book's number in the series:</label>
                            <input id="seriesNumber" {...register("seriesInfo.seriesNumber")} min={1} placeholder="This book's number in the series"/>
                        {errors.seriesInfo?.seriesNumber && (<div className="errorMsg">{errors.seriesInfo?.seriesNumber.message}</div>)}

                        <label htmlFor="totalBooks">Total books in the series:</label>
                            <input id="totalBooks" {...register("seriesInfo.totalBooks")} min={2} placeholder="Total books in the series"/>
                        {errors.seriesInfo?.totalBooks && (<div className="errorMsg">{errors.seriesInfo?.totalBooks.message}</div>)}
                    </div>
                }
                
            </form>
        }
    </>)

}
export default AddBookForm;