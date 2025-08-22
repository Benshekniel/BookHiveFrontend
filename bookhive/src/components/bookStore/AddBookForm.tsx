import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { useAuth } from '../../App';

import { Plus, X } from 'lucide-react';

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
    lendPrice: z.coerce.number()
        .min(0, "Lend price must be positive")
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
        .transform(val => val.trim()),
    publisher: nonEmptyString,
    publishedYear: z.number(),
    language: nonEmptyString,
    pageCount: z.number(),
    lendingPeriod: z.number(),
    bookCount: z.number(),
    seriesInfo: seriesInfoSchema,
    images: z.instanceof(File)
        .refine(file => file.type.startsWith("image/"), { message: "Only image files are allowed" })
        .optional(),
});

type formFields = z.infer <typeof bookSchema>;

const AddBookForm = () => {
    const [showAddBookForm, setShowAddBookForm] = useState(false);

    const [isLendable, setIsLendable] = useState(true);
    const [isSellable, setIsSellable] = useState(false);

    const [isSeries, setIsSeries] = useState(false);

    const {register, handleSubmit, setError, formState: {errors, isSubmitting}, setValue } = useForm ({
        resolver: zodResolver(bookSchema)
    })

    const user = useAuth();
    console.log(user);

    // const handleFileUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //         setNewBook({
    //         ...newBook,
    //         imageUrls: file.name,
    //         cover: reader.result
    //         });
    //     };
    //     reader.readAsDataURL(file);
    //     }
    // };
    
    // useEffect(() => {
    //     setValue("title", "");
    //     setValue("authors", "");
    //     setValue("genres", "");
    //     setValue("tags", "");
    //     setValue("condition", undefined);
    //     setValue("description", "");
    //     setValue("status", undefined);
    //     setValue("listingType", undefined);
    //     setValue("pricing.salePrice", undefined);
    //     setValue("pricing.lendPrice", undefined);
    //     setValue("terms", "");
    //     setValue("isbn", "");
    //     setValue("publisher", "");
    //     setValue("publishedYear", undefined);
    //     setValue("language", "");
    //     setValue("pageCount", undefined);
    //     setValue("lendingPeriod", undefined);
    //     setValue("bookCount", undefined);
    //     setValue("seriesInfo.series", "");
    //     setValue("seriesInfo.seriesNumber", undefined);
    //     setValue("seriesInfo.totalBooks", undefined);
    // }, [showAddBookForm]);

    const TextInput = ({ itemName, type="text", label, placeholder, enabler=true }: 
        { itemName: any; type?: string; label: string; placeholder?: string; enabler?: any }) => {

            let disableStyle = ""; let hoverStyles = "";
            
            if (enabler == false) disableStyle = "bg-gray-300";
            else hoverStyles = "hover:bg-gray-50 transition-colors";

        return (
        <div>
            <label htmlFor={itemName}
                className="block text-sm font-medium text-gray-700 mb-2"> {label}: </label>
                <input id = {itemName} {...register(itemName)} 
                    type = {type} disabled = {!enabler}
                    placeholder = {placeholder ?? label}
                    className = {`border border-gray-700 text-gray-700 py-3 px-6 rounded-l font-medium
                        ${disableStyle} ${hoverStyles}`} />
            {errors[itemName] && (<div className="block text-sm font-medium text-red-700 mb-2">{errors[itemName]?.message}</div>)}
        </div>)
    }

    const onSubmit: SubmitHandler<formFields> = async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // toast.success("Submission success!");
            // console.log(data)
        }
        catch (error) {
            setError("root", {
                message: "HMM, SOME ROOT ERROR!"
            });
        }
    };

    return (
    <>
        <button onClick={() => setShowAddBookForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-400 text-slate-800 rounded-lg hover:bg-amber-500 transition-colors duration-200 font-medium">
            <Plus className="w-4 h-4" />
                <span>Add Book</span>
        </button>

        { showAddBookForm &&
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300 bg-opacity-20 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900"> Add New Book </h2>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={() => setShowAddBookForm(false)}>
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                        
                        <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                                Basic Information</h4>

                            <TextInput itemName={"title"} label={"Book Title"} />
                            <TextInput itemName={"authors"} label={"Authors (separate by commas)"} placeholder={"Book Authors"} />

                            <TextInput itemName={"genres"} label={"Genres (separate by commas)"} placeholder={"Book Genres"} />
                            <TextInput itemName={"tags"} label={"Tags (separate by commas)"} placeholder={"Book Tags"} />
                        
                            <div className="col-span-2">
                                <label htmlFor="description">
                                    Book Description:</label>
                                    <textarea id="description" rows={4} {...register("description")}
                                        className="w-full px-4 py-3 border border-black rounded-l"
                                        placeholder="Provide a short description about the book, like a plot summary."/>
                                {errors.description && (<div className="block text-sm font-medium text-red-700 mb-2">{errors.description.message}</div>)}
                            </div>
                            
                            <TextInput itemName={"isbn"} label={"Book ISBN"} />
                            <TextInput itemName={"language"} label={"Language"} />

                            <TextInput itemName={"publisher"} label={"Book Publisher"} />
                            <TextInput itemName={"publishedYear"} label={"Published Year"} type={"number"} />
                    
                            <TextInput itemName={"pageCount"} label={"Page Count"} type={"number"} />
                        </div>

                        <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                                Availability & Pricing</h4>

                            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 m-auto">
                                Select the book's condition: </label>
                                <select id="condition" {...register("condition")}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                                    <option value="NEW">New - Never been read</option>
                                    <option value="USED">Used - Good readable condition</option>
                                    <option value="FAIR">Fair - Shows wear but readable</option>
                                </select>

                            <label htmlFor="listingType" className="block text-sm font-medium text-gray-700 m-auto">
                                Select the book's purpose/ listing type:</label>
                                <select id="listingType" {...register("listingType")}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                    onChange={e => {
                                        const value = e.target.value;
                                        if (value === "SELL_ONLY") {
                                            setIsSellable(true); setIsLendable(false);
                                        } else if (value === "LEND_ONLY") {
                                            setIsSellable(false); setIsLendable(true);
                                        } else if (value === "SELL_AND_LEND") {
                                            setIsSellable(true); setIsLendable(true);
                                        } else {
                                            setIsSellable(false); setIsLendable(false);
                                        }
                                    }}>
                                    <option value="LEND_ONLY">Lend Only</option>
                                    <option value="SELL_ONLY">Sell Only</option>
                                    <option value="SELL_AND_LEND">Sell & Lend</option>
                                    <option value="EXCHANGE">Exchange</option>
                                    <option value="DONATE">Donate</option>
                                </select>

                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 m-auto">
                                Make the book available or keep locked in inventory?</label>
                                <select id="status" {...register("status")}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                                        <option value="UNAVAILABLE">Unavailable</option>
                                        <option value="AVAILABLE">Available</option>
                                </select>


                            <TextInput itemName={"lendPrice"} label={"Lending Price"} type={"number"} enabler={isLendable}/>
                            <TextInput itemName={"salePrice"} label={"Sale Price"} type={"number"} enabler={isSellable}/>

                            <TextInput itemName={"lendingPeriod"} label={"Lending Period"} type={"number"} />
                                
                            <div className="col-span-2">
                                <label htmlFor="terms">
                                    Terms:</label>
                                    <textarea id="terms" rows={4} {...register("description")}
                                        className="w-full px-4 py-3 border border-black rounded-l"
                                        placeholder="Market your book. Tell your potential customers of any specific conditions."/>
                                {errors.terms && (<div className="block text-sm font-medium text-red-700 mb-2">{errors.terms.message}</div>)}
                            </div>
                        
                        </div>

                        {/* <div className="bg-gray-50 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Book Image</h4>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Book Cover <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        // onChange={handleFileUpload}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Upload a clear image of the book cover (JPEG, PNG, max 5MB)</p>
                                </div>
                                {newBook.cover && (
                                    <div className="flex-shrink-0">
                                        <img
                                        src={newBook.cover}
                                        alt="Book cover preview"
                                        className="w-32 h-40 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                        type="button"
                                        onClick={() => setNewBook({ ...newBook, imageUrls: '', cover: "" })}
                                        className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
                                        >
                                        Remove Image
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div> */}


                        <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                                Series details</h4>

                            <label htmlFor="isSeriesCheck">Is this book part of a series?</label>
                            <input id="isSeriesCheck" type="checkbox" checked={isSeries} onChange={() => setIsSeries(!isSeries)} />

                            {isSeries && 
                                <>
                                    <TextInput itemName={"series"} label={"Series Name"} />
                                        <span></span>
                                    <TextInput itemName={"seriesNumber"} label={"This book's number in the series"} type={"number"} />
                                    <TextInput itemName={"totalBooks"} label={"Total books in the series"} type={"number"} />
                                </>
                            }
                        </div>

                        <div className="bg-gray-50 rounded-xl py-6 px-10">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                                How many booking are you adding to the inventory?</h4>

                            <TextInput itemName={"bookCount"} label={"Number of Books"} type={"number"} />
                        </div>
                    
                        <button disabled={isSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Adding Book...' : 'Add Book'}
                        </button>
                    </form>
                </div>
            </div>
        }
    </>)

}
export default AddBookForm;