import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import { useAuth } from "../../AuthContext";
import LoadingSpinner from "../LoadingSpinner";

const LendingBookList = () => {
	// const { user } = useAuth();
	const user = { userId: 603 };

	const getLendingBookList = async () => {
		if (!user?.userId) return [];
		try {
			const response = await axios.get(`http://localhost:9090/api/bs-listings/getBookListingLending/${user.userId}`);
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

	const { data: lendingBookList = [], isPending, error } = useQuery({
		queryKey: ["lendingBookList", user?.userId],
		queryFn: getLendingBookList,
		staleTime: 5 * 60 * 1000,       // cache considered fresh for 5 minutes
		enabled: !!user?.userId,
		retryDelay: 1000
	});

	return (
		<>

		</>);
};
export default LendingBookList;

