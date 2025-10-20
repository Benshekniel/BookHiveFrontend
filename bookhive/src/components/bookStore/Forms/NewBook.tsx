import axios from "axios";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { BookSchema, BookFormFields } from "../Schemas/BookSchema";
import { useAuth } from "../../AuthContext";
import LoadingSpinner from "../CommonStuff/LoadingSpinner";

const NewBook = () => {
  const {user} = useAuth();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);

  const [isForSelling, setIsForSelling] = useState(false);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: zodResolver(BookSchema),
  });

  const TextInput = ({ itemName, type = "text", label, placeholder, full}:
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
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const removeImage = () => {
    setCoverImage(null);
    setPreviewUrl(null);
  };

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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

  const createBook = async (newBookData: BookFormFields, coverImage: File) => {
    const formData = new FormData();

    const dataExtended = { ...newBookData, userId: user.userId, isForSelling };
    const jsonBlob = new Blob([JSON.stringify(dataExtended)], {
      type: "application/json",
    });

    formData.append("newBookData", jsonBlob);
    formData.append("coverImage", coverImage);
    images.forEach((file) => {
      formData.append("images", file);
    });

    const response = await axios.post("http://localhost:9090/api/bs-book/new", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  };

  // queryClient.invalidateQueries({ queryKey: ["inventory"] });

  const createMutation = useMutation({
    mutationFn: (data: BookFormFields) => createBook(data, coverImage as File),
    onSuccess: () => {
      toast.success("Book record created successfully!");
      setShowForm(false);
    },
    onError: () => {
      toast.error("Something went wrong! Please try again later!");
    },
  });

  const onSubmit: SubmitHandler<BookFormFields> = (data) => {
    try {
      if (!coverImage) {
        toast.error("Please upload a cover image before submitting.");
        throw new Error("Cover image is required");
      }
      console.log(data);
      createMutation.mutate(data);
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
    reset();
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-amber-400 text-slate-800 rounded-lg hover:bg-amber-500 transition-colors duration-200 font-medium" >
        <Plus className="w-4 h-4" />
        <span>Add Book</span>
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add Individual Book</h2>
              <button onClick={exitPopup}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors" >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="p-6 space-y-4">

              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl py-6 px-10 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Cover Image</h4>
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img className="w-40 h-56 object-cover rounded-xl shadow-md mb-4"
                      src={previewUrl} alt="Preview" />
                    <button type="button" onClick={removeImage}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors" >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-40 h-56 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                    <span className="text-gray-500">Upload Image</span>
                    <input type="file" accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
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
                <TextInput itemName="genres" label="Genres (comma separated) *" full={true}  />
                <TextInput itemName="tags" label="Tags (comma separated) *" full={true}  />

                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Book Description * </label>
                  <textarea id="description"
                    rows={3} {...register("description")}
                    className="w-full px-4 py-3 border border-black rounded-l text-gray-700"
                    placeholder="Provide a short description about the book" />
                  {errors.description && (
                    <div className="block text-sm font-medium text-red-700 mb-2">
                      {errors.description.message}
                    </div>
                  )}
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
                      <button type="button" onClick={() => removeImageFromMany(index)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm" >
                        Remove
                      </button>
                    </div>
                  ))}

                  {images.length < 3 && (
                    <label className="flex flex-col items-center justify-center w-32 h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                      <span className="text-gray-500">Upload</span>
                      <input type="file" accept="image/*"
                        multiple
                        onChange={handleImageChangeMany}
                        className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                  Terms & Pricing </h4>

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
                
                <div className="col-span-2">
                  <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-2">
                    Terms: </label>
                  <textarea id="terms"
                    rows={3} {...register("terms")}
                    className="w-full px-4 py-3 border border-black rounded-l text-gray-700"
                    placeholder="Market your book. Tell your potential customers of any specific conditions."
                  />
                  {errors.terms && (
                    <div className="block text-sm font-medium text-red-700 mb-2">
                      {errors.terms.message}
                    </div>
                  )}
                </div>
                <TextInput itemName="lendFee" label="Lending Fee (Rs.)" type="number" />
                <TextInput itemName="lendingPeriod" label="Lending Period (days)" type="number" />
                <TextInput itemName="lateFee" label="Late Fee (Rs.)" type="number" />
                <TextInput itemName="minTrustScore" label="Minimum Trust Score" type="number" />


                <label htmlFor="isForSelling" className="block text-md font-medium text-gray-700 mb-2">
                  Is the book also available for sale? </label>
                <input id="isForSelling" type="checkbox" checked={isForSelling}
                  onChange={() => setIsForSelling(!isForSelling)} className="m-2 rounded-5"/>
                
                {isForSelling && (<>
                  <TextInput itemName="sellPrice" label="Selling Price (Rs.)" type="number" />
                </>)}

                {/* {isForSelling && (<>
                  <div>
                    <label htmlFor="bookValue" className="block text-sm font-medium text-gray-700 mb-2">
                      Book Value (Rs.) </label>
                    <input id="bookValue" {...register("sellPrice")}
                      type="number" placeholder="Book Value (Rs.)"
                      className="border border-gray-700 text-gray-700 py-3 px-6 rounded-l font-medium hover:bg-gray-50 transition-colors" />
                    {errors.sellPrice && (
                      <div className="block text-sm font-medium text-red-700 mb-2">
                        {errors.sellPrice?.message as string} </div>
                    )}
                  </div>
                </>)} */}

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
                  disabled={createMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed" >
                  {createMutation.isPending ? <LoadingSpinner /> : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewBook;
