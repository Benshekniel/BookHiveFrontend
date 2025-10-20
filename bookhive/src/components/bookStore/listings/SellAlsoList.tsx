import axios from "axios";
import { Search, ChevronDown } from 'lucide-react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { formatDateTime, getConditionBadge, getBookStatusBadge } from "../CommonStuff/CommonFunc.tsx";

import { useAuth } from "../../AuthContext.jsx";
import LoadingSpinner from "../CommonStuff/LoadingSpinner.jsx";

import EditBook from "../Forms/EditBook.tsx";
import DeleteBook from "../Buttons/DeleteBook.tsx";


const SellAlsoList = () => {
	const { user } = useAuth();

	const [searchTerm, setSearchTerm] = useState("");
	const [searchISBN, setSearchISBN] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("");
	const [selectedCondition, setSelectedCondition] = useState("");

	const getSellAlsoList = async () => {
		if (!user?.userId) return [];
		try {
			const response = await axios.get(`http://localhost:9090/api/bs-book/sellAlsoList/${user.userId}`);
			if (response.data.length === 0) return [];
			const booksWithImages = await Promise.all(
				response.data.map(async (book: any) => {
					if (book.coverImage) {
						try {
							const res = await axios.get(`http://localhost:9090/getFileAsBase64`, {
								params: { fileName: book.coverImage, folderName: "BSItem/coverImage" }
							}
							);
							return { ...book, coverImageURL: res.data };
						} catch (err) {
							console.error("Error fetching image: ", err);
							return { ...book, coverImageURL: null }; // fallback
						}
					}
					return book;
				})
			);
			return booksWithImages;
		} catch (err) {
			console.error("Axios Error: ", err);
			throw err;
		}
	};

	const { data: sellAlsoList = [], isPending, error } = useQuery({
		queryKey: ["sellAlsoList", user?.userId],
		queryFn: getSellAlsoList,
		staleTime: 5 * 60 * 1000,       // cache considered fresh for 5 minutes
		enabled: !!user?.userId
	});


	return (
		<>
			<div className="space-y-6">

				<div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
					<div className="flex flex-col lg:flex-row gap-4">

						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<input value={searchTerm}
									type="text" placeholder="Search listings by title, authors, genres, tags..."
									onChange={(e) => setSearchTerm(e.target.value)}
									title="Type something to filter by words..."
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
							</div>
						</div>

						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<input value={searchISBN}
									type="text" placeholder="Search listings by ISBN..."
									onChange={(e) => setSearchISBN(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
							</div>
						</div>

						<div className="flex flex-wrap gap-3">

							<div className="relative">
								<select value={selectedStatus}
									onChange={(e) => setSelectedStatus(e.target.value)}
									title="Filter by book status"
									className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" >
									<option value="">All Status</option>
									<option value="AVAILABLE">Available</option>
									<option value="LENT">Lent</option>
								</select>
								<ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
							</div>

							<div className="relative">
								<select value={selectedCondition}
									onChange={(e) => setSelectedCondition(e.target.value)}
									title="Filter by book's condition'"
									className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" >
									<option value="">All Condtions</option>
									<option value="NEW">New</option>
									<option value="USED">Used</option>
									<option value="FAIR">Fair</option>
								</select>
								<ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
							</div>
						</div>

					</div>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-slate-50 border-b border-gray-200">
								<tr>
									<th className="p-4 font-semibold text-slate-700">BOOK DETAILS</th>
									<th className="p-4 font-semibold text-sm text-slate-700">CONDITION</th>
									<th className="p-4 font-semibold text-slate-700">STATUS</th>
									<th className="p-4 font-semibold text-sm text-slate-700 whitespace-nowrap">LEND FEE</th>
									<th className="p-4 font-semibold text-sm text-slate-700 whitespace-nowrap">SELL PRICE</th>
									<th className="p-4 font-semibold text-sm text-slate-700">LEND TERMS</th>
									<th className="p-4 font-semibold text-sm text-slate-700">CIRCULATIONS</th>
									<th className="p-4 font-semibold text-sm text-slate-700">FAVOURITES</th>
									<th className="p-4 font-semibold text-sm text-slate-700">DATE ADDED</th>
									<th className="p-4 font-semibold text-slate-700">ACTIONS</th>
								</tr>
							</thead>
							<tbody>
								{isPending ? (
									<tr>
										<td colSpan={10} className="text-center py-6 text-gray-500">
											<LoadingSpinner />
										</td>
									</tr>) : error ? (
										<tr>
											<td colSpan={10} className="text-center py-6 text-red-500">
												Server unreachable. Please try again later.
											</td>
										</tr>) : sellAlsoList.length === 0 ? (
											<tr>
												<td colSpan={10} className="text-center py-6 text-gray-400">
													No books found.
												</td>
											</tr>) :
									(sellAlsoList.filter((book) => {
										const term = searchTerm.toLowerCase();
										const matchesSearch =
											book.title?.toLowerCase().includes(term) ||
											book.authors?.some((a: string) => a.toLowerCase().includes(term)) ||
											book.genres?.some((g: string) => g.toLowerCase().includes(term)) ||
											book.isbn?.includes(term) ||
											book.tags?.some((t: string) => t.toLowerCase().includes(term));

										const matchesStatus = !selectedStatus || book.status === selectedStatus;
										const matchesISBN = book.isbn.includes(searchISBN);
										const matchesCondition = !selectedCondition || book.condition === selectedCondition;

										return matchesSearch && matchesStatus && matchesISBN && matchesCondition;
									})
										.map((book) => (
											<tr key={book.inventoryId} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
												<td className="p-4">
													<div className="flex items-center space-x-4">
														<img src={book.coverImageURL} alt={book.title} className="w-15 h-20 object-cover rounded-lg border border-gray-200" />
														<div>
															<p className="whitespace-nowrap">
																<span className="font-semibold text-slate-800">{book.title}</span>
																{book?.seriesName && (
																	<span className="font-semibold text-sm text-slate-500">
																		: {book?.seriesName} # {book?.seriesInstallment}</span>
																)}</p>
															<p className="text-sm text-slate-600">
																by {book?.authors.slice(0, 3).join(', ')}
																{book?.authors.length > 3 && ' ...'}</p>
															<div className="flex flex-col items-start gap-1 mt-1">
																<span className="text-sm text-slate-600">
																	<b> Genres:</b> {book?.genres.slice(0, 3).join(', ')}
																	{book?.genres.length > 3 && ' ...'}</span>
																<span className="text-sm text-slate-500">
																	<b> Tags:</b> {book?.tags.slice(0, 3).join(', ')}
																	{book?.tags.length > 3 && ' ...'}</span>
															</div>
														</div>
													</div>
												</td>
												<td className="p-4 text-center align-middle">
													<div className="flex justify-center items-center h-full">
														{getConditionBadge(book.condition)} </div>
												</td>
												<td className="p-4 text-center align-middle">
													<div className="flex justify-center items-center h-full">
														{getBookStatusBadge(book?.status)} </div>
												</td>
												<td className="p-4 text-center align-middle">
													<div className="flex justify-center items-center h-full">
														Rs. {book.lendFee} </div>
												</td>
												<td className="p-4 text-center align-middle">
													<div className="flex justify-center items-center h-full">
														Rs. {book.sellPrice} </div>
												</td>
												<td className="p-4 align-middle">
													<div className="flex flex-col justify-center items-center gap-1 text-sm text-slate-600 h-full">
														<span className="whitespace-nowrap">Period: {book?.lendingPeriod}</span>
														<span className="whitespace-nowrap">Late fee: Rs. {book?.lateFee}</span>
														<span className="whitespace-nowrap">Min Trust: {book?.minTrustScore}</span>
													</div>
												</td>
												<td className="p-4 text-sm text-slate-600">
													<div className="flex justify-center items-center h-full">
														{book.circulations ?? 0} </div>
												</td>
												<td className="p-4 text-sm text-slate-600">
													<div className="flex justify-center items-center h-full">
														{book.favouritesCount ?? 0} </div>
												</td>
												<td className="p-4 text-sm text-slate-600">
													<div className="flex justify-center items-center h-full">
														{formatDateTime(book.createdAt)} </div>
												</td>

												<td className="p-4">
													<div className="grid grid-cols-2 gap-3 justify-items-center items-center h-full">
														<EditBook bookId={book.bookId} />
														<DeleteBook bookId={book.bookId} />
													</div>
												</td>
											</tr>
										))
									)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>);
};
export default SellAlsoList;

