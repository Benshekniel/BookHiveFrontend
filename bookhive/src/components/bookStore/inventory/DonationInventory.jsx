import React, { useState } from 'react';
import {
  Search, Filter, Plus, Upload, Edit, Trash2, Eye, MoreHorizontal, Package, DollarSign, BookOpen, Heart, Clock, Users, Star, AlertCircle, CheckCircle, Calendar, FileText, Camera, Download, Settings, Shield, Award, ChevronDown
} from 'lucide-react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from "../../AuthContext";
import LoadingSpinner from "../LoadingSpinner";

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

const getStatusBadge = (status, type = 'regular') => {
  const statusConfigs = {
    donations: {
      'Pending': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
      'Matched': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      'Delivered': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' }
    }
  };

  const config = statusConfigs[type][status] || statusConfigs[type]['Active'] || statusConfigs.regular['Active'];

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  );
};

const DonationInventory = () => {
  //   const { user } = useAuth();
  const user = { userId: 603 }; // hard-coded userId until login completed

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  const getDonationInventory = async () => {
    if (!user?.userId) return [];
    try {
      const response = await axios.get(`http://localhost:9090/api/bs-inventory/getDonationInventory/${user.userId}`);
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

  const { data: donationInventory = [], isPending, error } = useQuery({
    queryKey: ["donationInventory", user?.userId],
    queryFn: getDonationInventory,
    staleTime: 5 * 60 * 1000,       // cache considered fresh for 5 minutes
    enabled: !!user?.userId,
    retryDelay: 1000
  });

  return (
    <>
      <div className="space-y-6">
        {/* Donation Impact */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Your Donation Impact</h3>
              <p className="text-slate-600">You've donated 23 books and helped 18 recipients</p>
              <div className="flex items-center space-x-2 mt-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium text-amber-700">Donated 20+ books badge earned!</span>
              </div>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
            </div>
          </div>
        </div>

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

        {/* Books Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-700">BOOK DETAILS</th>
                  <th className="text-left p-4 font-semibold text-slate-700">CONDITION</th>
                  <th className="text-left p-4 font-semibold text-slate-700">STATUS</th>
                  <th className="text-left p-4 font-semibold text-slate-700">RECIPIENT</th>
                  <th className="text-left p-4 font-semibold text-slate-700">DATE</th>
                  <th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      <LoadingSpinner />
                    </td>
                  </tr>) : error ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-red-500">
                        Server unreachable. Please try again later.
                      </td>
                    </tr>) : donationInventory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-gray-400">
                          No books found.
                        </td>
                      </tr>) :
                  (donationInventory
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
                    .map((book) => {
                      <tr key={book.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
                        <td className="p-4">
                          <div className="flex items-center space-x-4">
                            <img src={book.image} alt={book.title} className="w-12 h-16 object-cover rounded-lg border border-gray-200" />
                            <div>
                              <h3 className="font-semibold text-slate-800">{book.title}</h3>
                              <p className="text-sm text-slate-600">by {book.author}</p>
                              <span className="text-xs text-slate-500">{book.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-slate-700">{book.condition}</span>
                        </td>
                        <td className="p-4">{getStatusBadge(book.status, 'donations')}</td>
                        <td className="p-4">
                          {book.recipient ? (
                            <div className="text-sm">
                              <p className="font-medium text-slate-700">{book.recipient}</p>
                              <p className="text-slate-600">Matched: {book.dateMatched}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400">Pending match</span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-slate-600">{book.dateAdded}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                              <Eye className="w-4 h-4 text-slate-400" />
                            </button>
                            <button className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200">
                              <FileText className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    })
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>);
}
export default DonationInventory;