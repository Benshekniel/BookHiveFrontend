import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Handshake, X } from "lucide-react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../CommonStuff/LoadingSpinner";
import { useAuth } from "../../AuthContext";

const BookFromInventorySchema = z.object({
  condition: z.enum(["NEW", "USED", "FAIR"]).optional(),

  lendFee: z.coerce.number(),
  terms: z.string(),
  
  lendingPeriod: z.coerce.number(),
  lateFee: z.coerce.number(),
  minTrustScore: z.coerce.number().optional(),

  sellPrice: z.coerce.number().optional(),
})
type formFields = z.infer<typeof BookFromInventorySchema>;


const BookFromInventory = ({inventoryId}: {inventoryId: number}) => {
  const {user} = useAuth();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [isForSelling, setIsForSelling] = useState(false);

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newFiles = [...images, ...files].slice(0, 3); // max 3

    setImages(newFiles);
    setPreviewUrls(newFiles.map(file => URL.createObjectURL(file)));
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previewUrls];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, reset } = useForm({
    resolver: zodResolver(BookFromInventorySchema)
  });

  const TextInput = ({ itemName, type = "text", label, placeholder, }:
    { itemName: keyof formFields; type?: string; label: string; placeholder?: string; }) => (
    <div>
      <label htmlFor={itemName as string} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input id={itemName}
        {...register(itemName)}
        type={type}
        placeholder={placeholder ?? label.endsWith("*") ? label.slice(0, -1).trim() : label}
        className="border border-gray-700 text-gray-700 py-3 px-6 rounded-l font-medium hover:bg-gray-50 transition-colors"
      />
      {errors[itemName] && (
        <div className="block text-sm font-medium text-red-700 mb-2">
          {errors[itemName]?.message as string}
        </div>
      )}
    </div>
  );

  const createBook = async (newItemData: formFields, images: File[]) => {
    const formData = new FormData();

    const dataExtended = { ...newItemData, inventoryId: inventoryId, isForSelling: isForSelling };
    const jsonBlob = new Blob([JSON.stringify(dataExtended)], {
      type: "application/json",
    });

    formData.append("bookFromInventoryData", jsonBlob);
    images.forEach((file) => {
      formData.append("images", file);
    });

    const response = await axios.post("http://localhost:9090/api/bs-book/fromInventory", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => createBook(data, images),
    onSuccess: () => {
      toast.success("Inventory record created successfully!");
      queryClient.invalidateQueries({ queryKey: ["regularInventory", user?.userId] });
      queryClient.invalidateQueries({ queryKey: ["donationInventory", user?.userId] });
      queryClient.invalidateQueries({ queryKey: ["lendOnlyList", user?.userId] });
      queryClient.invalidateQueries({ queryKey: ["sellAlsoList", user?.userId] });
      setShowForm(false);
    },
    onError: () => {
      toast.error("Something went wrong! Please try again later!");
    },
  });

  const onSubmit: SubmitHandler<formFields> = (data) => {
    try {
      if (images.length == 0) {
        toast.error("Please upload at least one extra image before submitting.");
        throw new Error("Image is required");
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
    setImages([]); setPreviewUrls([]);
    reset();
  };

  return (
    <>
      <button className="p-2 bg-blue-100 border border-blue-200 hover:bg-blue-200  rounded-lg transition-colors duration-200"
        title="Add as an Individual Book for Lending"
        onClick={() => { setShowForm(true); }} >
        <Handshake className="w-5 h-5 text-slate-600" />
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Individual Book for Lending</h2>
              <button onClick={exitPopup}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors" >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="p-6 space-y-4">

              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl py-6 px-10 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Book Images (min 1, max 3)</h4>

                <div className="flex gap-4 flex-wrap justify-center">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img
                        className="w-32 h-48 object-cover rounded-xl shadow-md mb-2"
                        src={url}
                        alt={`Preview ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {images.length < 3 && (
                    <label className="flex flex-col items-center justify-center w-32 h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                      <span className="text-gray-500">Upload</span>
                      <input type="file" accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                  Terms and Pricing </h4>

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

                <label htmlFor="isForSelling" className="block text-lg font-medium text-gray-700 mb-2">
                  Is the book for sale also? </label>
                <input id="isForSelling" type="checkbox" checked={isForSelling}
                  onChange={() => setIsForSelling(!isForSelling)} className="m-2 rounded-5"/>
                
                {isForSelling && (<>
                  <TextInput itemName="sellPrice" label="Selling Price (Rs.)" type="number" />
                </>)}

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

export default BookFromInventory;
