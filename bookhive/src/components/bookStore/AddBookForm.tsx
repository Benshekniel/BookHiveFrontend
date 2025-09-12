import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Plus, X } from 'lucide-react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuth } from '../AuthContext';
import LoadingSpinner from "./LoadingSpinner";
import bookSchema from "./BookSchema.tsx";

type formFields = z.infer<typeof bookSchema>;

const AddBookForm = () => {
	const queryClient = useQueryClient();

	const [showAddBookForm, setShowAddBookForm] = useState(false);

	const [isLendable, setIsLendable] = useState(true);
	const [isSellable, setIsSellable] = useState(false);
	const [isSeries, setIsSeries] = useState(false);

	const [isDonation, setIsDonation] = useState(false);
	const [inInventory, setInInventory] = useState(true);

	const [coverImagePreview, setCoverImagePreview] = useState(null);

	const { register, handleSubmit, setError, formState: { errors, isSubmitting }, setValue, reset } = useForm({
		resolver: zodResolver(bookSchema),
		defaultValues: {
			bookCount: 1,
			publishedYear: 2025,
			pageCount: 1,
		}
	})

	// const {user} = useAuth();
	const user = { userId: 603 }; // hard-coded userId until login completed

	const TextInput = ({ itemName, type = "text", label, placeholder, enabler = true }:
		{ itemName: any; type?: string; label: string; placeholder?: string; enabler?: any }) => {

		let disableStyle = ""; let hoverStyles = "";

		if (enabler == false) disableStyle = "bg-gray-300";
		else hoverStyles = "hover:bg-gray-50 transition-colors";

		return (
			<div>
				<label htmlFor={itemName}
					className="block text-sm font-medium text-gray-700 mb-2"> {label}: </label>
				<input id={itemName} {...register(itemName)}
					type={type} disabled={!enabler}
					placeholder={placeholder ?? label}
					className={`border border-gray-700 text-gray-700 py-3 px-6 rounded-l font-medium
                        ${disableStyle} ${hoverStyles}`} />
				{errors[itemName] && (<div className="block text-sm font-medium text-red-700 mb-2">{errors[itemName]?.message}</div>)}
			</div>)
	}

	const createBook = async (data: any) => {
		data.userId = user.userId;
		const formData = new FormData();

		formData.append('coverImage', data.coverImage[0]);

		data.coverImage = null;
		const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
		formData.append('bookData', jsonBlob);

		const response = await axios.post(`http://localhost:9090/api/bs-book`,
			formData, { headers: { 'Content-Type': 'multipart/form-data' } });
		return response.data;
	}

	const onSubmit: SubmitHandler<formFields> = async (data) => {
		// handle the image file upload - remove from data and append the file
		console.log(data)
		createMutation.mutate(data);
	};
	const onError = (errors: any) => {
		console.log("❌ validation errors", errors);
	};

	const createMutation = useMutation({
		mutationFn: (data: any) => createBook(data),
		onSuccess: (response) => {
			toast.success(response || "Book created successfully!");
			setShowAddBookForm(false);
		},
		onError: (error) => {
			console.error(error);
			toast.error("Something went wrong! Please try again later!")
		},
	});

	const exitPopup = () => {
		setShowAddBookForm(false);
		reset(); setCoverImagePreview(null)
	}

	useEffect(() => {
		console.log(register['listingType'])
	}, [register['listingType']])

	return (
		<>
			<button onClick={() => setShowAddBookForm(true)}
				className="flex items-center space-x-2 px-4 py-2 bg-amber-400 text-slate-800 rounded-lg hover:bg-amber-500 transition-colors duration-200 font-medium">
				<Plus className="w-4 h-4" />
				<span>Add Book(s)</span>
			</button>

			{showAddBookForm &&
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<h2 className="text-2xl font-bold text-gray-900"> Add New Book </h2>
							<button className="p-2 hover:bg-gray-100 rounded-full transition-colors"
								onClick={() => exitPopup()}>
								<X className="w-5 h-5 text-gray-500" />
							</button>
						</div>

						<form onSubmit={handleSubmit(onSubmit, onError)} className="p-6 space-y-4">

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
										placeholder="Provide a short description about the book, like a plot summary." />
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

								<label htmlFor="donate" className="block text-sm font-medium text-gray-700 m-auto"> For Donation </label>
								<input id="donate"
									type="checkbox"
									onChange={(e) => {
										 if (e.target.checked) {
											setValue("listingType", "DONATE");
											setIsDonation(true);
											setInInventory(true);
										} else {
											setValue("listingType", null); // or "" or remove the field entirely
											setIsDonation(false);
										}
									}} />

								{!isDonation && (
									<>
									<label htmlFor="status" className="block text-sm font-medium text-gray-700 m-auto">
										Keep the book locked in inventory or make available for listing?</label>
									<select id="status"
										className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium"
										onChange={e => {
											const value = e.target.value;
											setValue("listingType", value);
											if (value === "INVENTORY") setInInventory(true);
											else if (value === "AVAILABLE") setInInventory(false);
										}}>
										<option value="INVENTORY">Unavailable</option>
										<option value="AVAILABLE">Available</option>
									</select>
									</>
								)}

								{!inInventory && (
									<>
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
												}
											}}>
											<option value="LEND_ONLY">Lend Only</option>
											<option value="SELL_ONLY">Sell Only</option>
											<option value="SELL_AND_LEND">Sell & Lend</option>
										</select>

										<TextInput itemName={"pricing.lendPrice"} label={"Lending Price"} type={"number"} enabler={isLendable} />
										<TextInput itemName={"pricing.sellPrice"} label={"Sale Price"} type={"number"} enabler={isSellable} />

										<TextInput itemName={"lendingPeriod"} label={"Lending Period (in Days)"} type={"number"} enabler={isLendable} />

										<div className="col-span-2">
											<label htmlFor="terms">
												Terms:</label>
											<textarea id="terms" rows={2} {...register("terms")}
												className="w-full px-4 py-3 border border-black rounded-l"
												placeholder="Market your book. Tell your potential customers of any specific conditions." />
											{errors.terms && (<div className="block text-sm font-medium text-red-700 mb-2">{errors.terms.message}</div>)}
										</div>
									</>
								)}


							</div>

							<div className="bg-gray-50 rounded-xl py-6 px-10">
								<label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
									Book Cover Image </label>
								{coverImagePreview && (
									<img className="w-32 h-48 object-cover rounded-lg border shadow-sm my-2 m-auto"
										src={coverImagePreview} alt="Book cover preview" />
								)}
								<div className="mt-1">
									<input id="coverImage"
										type="file" accept="image/*"
										className="w-full px-3 py-2 border rounded-lg focus:outline-none"
										style={{ borderColor: '#D1D5DB' }}
										// {...register("coverImage")}
										// // *************
										// // IGNORE THESE 2 WARNINGS, IT'LL WORK
										// onChange={(e) => {
										// 	const file = e.target.files[0];
										// 	if (file) setCoverImagePreview(URL.createObjectURL(file));
										//  else setCoverImagePreview(null);
										// }}
										// // *************
										{...register("coverImage", { required: "Cover image is required" })}
										onChange={(e) => {
												register("coverImage").onChange(e);
												
												const file = e.target.files?.[0];
												// *************
												// IGNORE THESE 2 WARNINGS, IT'LL WORK
												if (file) setCoverImagePreview(URL.createObjectURL(file));
												else setCoverImagePreview(null);
										}}
										onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
										onBlur={(e) => (e.target.style.boxShadow = 'none')} />
									{errors.coverImage && (<div className="block text-sm font-medium text-red-700 mb-2">{errors.coverImage.message}</div>)}
									{/* ************* */}
								</div>
							</div>

							<div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
								<h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
									Series details</h4>

								<label htmlFor="isSeriesCheck">Is this book part of a series?</label>
								<input id="isSeriesCheck" type="checkbox" checked={isSeries} onChange={() => setIsSeries(!isSeries)} />

								{isSeries &&
									<>
										<TextInput itemName={"seriesInfo.series"} label={"Series Name"} />
										<span></span>
										<TextInput itemName={"seriesInfo.seriesNumber"} label={"This book's number in the series"} type={"number"} />
										<TextInput itemName={"seriesInfo.totalBooks"} label={"Total books in the series"} type={"number"} />
									</>
								}
							</div>

							{/* This property only editable for sell_only */}
							{/* {!isLendable && ( */}
							<div className="bg-gray-50 rounded-xl py-6 px-10">
								<h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
									How many booking are you adding to the inventory?</h4>

								<TextInput itemName={"bookCount"} label={"Number of Books"} type={"number"} />
							</div>
							{/* )} */}

							<button disabled={isSubmitting} type="submit"
								className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
								{isSubmitting ? <LoadingSpinner /> : 'Add Book'}
							</button>
						</form>
					</div>
				</div>
			}
		</>)

}
export default AddBookForm;