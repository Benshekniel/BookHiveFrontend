import axios from "axios";
import { X, MinusCircle, PlusCircle, Box } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../CommonStuff/LoadingSpinner";

const InventoryStockAdjuster = ({ inventoryId }: { inventoryId: number }) => {
	const queryClient = useQueryClient();
  // const {user} = useAuth();
  const user = { userId: 603 }; // hard-coded userId until login completed

  const [showForm, setShowForm] = useState(false);
  const [stockCount, setStockCount] = useState(0);
  const [sellableCount, setSellableCount] = useState(0);

  const fetchCurrentStock = async () => {
    const response = await axios.get(`http://localhost:9090/api/bs-inventory/stockUpdate/${inventoryId}`);
    return response.data;
  };

  const { data: currentStock, isPending } = useQuery({
    queryKey: ["currentStock", inventoryId],
    queryFn: fetchCurrentStock,
    enabled: !!inventoryId,
  });

  useEffect(() => {
    if (!isPending) {
      setStockCount(currentStock.stockCount || 0);
      setSellableCount(currentStock.sellableCount || 0);
    }
  }, [currentStock])

  const updateStockItem = async () => {
    const formData = new FormData();
    const payload = { inventoryId, stockCount, sellableCount };
    formData.append("newStockDetails", new Blob([JSON.stringify(payload)], { type: "application/json" }));

    const response = await axios.put("http://localhost:9090/api/bs-inventory/stockUpdate", formData);
    return response.data;
  };

  const adjustMutation = useMutation({
    mutationFn: updateStockItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regularInventory", user?.userId] });
      toast.success("Stock updated successfully!");
      setShowForm(false);
    },
    onError: () => {
      toast.error("Something went wrong! Please try again later!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adjustMutation.mutate();
  };

  const exitPopup = () => {
    setShowForm(false);
    setStockCount(currentStock.stockCount);
    setSellableCount(currentStock.sellableCount);
  };

  return (
    <>
      <button className="p-2 bg-blue-100 border border-blue-200 hover:bg-blue-200 rounded-lg transition-colors duration-200"
        title="Edit stock and sellable counts."
        onClick={() => { setShowForm(true); }} >
        <Box className="w-5 h-5 text-slate-600" />
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Adjust Stock</h2>
              <button onClick={exitPopup}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors" >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl py-6 px-10 grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center">

                <div className="flex flex-col mb-6 justify-center items-center">
                  <label className="mb-2 font-medium text-gray-700">Sellable Count</label>
                  <div className="flex items-center gap-3">
                    <button type="button"
                      onClick={() => setSellableCount(Math.max(0, sellableCount - 1))}
                      className="bg-blue-600 hover:bg-blue-700 p-1 rounded-full transition-colors" >
                        <MinusCircle className="w-5 h-5 text-white" />
                    </button>

                    <input type="number" value={sellableCount}
                      className="w-24 text-center border rounded-lg py-2"
                      onChange={(e) => {
                        const newVal = parseInt(e.target.value) || 0;
                        setSellableCount(Math.min(newVal, stockCount));
                      }} />

                    <button type="button"
                      onClick={() => setSellableCount(Math.min(stockCount, sellableCount + 1))}
                      className="bg-blue-600 hover:bg-blue-700 p-1 rounded-full transition-colors" >
                        <PlusCircle className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col mb-6 justify-center items-center">
                  <label className="mb-2 font-medium text-gray-700">Stock Count</label>
                  <div className="flex items-center gap-3">
                    <button type="button"
                      className="bg-blue-600 hover:bg-blue-700 p-1 rounded-full transition-colors"
                      onClick={() => {
                        const newVal = Math.max(0, stockCount - 1);
                        setStockCount(newVal);
                        if (sellableCount > newVal) setSellableCount(newVal);
                      }} >
                        <MinusCircle className="w-5 h-5 text-white" />
                    </button>

                    <input type="number" value={stockCount}
                      className="w-24 text-center border rounded-lg py-2"
                      onChange={(e) => {
                        const newVal = parseInt(e.target.value) || 0;
                        setStockCount(newVal);
                        if (sellableCount > newVal) setSellableCount(newVal);
                      }} />

                    <button type="button"
                      onClick={() => setStockCount(stockCount + 1)}
                      className="bg-blue-600 hover:bg-blue-700 p-1 rounded-full transition-colors" >
                        <PlusCircle className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

              </div>

              <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 flex justify-center p-4">
                <button type="submit" disabled={adjustMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors font-medium        disabled:opacity-50 disabled:cursor-not-allowed" >
                  {adjustMutation.isPending ? <LoadingSpinner /> : "Update Stock"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
};
export default InventoryStockAdjuster;