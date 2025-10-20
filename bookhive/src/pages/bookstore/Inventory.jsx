import React, { useState } from 'react';
import { Package, DollarSign, Heart } from 'lucide-react';

import NewInventoryItem from '../../components/bookStore/Forms/NewInventoryItem.tsx';

import RegularInventory from '../../components/bookStore/inventory/RegularInventory.tsx';
import DonationInventory from '../../components/bookStore/inventory/DonationInventory.jsx';

import RegularStats from '../../components/bookStore/inventory/RegularStats.jsx';
import DonationStats from '../../components/bookStore/inventory/DonationStats.jsx';

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState('regular');

  const tabs = [
    { id: 'regular', label: 'Regular', icon: DollarSign },
    { id: 'donations', label: 'Donations', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Inventory Management</h1>
                <p className="text-slate-600 mt-1">Manage your books across regular and donations inventory.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <NewInventoryItem />
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
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'}`} >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {/* <span className={`px-2 py-1 text-xs rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      {tab.count}
                    </span> */}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        {activeTab === 'regular' && <RegularStats />}
        {activeTab === 'donations' && <DonationStats />}

        {/* Tab Content */}
        {activeTab === 'regular' && <RegularInventory />}
        {activeTab === 'donations' && <DonationInventory />}
      </div>
    </div>
  );
};

export default InventoryPage;