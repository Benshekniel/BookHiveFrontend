import axios from "axios";
import { Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { BookSchema, BookFormFields } from "../Schemas/BookSchema";
import LoadingSpinner from "../CommonStuff/LoadingSpinner";
import { useAuth } from "../../AuthContext";

const EditBook = ({ bookId }: { bookId: number }) => {
  const {user} = useAuth();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);

  const [isForSelling, setIsForSelling] = useState(false);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageManyChanged, setImageManyChanged] = useState(false);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:9090/api/bs-book/bookOne/${bookId}`);
      const item = response.data;
      console.log(response.data);

      // Cover image
      if (item.coverImage) {
        const coverImgRes = await axios.get(`http://localhost:9090/getFileAsBase64`, {
          params: { fileName: item.coverImage, folderName: "BSItem/coverImage" }
        });
        setCoverPreviewUrl(coverImgRes.data);
      }

      // Book images (array)
      if (item.images && Array.isArray(item.images)) {
        const imagePromises = item.images.map( (imgName: string) =>
          axios.get(`http://localhost:9090/getFileAsBase64`, {
            params: { fileName: imgName, folderName: "BSItem/images" }
          }).then(res => res.data)
        );
        const imageUrls = await Promise.all(imagePromises);
        setPreviewUrls(imageUrls);
      }

      return item;
    }
    catch (err) {
      console.error("Axios Error: ", err);
      throw err;
    }
  };

  const { data: currentBook, isPending } = useQuery({
    queryKey: ["currentBook", bookId],
    queryFn: fetchBook,
    enabled: !!bookId,
  });

  useEffect(() => {
    if (!isPending) {
      reset();
    }
  }, [currentBook])

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: zodResolver(BookSchema),
    defaultValues: currentBook,
  });

  useEffect(() => {
    if (currentBook) {
      reset(currentBook);
    }
  }, [currentBook, reset]);

  const TextInput = ({ itemName, type = "text", label, placeholder, full }:
    { itemName: keyof BookFormFields; type?: string; label: string; placeholder?: string; full?: boolean }) => (
    <div className={full ? "col-span-2" : ""}>
      <label htmlFor={itemName as string} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input id={itemName as string}
        {...register(itemName)}
        type={type}
        placeholder={placeholder ?? label.endsWith("*") ? label.slice(0, -1).trim() : label}
        className={`border border-gray-700 text-gray-700 py-3 px-6 rounded-l font-medium hover:bg-gray-50 transition-colors ${full && 'w-full'}`}
      />
      {errors[itemName] && (
        <div className="block text-sm font-medium text-red-700 mb-2">
          {errors[itemName]?.message as string}
        </div>
      )}
    </div>
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverPreviewUrl(URL.createObjectURL(file));
    }
  };
  const removeImage = () => {
    setCoverImage(null);
    setCoverPreviewUrl(null);
  };

  const handleImageChangeMany = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newFiles = [...images, ...files].slice(0, 3); // max 3

    setImages(newFiles);
    setPreviewUrls(newFiles.map(file => URL.createObjectURL(file)));
  };
  const removeImageFromMany = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previewUrls];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const editInventory = async (editItemData: BookFormFields, coverImage: File) => {
    const formData = new FormData();

    const dataExtended = { ...editItemData, bookId, isForSelling };
    const jsonBlob = new Blob([JSON.stringify(dataExtended)], {
      type: "application/json",
    });

    formData.append("editBookData", jsonBlob);
    imageChanged && formData.append("coverImage", coverImage);
    if (imageManyChanged) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await axios.put(`http://localhost:9090/api/bs-book/edit`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  };

  const editMutation = useMutation({
    mutationFn: (data: BookFormFields) => editInventory(data, coverImage as File),
    onSuccess: () => {
      toast.success("Book details edited successfully!");
      queryClient.invalidateQueries({ queryKey: ["lendOnlyList", user?.userId] });
      queryClient.invalidateQueries({ queryKey: ["sellAlsoList", user?.userId] });
      setShowForm(false);
    },
    onError: () => {
      toast.error("Something went wrong! Please try again later!");
    },
  });

  const onSubmit: SubmitHandler<BookFormFields> = (data) => {
    try {
      if ((!coverImage && imageChanged) || (coverPreviewUrl == null)) {
        toast.error("Please upload a cover image before submitting.");
        throw new Error("Cover image is required");
      }
      if (!imageManyChanged && previewUrls.length === 0 && images.length === 0) {
        toast.error("Please upload at least one book image before submitting.");
        throw new Error("At least one book image is required");
      }
      console.log(data);
      editMutation.mutate(data);
    }
    catch (e) {
      console.error("Form error: " + e)
    };
  };

  const onError = (errors: any) => {
    console.log("❌ validation errors", errors);
  };

  const exitPopup = () => {
    setShowForm(false);
    removeImage();
    queryClient.invalidateQueries({ queryKey: ["currentBook", bookId] });
    reset();
  };

  return (
    <>
      <button className="p-2 bg-blue-100 border border-blue-200 hover:bg-blue-200 rounded-lg transition-colors duration-200"
        title="Edit book details"
        onClick={() => { setShowForm(true); }} >
        <Edit className="w-5 h-5 text-slate-600" />
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Inventory</h2>
              <button onClick={exitPopup}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors" >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="p-6 space-y-4">

              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl py-6 px-10 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Cover Image</h4>
                {coverPreviewUrl ? (
                  <div className="flex flex-col items-center">
                    <img className="w-40 h-56 object-cover rounded-xl shadow-md mb-4"
                      src={coverPreviewUrl} alt="Preview" />
                    <button type="button" onClick={removeImage}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors" >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-40 h-56 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                    <span className="text-gray-500">Upload Image</span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => { handleImageChange(e); setImageChanged(true); }} />
                  </label>
                )}
              </div>

              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                  Basic Information
                </h4>
                <TextInput itemName="title" label="Book Title *" />
                <TextInput itemName="authors" label="Authors (comma separated) *" />
                <TextInput itemName="genres" label="Genres (comma separated) *" full={true} />
                <TextInput itemName="tags" label="Tags (comma separated) *" full={true} />

                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Book Description * </label>
                  <textarea id="description"
                    rows={3} {...register("description")}
                    className="w-full px-4 py-3 border border-black rounded-l text-gray-700"
                    placeholder="Provide a short description about the book"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-2">
                    Terms: </label>
                  <textarea id="terms"
                    rows={3} {...register("terms")}
                    className="w-full px-4 py-3 border border-black rounded-l text-gray-700"
                    placeholder="Market your book. Tell your potential customers of any specific conditions."
                  />
                </div>

                <TextInput itemName="isbn" label="Book ISBN *" />
                <TextInput itemName="language" label="Language *" />
                <TextInput itemName="publisher" label="Publisher" />
                <TextInput itemName="publishedYear" label="Published Year" type="number" />
                <TextInput itemName="pageCount" label="Page Count" type="number" />
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl py-6 px-10 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Book Images (min 1, max 3)</h4>

                <div className="flex gap-4 flex-wrap justify-center">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img alt={`Preview ${index + 1}`}
                        className="w-32 h-48 object-cover rounded-xl shadow-md mb-2"
                        src={url} />
                      <button type="button" onClick={() => {removeImageFromMany(index); setImageManyChanged(true); }}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm" >
                        Remove
                      </button>
                    </div>
                  ))}

                  {images.length < 3 && (
                    <label className="flex flex-col items-center justify-center w-32 h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                      <span className="text-gray-500">Upload</span>
                      <input type="file" accept="image/*"
                        multiple className="hidden"
                        onChange={e => { handleImageChangeMany(e); setImageManyChanged(true); }} />
                    </label>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                  Pricing </h4>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                    Select the book's condition: </label>
                  <select id="condition" {...register("condition")}
                    className="border border-gray-700 text-gray-700 py-3 px-3 rounded-l font-medium hover:bg-gray-50 transition-colors">
                    <option value="NEW">New - Never been read</option>
                    <option value="USED">Used - Good readable condition</option>
                    <option value="FAIR">Fair - Shows wear but readable</option>
                  </select>
                </div>
                <div></div>

                <TextInput itemName="lendFee" label="Lending Fee (Rs.)" type="number" />
                <TextInput itemName="lendingPeriod" label="Lending Period (days)" type="number" />
                <TextInput itemName="lateFee" label="Late Fee (Rs.)" type="number" />
                <TextInput itemName="minTrustScore" label="Minimum Trust Score" type="number" />

                <label htmlFor="isForSelling" className="block text-md font-medium text-gray-700 mb-2">
                  Is the book for sale also? </label>
                <input id="isForSelling" type="checkbox" checked={isForSelling}
                  onChange={() => setIsForSelling(!isForSelling)} className="m-2 rounded-5" />

                {isForSelling && (<>
                  <TextInput itemName="sellPrice" label="Selling Price (Rs.)" type="number" />
                </>)}

              </div>

              {/* Series Details */}
              <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                  Series Details
                </h4>
                <TextInput itemName="seriesName" label="Series Name" />
                <TextInput itemName="seriesInstallment" label="Series Installment" type="number" />
                <TextInput itemName="seriesTotalBooks" label="Total Books in Series" type="number" />
              </div>

              <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 flex justify-center p-4">
                <button type="submit"
                  disabled={editMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed" >
                  {editMutation.isPending ? <LoadingSpinner /> : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditBook;
