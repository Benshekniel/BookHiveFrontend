import React, { useState } from 'react';
import {
  Search, Filter, Plus, Upload, Edit, Trash2, Eye, MoreHorizontal, Package, DollarSign, BookOpen, Heart, Clock, Users, Star, AlertCircle, CheckCircle, Calendar, FileText, Camera, Download, Settings, Shield, Award, ChevronDown
} from 'lucide-react';

import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

import { useAuth } from "../../AuthContext";
import LoadingSpinner from "../LoadingSpinner";
import AddToListings from './AddToListings';

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

const getConditionBadge = (condition) => {
  const conditionConfigs = {
    'NEW': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    'USED': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
    'FAIR': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' }
  };
  const config = conditionConfigs[condition];
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      {condition}
    </span>
  );
};


const RegularInventory = () => {
  const queryClient = useQueryClient();
  //   const { user } = useAuth();
  const user = { userId: 603 }; // hard-coded userId until login completed

  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showAddToListing, setShowAddToListing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  const getRegularInventory = async () => {
    if (!user?.userId) return [];
    try {
      const response = await axios.get(`http://localhost:9090/api/bs-inventory/getRegularInventory/${user.userId}`);
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

  const deleteItem = async (bookId: number) => {
    console.log(bookId)
    const response = await axios.delete(`http://localhost:9090/api/bs-book/${bookId}`);
    return response.data;
  }

  const deleteMutation = useMutation({
    mutationFn: ({ bookId } : {bookId: number}) => deleteItem(bookId),
    onMutate: () => {
      toast.loading("Deleting...", { id: "deleteToast" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regularInventory", user?.userId] });
      toast.success("Successfully deleted!", { id: "deleteToast" });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong! Please try again later!", { id: "deleteToast" })
    },
  })


  const deleteItemConfirm = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed && selectedBookId !== null) {
        console.log(selectedBookId);
        deleteMutation.mutate({ bookId: selectedBookId });
      }
    });
  }

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
                  <th className="text-left p-4 font-semibold text-slate-700">BOOK DETAILS</th>
                  <th className="text-left p-4 font-semibold text-slate-700">CONDITION</th>
                  <th className="text-left p-4 font-semibold text-slate-700">DATE ADDED</th>
                  <th className="text-left p-4 font-semibold text-slate-700">COUNT</th>
                  <th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      <LoadingSpinner />
                    </td>
                  </tr>) : error ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-red-500">
                        Server unreachable. Please try again later.
                      </td>
                    </tr>) : regularInventory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-gray-400">
                          No books found.
                        </td>
                      </tr>) :
                  (regularInventory
                    .filter((book) => {
                      const term = searchTerm.toLowerCase();
                      const matchesSearch =
                        book.title?.toLowerCase().includes(term) ||
                        book.authors?.some(a => a.toLowerCase().includes(term)) ||
                        book.genres?.some(g => g.toLowerCase().includes(term)) ||
                        book.tags?.some(t => t.toLowerCase().includes(term));

                      const matchesCondition = !selectedCondition || book.condition === selectedCondition;
                      return matchesSearch && matchesCondition;
                    })
                    .map((book) => (
                      <tr key={book.bookId} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
                        <td className="p-4">
                          <div className="flex items-center space-x-4">
                            <img src={book.coverImageURL} alt={book.title} className="w-12 h-16 object-cover rounded-lg border border-gray-200" />
                            <div>
                              <h3 className="font-semibold text-slate-800">
                                {book?.title}
                              </h3>
                              <p className="text-sm text-slate-600">by {book?.authors.join(', ')}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-slate-500">{book?.genres.join(', ')}</span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-500">
                                  {book?.listingType.replace(/_/g, ' ')}
                                </span>
                                {/* <span className="text-xs text-slate-400">•</span> */}
                              </div>
                              <div className="mt-1">
                                <span className="text-xs text-slate-500">Tags: {book?.tags.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{getConditionBadge(book.condition)}</td>
                        <td className="p-4 text-sm text-slate-600">{formatDateTime(book.createdAt)}</td>
                        <td className="p-4 text-sm text-slate-600">{book.bookCount}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                              <Eye className="w-4 h-4 text-slate-400" />
                            </button>
                            <button className="p-2 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                              onClick={() => {setSelectedBookId(book?.bookId); setShowAddToListing(true);}}>
                              <Edit className="w-4 h-4 text-slate-400" />
                            </button>
                            <button className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200"
                              onClick={() => {setSelectedBookId(book?.bookId); deleteItemConfirm();}}>
                              <Trash2 className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {showAddToListing && (<AddToListings bookId={selectedBookId}
          onClose={() => {setSelectedBookId(null); setShowAddToListing(false)}} />)}

      </div>
    </>);
}
export default RegularInventory;