import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, Eye, MoreHorizontal, Share2, Calendar, CheckCircle, Clock, XCircle, Award, Search, ChevronDown, HandHelping, Trash2 } from 'lucide-react';

import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

import { useAuth } from "../../AuthContext";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import BookView from "./BookView";

const getStatusBadge = (status) => {
	const statusConfigs = {
		'AVAILABLE': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
		'UNAVAILABLE': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: Clock },
		'LENT': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: HandHelping },
		'SOLD': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: CheckCircle },
		'AUCTION': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', icon: Award }
	};

	const config = statusConfigs[status] || statusConfigs['AVAILABLE'];
	const IconComponent = config.icon;

	return (
		<span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
			<IconComponent className="w-3 h-3" />
			<span>{status}</span>
		</span>
	);
};

const getConditionBadge = (condition) => {
	const colorMap = {
		'NEW': 'bg-blue-100 text-blue-800 border-blue-200',
		'USED': 'bg-gray-100 text-gray-800 border-gray-200',
		'FAIR': 'bg-orange-100 text-orange-800 border-orange-200'
	};
	return (
		<span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colorMap[condition] || 'bg-gray-100 text-gray-800 border-gray-200'}`}> {condition} </span>
	);
};

const formatDateTime = (isoString) => {
	const date = new Date(isoString);

	const formattedDate = date.toLocaleDateString("en-GB", {
		year: "numeric", month: "short", day: "2-digit",
	});
	const formattedTime = date.toLocaleTimeString("en-GB", {
		hour: "2-digit", minute: "2-digit", second: "2-digit",
	});
	return `${formattedDate} - ${formattedTime}`;
};

const SalesBookList = () => {
	//   const { user } = useAuth();
	const user = { userId: 603 }; // hard-coded userId until login completed

	const [selectedBookId, setSelectedBookId] = useState(null);
	const [showBookView, setShowBookView] = useState(false);

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("");
	const [selectedCondition, setSelectedCondition] = useState("");

	const inventoryItem = async (bookId) => {
		console.log(bookId)
		const response = await axios.delete(`http://localhost:9090/api/bs-listings/${bookId}`);
		return response.data;
	}

	const inventoryMutation = useMutation({
		mutationFn: ({ bookId }) => inventoryItem(bookId),
		onMutate: () => {
			toast.loading("Moving to inventory...", { id: "deleteToast" });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["regularInventory", user?.userId] });
			toast.success("Successfully moved!", { id: "deleteToast" });
		},
		onError: (error) => {
			console.error(error);
			toast.error("Something went wrong! Please try again later!", { id: "deleteToast" })
		},
	})

	const inventoryItemConfirm = () => {
		Swal.fire({
			title: "Are you sure?",
			text: "Your item will be moved back to Inventory and not be visible to others.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!"
		}).then((result) => {
			if (result.isConfirmed && selectedBookId !== null) {
				console.log(selectedBookId);
				const numbered = Number(selectedBookId)
				inventoryMutation.mutate({ bookId: numbered });
			}
		});
	}

	const getSalesBookList = async () => {
		if (!user?.userId) return [];
		try {
			const response = await axios.get(`http://localhost:9090/api/bs-listings/getBookListingSale/${user.userId}`);
			if (response.data.length === 0) return [];
			const booksWithImages = await Promise.all(
				response.data.map(async (book) => {
					if (book.coverImage) {
						try {
							const res = await axios.get(
								`http://localhost:9090/getFileAsBase64`, {
								params: {
									fileName: book.coverImage, folderName: "BSBook/coverImage"
								}
							}
							);
							return { ...book, coverImageURL: res.data };
						} catch (err) {
							console.error("Axios Error: ", err);
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

	const { data: salesBookList = [], isPending, error } = useQuery({
		queryKey: ["salesBookList", user?.userId],
		queryFn: getSalesBookList,
		staleTime: 5 * 60 * 1000,       // cache considered fresh for 5 minutes
		enabled: !!user?.userId,        // disable retries
		retryDelay: 1000
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
									type="text" placeholder="Search listings by title, author, genres, tags..."
									onChange={(e) => setSearchTerm(e.target.value)}
									title="Type something to filter by words..."
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
									<option value="AUCTION">On Auction</option>
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
									<th className="text-left p-4 font-semibold text-slate-700"> </th>
									<th className="text-left p-4 font-semibold text-slate-700">LISTING DETAILS</th>
									<th className="text-left p-4 font-semibold text-slate-700">PRICE</th>
									<th className="text-left p-4 font-semibold text-slate-700">STATUS</th>
									<th className="text-left p-4 font-semibold text-slate-700">LISTED DATE</th>
									<th className="text-left p-4 font-semibold text-slate-700">COUNT</th>
									<th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th>
								</tr>
							</thead>
							<tbody>
								{isPending ? (
									<tr>
										<td colSpan={7} className="text-center py-6 text-gray-500">
											<LoadingSpinner />
										</td>
									</tr>) : error ? (
										<tr>
											<td colSpan={6} className="text-center py-6 text-red-500">
												Server unreachable. Please try again later.
											</td>
										</tr>) : salesBookList.length === 0 ? (
											<tr>
												<td colSpan={6} className="text-center py-6 text-gray-400">
													No books found.
												</td>
											</tr>) :
									(salesBookList
										.filter((listing) => {
											const term = searchTerm.toLowerCase();
											const matchesSearch =
												listing.title?.toLowerCase().includes(term) ||
												listing.authors?.some(a => a.toLowerCase().includes(term)) ||
												listing.genres?.some(g => g.toLowerCase().includes(term)) ||
												listing.tags?.some(t => t.toLowerCase().includes(term));

											const matchesStatus = !selectedStatus || listing.status === selectedStatus;
											const matchesCondition = !selectedCondition || listing.condition === selectedCondition;

											return matchesSearch && matchesStatus && matchesCondition;
										})
										.map((listing) => (
											<tr key={listing?.bookId} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
												<td className="p-4"> </td>
												<td className="p-4">
													<div className="flex items-center space-x-4">
														<img alt={listing?.title} className="w-12 h-16 object-cover rounded-lg border border-gray-200"
															src={listing?.coverImageURL || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=100&h=150'} />
														<div>
															<h3 className="font-semibold text-slate-800">
																{listing?.title}
															</h3>
															<p className="text-sm text-slate-600">by {listing?.authors.join(', ')}</p>
															<div className="flex items-center space-x-2 mt-1">
																<span className="text-xs text-slate-500">{listing?.genres.join(', ')}</span>
																<span className="text-xs text-slate-400">•</span>
																{getConditionBadge(listing?.condition)}
																<span className="text-xs text-slate-400">•</span>
																<span className="text-xs text-slate-500">
																	{listing?.listingType.replace(/_/g, ' ')}
																</span>
																{/* <span className="text-xs text-slate-400">•</span> */}
															</div>
															<div className="mt-1">
																<span className="text-xs text-slate-500">Tags: {listing?.tags.join(', ')}</span>
															</div>
														</div>
													</div>
												</td>
												<td className="p-4">
													<div className="flex flex-col">
														<span className="font-semibold text-slate-800 text-lg">${listing?.pricing?.sellPrice?.toFixed(2) || 'N/A'}</span>
														{listing?.listingType === 'SELL_AND_LEND' && listing?.pricing?.lendPrice ? (
															<span className="text-sm text-slate-600">Rs. {listing?.pricing?.lendPrice.toFixed(2)}</span>
														) : null}
													</div>
												</td>
												<td className="p-4">{getStatusBadge(listing?.status)}</td>
												<td className="p-4">
													<div className="flex items-center space-x-1">
														<Calendar className="w-4 h-4 text-slate-400" />
														<span className="text-sm text-slate-600">{formatDateTime(listing?.createdAt)}</span>
													</div>
												</td>
												<td>
													<span className="font-semibold text-slate-800 text-md">{listing?.bookCount}</span>
												</td>
												<td className="p-4">
													<div className="flex items-center space-x-2">
														<button className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200 group"
															title="View full book details"
															onClick={() => { setSelectedBookId(listing?.bookId); setShowBookView(true) }}>
															<Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
														</button>
														<button className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200"
															title="Remove item from listings and move back into inventory"
															onClick={() => { setSelectedBookId(listing?.bookId); inventoryItemConfirm(); }}>
															<Trash2 className="w-4 h-4 text-slate-400" />
														</button>
													</div>
												</td>
											</tr>
										)))
								}
							</tbody>
						</table>
					</div>
				</div>

				{showBookView && (<BookView bookId={selectedBookId}
					onClose={() => { setSelectedBookId(null); setShowBookView(false) }} />)}
			</div>
		</>);
};
export default SalesBookList;
