import React, { useState } from 'react';
import { Heart, DollarSign, BookOpen } from 'lucide-react';

import SellAlsoList from '../../components/bookStore/listings/SellAlsoList.tsx';
import SellAlsoStats from '../../components/bookStore/listings/SellAlsoStats.jsx';

import LendOnlyList from '../../components/bookStore/listings/LendOnlyList.tsx';
import LendOnlyStats from '../../components/bookStore/listings/LendOnlyStats.jsx';

import NewBook from '../../components/bookStore/Forms/NewBook.tsx';

const ListingsPage = () => {
  const [activeTab, setActiveTab] = useState('lending');

  const tabs = [
    { id: 'lending', label: 'For Lending Only', icon: BookOpen },
    { id: 'sales', label: 'For Sale Also', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Listings Management</h1>
                <p className="text-slate-600 mt-1">
                  Preview and manage how your individual books appear to users
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <NewBook />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'
                      }`} >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {/* <span className={`px-2 py-1 text-xs rounded-full
                      ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`} >
                      {tab.count}
                    </span> */}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        {activeTab === 'lending' && <LendOnlyStats />}
        {activeTab === 'sales' && <SellAlsoStats />}

        {/* Listings Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'lending' && <LendOnlyList /> }
            {activeTab === 'sales' && <SellAlsoList />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListingsPage;