import React, { useState } from 'react';
import axios from 'axios';
import { Search, Trash2, ChevronDown } from 'lucide-react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from "../../AuthContext";

import LoadingSpinner from "../CommonStuff/LoadingSpinner.jsx";
import {formatDateTime, getConditionBadge} from "../CommonStuff/CommonFunc.tsx";

import BookFromInventory from '../Forms/BookFromInventory';
import InventoryStockAdjuster from '../Forms/InventoryStockAdjuster';
import EditInventory from '../Forms/EditInventory';
import DeleteInventory from '../Buttons/DeleteInventory';

const RegularInventory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchISBN, setSearchISBN] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  const getRegularInventory = async () => {
    if (!user?.userId) return [];
    try {
      const response = await axios.get(`http://localhost:9090/api/bs-inventory/regularList/${user.userId}`);
      if (response.data.length === 0) return [];
      const itemsWithImages = await Promise.all(
        response.data.map(async (item: any) => {
          if (item.coverImage) {
            try {
              const res = await axios.get(`http://localhost:9090/getFileAsBase64`, {
                params: { fileName: item.coverImage, folderName: "BSItem/coverImage" }
              }
              );
              return { ...item, coverImageURL: res.data };
            } catch (err) {
              console.error("Axios Error: ", err);
              return { ...item, coverImageURL: null }; // fallback
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

  const { data: regularInventory = [], isPending, error } = useQuery({
    queryKey: ["regularInventory", user?.userId],
    queryFn: getRegularInventory,
    staleTime: 5 * 60 * 1000,       // cache considered fresh for 5 minutes
    enabled: !!user?.userId,
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

            <div className="relative">
              <select value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
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

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-700">BOOK DETAILS</th>
                  <th className="p-4 font-semibold text-slate-700">CONDITION</th>
                  <th className="p-4 font-semibold text-slate-700">PRICE</th>
                  <th className="p-4 font-semibold text-slate-700">COUNT</th>
                  <th className="p-4 font-semibold text-slate-700">FAVOURITES</th>
                  <th className="p-4 font-semibold text-slate-700">DATE ADDED</th>
                  <th className="p-4 font-semibold text-slate-700">ACTIONS</th>
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
                      <td colSpan={7} className="text-center py-6 text-red-500">
                        Server unreachable. Please try again later.
                      </td>
                    </tr>) : regularInventory.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-gray-400">
                          No items found.
                        </td>
                      </tr>) :
                  (regularInventory
                    .filter((item) => {
                      const term = searchTerm.toLowerCase();
                      const matchesSearch =
                        item.title?.toLowerCase().includes(term) ||
                        item.authors?.some((a: string) => a.toLowerCase().includes(term)) ||
                        item.genres?.some((g: string) => g.toLowerCase().includes(term)) ||
                        item.tags?.some((t: string) => t.toLowerCase().includes(term));

                      const matchesISBN = item.isbn.includes(searchISBN);

                      const matchesCondition = !selectedCondition || item.condition === selectedCondition;
                      return matchesSearch && matchesCondition && matchesISBN;
                    })
                    .map((item) => (
                      <tr key={item.inventoryId} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
                        <td className="p-4">
                          <div className="flex items-center space-x-4">
                            <img src={item.coverImageURL} alt={item.title} className="w-15 h-20 object-cover rounded-lg border border-gray-200" />
                            <div>
                              <p>
                                <span className="font-semibold text-slate-800">{item.title}</span>
                                {item?.seriesName && (
                                  <span className="font-semibold text-sm text-slate-500">
                                    : {item?.seriesName} # {item?.seriesInstallment}</span> 
                                )}</p>
                              <p className="text-sm text-slate-600">
                                by {item?.authors.slice(0, 3).join(', ')}
                                {item?.authors.length > 3 && ' ...'}</p>
                              <div className="flex flex-col items-start gap-1 mt-1">
                                <span className="text-sm text-slate-600">
                                  <b> Genres:</b> {item?.genres.slice(0, 3).join(', ')}
                                  {item?.genres.length > 3 && ' ...'}</span>
                                <span className="text-sm text-slate-500">
                                  <b> Tags:</b> {item?.tags.slice(0, 3).join(', ')}
                                  {item?.tags.length > 3 && ' ...'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center align-middle">
                          <div className="flex justify-center items-center h-full">
                            {getConditionBadge(item.condition)} </div>
                        </td>
                        <td className="p-4 text-center align-middle">
                          <div className="flex justify-center items-center h-full">
                            Rs. {item.sellPrice} </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col justify-center items-center gap-1 text-sm text-slate-600 h-full">
                            {item.stockCount < 5 ? (
                              <span className="text-xs inline-block px-3 py-1 font-semibold rounded-full border bg-red-200 text-red-900 border-red-300 w-fit">
                                In Stock: {item.stockCount} </span>
                            ) : (
                              <span>In Stock: {item.stockCount}</span>
                            )}
                            <span>Sellable: {item.sellableCount}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          <div className="flex justify-center items-center h-full">
                            {item.favouritesCount ?? 0} </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          <div className="flex justify-center items-center h-full">
                            {formatDateTime(item.createdAt)} </div>
                        </td>

                        <td className="p-4">
                          <div className="grid grid-cols-2 grid-rows-2 gap-2 justify-items-center items-center h-full">
                            <InventoryStockAdjuster inventoryId={item.inventoryId} />
                            <EditInventory inventoryId={item.inventoryId} />
                            <BookFromInventory inventoryId={item.inventoryId} />
                            <DeleteInventory inventoryId={item.inventoryId} />
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
}
export default RegularInventory;