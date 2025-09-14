import axios from "axios";
import { z } from "zod";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

import bookSchema from "../BookSchema";

interface BookViewProps {
  bookId: number;
  onClose: () => void;
}

const fetchBookDetails = async (bookId: number) => {
  try {
    const response = await axios.get(`http://localhost:9090/api/bs-book/book/${bookId}`);
    const book = response.data;

    let coverImageURL: string | null = null;
    if (book.coverImage) {
      const coverImgRes = await axios.get(`http://localhost:9090/getFileAsBase64`,
        { params: { fileName: book.coverImage, folderName: "BSBook/coverImage" } });
      coverImageURL = coverImgRes.data;
    }

    let imageURLs: string[] = [];
    if (Array.isArray(book.images) && book.images.length > 0) {
      imageURLs = await Promise.all(
        book.images.map(async (img: string) => {
          const res = await axios.get(`http://localhost:9090/getFileAsBase64`,
            { params: { fileName: img, folderName: "BSBook/coverImage" } });
          return res.data;
        })
      );
    }
    return { ...book, coverImageURL, imageURLs, };
  }
  catch (err) {
    console.error("Axios Error: ", err);
    throw err;
  }
};

const updateBookDetails = async (bookId: number, data: any) => {
  console.log("mutating with:", data);

  const formData = new FormData();
  formData.append('coverImage', data.coverImage[0]);
  formData.append('images', data.images);

  data.coverImage = null; data.images = null;
  const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  formData.append('bookData', jsonBlob);

  console.log(data);
  const response = await
    axios.put(`http://localhost:9090/api/bs-book/${bookId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return response.data;

}

// component itself:
const BookView: React.FC<BookViewProps> = ({ bookId, onClose }) => {
  const queryClient = useQueryClient();

  const { data: book, isPending, error } = useQuery({
    queryKey: ["bookDetails", bookId],
    queryFn: () => fetchBookDetails(bookId),
    enabled: !!bookId,
  });

  const [isEditing, setIsEditing] = useState(false);

  const [isLendable, setIsLendable] = useState(false);
  const [isSellable, setIsSellable] = useState(false);
  const [isSeries, setIsSeries] = useState(false);

  useEffect(() => {
    if (book) {
      setIsLendable(!!book.pricing?.lendPrice);
      setIsSellable(!!book.pricing?.salePrice);
      setIsSeries(!!book.seriesInfo);
    }
  }, [book]);

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting }, setValue } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: book,
  });

  const getErrorMessage = (errors: any, itemName: string) => {
    const keys = itemName.split('.');
    let error = errors;
    for (const key of keys) {
      error = error?.[key];
      if (!error) return null;
    }
    return error?.message;
  };

  type formFields = z.infer<typeof bookSchema>;

  const onSubmit: SubmitHandler<formFields> = async (data: any) => {
    console.log("Updated book: ", data);
    updateMutation.mutate({ bookId, data });
  };

  const updateMutation = useMutation({
    mutationFn: ({ bookId, data }: { bookId: number; data: any }) => updateBookDetails(bookId, data),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['bookDetails', bookId] });
      reset();
      toast.success("Successfully updated!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong! Please try again later!")
    },
  })

  useEffect(() => {
    if (book)
      reset({
        ...book,
        authors: book.authors?.join(", ") || "",
        genres: book.genres?.join(", ") || "",
        tags: book.tags?.join(", ") || "",
      });
  }, [book, reset]);

  function getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }
  const BookProperty = ({ itemName, type = "text", label, enabler = true }:
    { itemName: any; type?: string; label: string; enabler?: any }) => {

    let disableStyle = ""; let hoverStyles = "";

    if (enabler == false) disableStyle = "bg-gray-300";
    else hoverStyles = "hover:bg-gray-50 transition-colors";

    const propertyValue = getNestedValue(book, itemName);
    const displayValue = Array.isArray(propertyValue)
      ? propertyValue.join(", ")
      : propertyValue ?? "-";

    return (
      <div>
        <label htmlFor={itemName}
          className="block text-md font-medium text-gray-700 mb-2"> {label}: </label>
        {isEditing ? (
          <input id={itemName} {...register(itemName)}
            type={type} disabled={!enabler}
            placeholder={label}
            className={`border border-gray-700 text-gray-700 py-3 px-6 rounded-l font-medium
                    ${disableStyle} ${hoverStyles}`} />
        ) : (
          <p className="text-gray-800"> {displayValue} </p>
        )}
        {errors[itemName] && (
          <div className="block text-sm font-medium text-red-700 mb-2"> {getErrorMessage(errors, itemName)} </div>
        )}
        <br />
      </div>)
  }

  // const notify = () => toast('Here is your toast.'); // for testing toast

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-100">
          <h2 className="text-2xl font-bold text-gray-900"> Book Details </h2>
						<button onClick={onClose}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors" >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {isPending ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Failed to load book details.</div>
        ) : !book ? (
          <div className="text-center py-10 text-gray-400">Book not found.</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit, (errors) => console.log("form errors", errors))} className="p-6 space-y-4">

            <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* <input id="coverImage" type="file" {...register("coverImage")} className="display-hidden"/>  */}
              {/* <label htmlFor="coverImage"> */}
              <img className="w-32 h-48 object-cover rounded-lg border shadow-sm m-auto" alt={book.title}
                src={book?.coverImageURL || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=100&h=150'} />
              {/* </label> */}

              <div className="flex flex-wrap gap-2 justify-center">
                {book?.imageURLs?.map((img, index) => (
                  <img key={index}
                    className="w-20 h-28 object-cover rounded-md border shadow-sm"
                    alt={`${book.title} - ${index + 1}`}
                    src={img || "https://via.placeholder.com/100x150.png?text=No+Image"} />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                Basic Information</h4>

              <BookProperty itemName={"title"} label={"Title"} />
              <BookProperty itemName={"authors"} label={"Authors (separate by commas)"} />
              <BookProperty itemName={"genres"} label={"Genres (separate by commas)"} />
              <BookProperty itemName={"tags"} label={"Tags (separate by commas)"} />

              <div className="col-span-2">
                <label htmlFor="description">
                  Book Description:</label>
                {isEditing ? (
                  <>
                    <textarea id="description" rows={4} {...register("description")}
                      className="w-full px-4 py-3 border border-black rounded-l"
                      placeholder="Provide a short description about the book, like a plot summary." />
                    {errors.description && (
                      <div className="block text-sm font-medium text-red-700 mb-2"> {getErrorMessage(errors, "description")} </div>
                    )}
                  </>
                ) : (<p className="text-gray-800">{book.description}</p>)}
              </div>

              <BookProperty itemName={"isbn"} label={"Book ISBN"} />
              <BookProperty itemName={"language"} label={"Language"} />

              <BookProperty itemName={"publisher"} label={"Book Publisher"} />
              <BookProperty itemName={"publishedYear"} label={"Published Year"} type={"number"} />

              <BookProperty itemName={"pageCount"} label={"Page Count"} type={"number"} />
            </div>

            <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                Availability & Pricing</h4>

              <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                {isEditing ? "Select the book's condition:" : "Book's Condition"}: </label>
              {isEditing ? (
                <select id="condition" {...register("condition")}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  <option value="NEW">New - Never been read</option>
                  <option value="USED">Used - Good readable condition</option>
                  <option value="FAIR">Fair - Shows wear but readable</option>
                </select>
              ) : (<p className="text-gray-800">{book.condition}</p>)}

              <label htmlFor="listingType" className="block text-sm font-medium text-gray-700">
                {isEditing ? "Select the book's purpose/ listing type" : "Listing type:"}: </label>
              {isEditing ? (
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
              ) : (<p className="text-gray-800">{book.listingType}</p>)}

              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                {isEditing ? "Make the book available or keep locked in inventory?" : "Availability"}: </label>
              {isEditing ? (
                <select id="status" {...register("status")}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  <option value="UNAVAILABLE">Unavailable</option>
                  <option value="AVAILABLE">Available</option>
                </select>
              ) : (<p className="text-gray-800">{book.status}</p>)}

              <BookProperty itemName={"pricing.lendPrice"} label={"Lending Price (Rs.)"} type={"number"} enabler={isLendable} />
              <BookProperty itemName={"pricing.sellPrice"} label={"Sale Price (Rs.)"} type={"number"} enabler={isSellable} />

              <BookProperty itemName={"lendingPeriod"} label={"Lending Period (in Days)"} type={"number"} enabler={isLendable} />

              <div className="col-span-2">
                <label htmlFor="terms">
                  Terms:</label>
                {isEditing ? (<>
                  <textarea id="terms" rows={2} {...register("terms")}
                    className="w-full px-4 py-3 border border-black rounded-l"
                    placeholder="Market your book. Tell your potential customers of any specific conditions." />
                  {errors.terms && (
                    <div className="block text-sm font-medium text-red-700 mb-2"> {getErrorMessage(errors, "terms")} </div>
                  )} </>
                ) : (<p className="text-gray-800">{book.terms}</p>)}
              </div>

            </div>

            <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                Series details</h4>

              <label htmlFor="isSeriesCheck">Is this book part of a series?</label>
              <input id="isSeriesCheck" type="checkbox" checked={isSeries} onChange={() => setIsSeries(!isSeries)} />

              {isSeries && <>
                <BookProperty itemName={"seriesInfo.series"} label={"Series Name"} />
                <span></span>
                <BookProperty itemName={"seriesInfo.seriesNumber"} label={"This book's number in the series"} type={"number"} />
                <BookProperty itemName={"seriesInfo.totalBooks"} label={"Total books in the series"} type={"number"} />
              </>}
            </div>

            {/* This property only editable for sell_only */}
            {!isLendable && (
              <div className="bg-gray-50 rounded-xl py-6 px-10">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2"> Book Count: </h4>
                <BookProperty itemName={"bookCount"} label={"Number of Books"} type={"number"} />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button type="button" onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" >
                    Cancel
                  </button>
                  <button type="submit" disabled={updateMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {updateMutation.isPending ? "Saving details..." : "Save"}
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" >
                  Edit
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default BookView;
