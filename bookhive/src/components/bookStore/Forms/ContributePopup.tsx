import axios from "axios";
import { HeartHandshake, X, MinusCircle, PlusCircle } from "lucide-react";

import { useState } from "react";
import { useAuth } from "../../AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../CommonStuff/LoadingSpinner";

type Props = {
  category: string;
  donationId: number;
  contributable: number;
};

const ContributePopup = ({ category, donationId, contributable }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showPopup, setShowPopup] = useState(false);
  category = category.toLowerCase();

  // const [contributions, setContributions] = useState<{ [key: number]: number }>({}); // inventoryId -> contributed count
  type InventoryItem = {
    inventoryId: number;
    stockCount: number;
  };
  type ContributionMap = Record<number, number>;

  const [contributions, setContributions] = useState<ContributionMap>({});

  const getMatchingInventoryItems = async () => {
    if (!user?.userId) return [];
    try {
      const response = await axios.get(
        `http://localhost:9090/api/bs-donation/matching-list/${category}/${user.userId}`
      );

      if (response.data.length === 0) return [];
      console.log(response.data)

      const itemsWithImages = await Promise.all(
        response.data.map(async (item: any) => {
          if (item.coverImage) {
            try {
              const res = await axios.get(`http://localhost:9090/getFileAsBase64`, {
                params: {
                  fileName: item.coverImage,
                  folderName: "BSItem/coverImage",
                },
              });
              return { ...item, coverImageURL: res.data };
            } catch (err) {
              console.error("Axios Error: ", err);
              return { ...item, coverImageURL: null };
            }
          }
          return item;
        })
      );
      return itemsWithImages;
    } catch (err) {
      console.error("Axios Error: ", err);
      throw err;
    }
  };

  const { data: matchingInventoryItems = [], isPending, error } = useQuery({
    queryKey: ["matchingInventoryItems", user?.userId, category],
    queryFn: getMatchingInventoryItems,
    staleTime: 5 * 60 * 1000,
    enabled: !!user?.userId && !!category,
    retryDelay: 1000,
  });

  const handleCountChange = (
    inventoryId: number,
    value: number,
    stockCount: number
  ) => {
    const count = Math.max(0, Math.min(value, stockCount)); // clamp 0..stockCount
    setContributions((prev) => ({ ...prev, [inventoryId]: count }));
  };
  const mutation = useMutation({
    mutationFn: async (payload: {
      donationId: number;
      contributions: { inventoryId: number; contributionCount: number }[];
    }) => {
      const { donationId, contributions } = payload;
      console.log(contributions);
      return axios.put(
        `http://localhost:9090/api/bs-donation/contribute/${donationId}`,
        contributions
      );
    },
    onSuccess: () => {
      toast.success("Thanks for your contribution!");
      setShowPopup(false);
      queryClient.invalidateQueries({ queryKey: ["currentDonations", user?.userId] });
    },
    onError: () => {
      toast.error("Something went wrong! Please try again later.")
      setShowPopup(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalContributing = Object.values(contributions).reduce((sum, count) => sum + count, 0);
    if (totalContributing > contributable) {
      toast.error("You can't contribute more than the designated amount.");
      return;
    }

    const contributionList = matchingInventoryItems
      .map((item: InventoryItem) => ({
        inventoryId: item.inventoryId,
        contributionCount: contributions[item.inventoryId] ?? 0,
      }))
      .filter((c) => c.contributionCount > 0);

    if (contributionList.length === 0) {
      toast.error("Please select at least one book to contribute!");
      return;
    }

    mutation.mutate({ donationId, contributions: contributionList });
  };

  const openPopup = () => setShowPopup(true);
  const exitPopup = () => {
    setShowPopup(false);
    setContributions({});
  };

  return (
    <>
      <button
        className="p-2 bg-green-100 border border-green-200 hover:bg-green-200 rounded-lg transition-colors duration-200"
        title="Contribute to this donation event"
        onClick={openPopup}
      >
        <HeartHandshake className="w-5 h-5 text-slate-600" />
      </button>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Contribute from Your Donation Inventory - Max: {contributable}
              </h2>
              <button onClick={exitPopup}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors" >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {isPending ? (
              <div className="p-10 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="p-6 text-red-600">Error loading items.</div>
            ) : matchingInventoryItems.length === 0 ? (
              <div className="p-6 text-gray-600 text-center">
                No matching books found in your inventory for this category.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-xl">
                    <thead className="bg-slate-50 border-b border-gray-200">
                      <tr>
                        <th className="p-3 text-left font-semibold text-slate-700">Book</th>
                        <th className="p-3 text-left font-semibold text-slate-700">Category</th>
                        <th className="p-3 text-left font-semibold text-slate-700">Condition</th>
                        <th className="p-3 text-left font-semibold text-slate-700">Stock</th>
                        <th className="p-3 text-left font-semibold text-slate-700">Add / Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchingInventoryItems.map((item: any) => (
                        <tr
                          key={item.inventoryId}
                          className="border-b border-gray-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-3">
                            <div className="flex items-center space-x-4">
                              {item.coverImageURL ? (
                                <img
                                  src={item.coverImageURL}
                                  alt={item.title}
                                  className="w-12 h-16 object-cover rounded-lg border border-gray-200"
                                />
                              ) : (
                                <div className="w-12 h-16 bg-gray-100 rounded-lg border flex items-center justify-center text-xs text-gray-500">
                                  No Image
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-slate-800">{item.title}</p>
                                <p className="text-sm text-slate-600">
                                  {item.authors?.join(", ")}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {item.seriesName
                                    ? `${item.seriesName} (${item.seriesInstallment})`
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-slate-700">{item.category}</td>
                          <td className="p-3 text-slate-700">{item.condition}</td>
                          <td className="p-3 text-slate-700">{item.stockCount}</td>
                          <td className="p-3">
                            <div className="flex flex-col mb-6 justify-center items-center">
                              <label className="mb-2 font-medium text-gray-700 text-sm">
                                Contribute
                              </label>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  className="bg-blue-600 hover:bg-blue-700 p-1 rounded-full transition-colors"
                                  onClick={() =>
                                    handleCountChange(
                                      item.inventoryId,
                                      (contributions[item.inventoryId] || 0) - 1,
                                      item.stockCount
                                    )
                                  }
                                >
                                  <MinusCircle className="w-5 h-5 text-white" />
                                </button>

                                <input
                                  type="number"
                                  min={0}
                                  max={item.stockCount}
                                  value={contributions[item.inventoryId] || 0}
                                  onChange={(e) =>
                                    handleCountChange(
                                      item.inventoryId,
                                      parseInt(e.target.value) || 0,
                                      item.stockCount
                                    )
                                  }
                                  className="w-20 text-center border rounded-lg py-1.5"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCountChange(
                                      item.inventoryId,
                                      (contributions[item.inventoryId] || 0) + 1,
                                      item.stockCount
                                    )
                                  }
                                  className="bg-blue-600 hover:bg-blue-700 p-1 rounded-full transition-colors"
                                >
                                  <PlusCircle className="w-5 h-5 text-white" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Submit Button */}
                <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 flex justify-center p-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors font-medium"
                  >
                    Submit Contributions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default ContributePopup;

// // fetch books matching category
// // show buttons to add/remove booksfor each matching inventory item
// // confirm button