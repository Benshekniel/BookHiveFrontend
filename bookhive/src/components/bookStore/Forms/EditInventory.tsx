import axios from "axios";
import { Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { InventorySchema, InventoryFormFields } from "../Schemas/InventorySchema";
import { useAuth } from "../../AuthContext";
import LoadingSpinner from "../CommonStuff/LoadingSpinner";

const EditInventory = ({inventoryId}: {inventoryId: number}) => {
  const {user} = useAuth();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);

  const [isForDonation, setIsForDonation] = useState(false);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [imageChanged, setImageChanged] = useState(false);

  const fetchInventoryItem = async () => {
    try {
      const response = await axios.get(`http://localhost:9090/api/bs-inventory/inventoryOne/${inventoryId}`);
      const item = response.data;
      console.log(response.data);

      let coverImageURL: string | null = null;
      if (item.coverImage) {
        const coverImgRes = await axios.get(`http://localhost:9090/getFileAsBase64`,
          { params: { fileName: item.coverImage, folderName: "BSItem/coverImage" } });
        setPreviewUrl(coverImgRes.data);
      }
      return item;
      } 
      catch (err) {
        console.error("Axios Error: ", err);
        throw err;
      }
    };

  const { data: currentItem, isPending } = useQuery({
    queryKey: ["currentItem", inventoryId],
    queryFn: fetchInventoryItem,
    enabled: !!inventoryId,
  });

  useEffect(() => {
    if (!isPending) {
      reset(); 
    }
  }, [currentItem])

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: zodResolver(InventorySchema),
    defaultValues: currentItem,
  });

  useEffect(() => {
    if (currentItem) {
      reset(currentItem);
    }
  }, [currentItem, reset]);

  const TextInput = ({ itemName, type = "text", label, placeholder, full}:
    { itemName: keyof InventoryFormFields; type?: string; label: string; placeholder?: string; full?: boolean }) => (
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

  const editInventory = async (editItemData: InventoryFormFields, coverImage: File) => {
    const formData = new FormData();

    const dataExtended = { ...editItemData, inventoryId, isForDonation };
    const jsonBlob = new Blob([JSON.stringify(dataExtended)], {
      type: "application/json",
    });

    formData.append("editItemData", jsonBlob);
    imageChanged && formData.append("coverImage", coverImage);

    const response = await axios.put(`http://localhost:9090/api/bs-inventory/edit`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  };

  const editMutation = useMutation({
    mutationFn: (data: InventoryFormFields) => editInventory(data, coverImage as File),
    onSuccess: () => {
      toast.success("Inventory details edited successfully!");
      queryClient.invalidateQueries({ queryKey: ["regularInventory", user?.userId] });
      queryClient.invalidateQueries({ queryKey: ["donationInventory", user?.userId] });
      setShowForm(false);
    },
    onError: () => {
      toast.error("Something went wrong! Please try again later!");
    },
  });

  const onSubmit: SubmitHandler<InventoryFormFields> = (data) => {
    try {
      if ((!coverImage && imageChanged) || (previewUrl == null)) {
        toast.error("Please upload a cover image before submitting.");
        throw new Error("Cover image is required");
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
    queryClient.invalidateQueries({ queryKey: ["currentItem", inventoryId] });
    reset();
  };

  return (
    <>
      <button className="p-2 bg-green-100 border border-green-200 hover:bg-green-200 rounded-lg transition-colors duration-200"
        title="Edit inventory item details"
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
                <TextInput itemName="genres" label="Genres (comma separated) *" full={true}/>
                <TextInput itemName="tags" label="Tags (comma separated) *" full={true} />
                <TextInput itemName="category" label="Category *" full={true} />

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

              {/* Availability */}
              <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 col-span-2">
                  Stock & Pricing </h4>

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

                <TextInput itemName="stockCount" label="Stock Count" type="number" />

                <label htmlFor="isForDonation" className="block text-md font-medium text-gray-700 mb-2">
                  Is the book for donation only? </label>
                <input id="isForDonation" type="checkbox" checked={isForDonation}
                  onChange={() => setIsForDonation(!isForDonation)} className="m-2 rounded-5"/>
                
                {!isForDonation && (<>
                  <TextInput itemName="sellableCount" label="Sellable Count" type="number" />
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

export default EditInventory;
