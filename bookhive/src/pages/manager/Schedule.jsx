import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Edit3,
  Save
} from 'lucide-react';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [mainHub, setMainHub] = useState({
    name: 'Downtown Hub',
    address: '123 Main Street, Downtown District',
    city: 'New York',
    zipCode: '10001',
    phone: '+1 (555) 123-4567',
    email: 'downtown.hub@company.com'
  });

  const [variables, setVariables] = useState({
    deliveryTimeBuffer: 15,
    pickupTimeLimit: 60,         // in minutes
    maxDeliveryTime: 10080       // in minutes (7 days)
  });

  const [costFactors, setCostFactors] = useState({
    fuelRate: 3.45,
    baseCost: 15.0,
    peakHourMultiplier: 1.5,
    distanceRate: 2.5
  });

  return (
    <div className="space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1E3A8A] font-heading">Schedule Management</h2>
            <p className="text-[#0F172A]">Manage delivery schedules and optimize routes</p>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center space-x-2">
            <Save size={20} />
            <span>Save</span>
          </button>
        </div>

        {/* Travel Plan */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1E3A8A] mb-4 flex items-center gap-2">
          <Calendar size={20} color="#3B82F6" /> Travel Plan
        </h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Time</label>
            <input
              type="time"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Main Hub Location and Cost Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Hub Location */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1E3A8A] mb-4 flex items-center gap-2">
            <MapPin size={20} color="#FBBF24" /> Hub Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hub Name</label>
              <input
                type="text"
                value={mainHub.name}
                onChange={(e) => setMainHub({ ...mainHub, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={mainHub.address}
                onChange={(e) => setMainHub({ ...mainHub, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={mainHub.city}
                  onChange={(e) => setMainHub({ ...mainHub, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  value={mainHub.zipCode}
                  onChange={(e) => setMainHub({ ...mainHub, zipCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={mainHub.phone}
                onChange={(e) => setMainHub({ ...mainHub, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={mainHub.email}
                onChange={(e) => setMainHub({ ...mainHub, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Cost Factors */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-[#1E3A8A] mb-4 font-heading flex items-center gap-2">
            <DollarSign size={20} color="#1E3A8A" /> Cost Factors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fuel Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Rate (per liter)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  value={costFactors.fuelRate}
                  onChange={(e) => setCostFactors({ ...costFactors, fuelRate: parseFloat(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                  step="0.01"
                />
              </div>
            </div>

            {/* Base Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Delivery Cost</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  value={costFactors.baseCost}
                  onChange={(e) => setCostFactors({ ...costFactors, baseCost: parseFloat(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                  step="0.01"
                />
              </div>
            </div>

            {/* Distance Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance Rate (per km)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  value={costFactors.distanceRate}
                  onChange={(e) => setCostFactors({ ...costFactors, distanceRate: parseFloat(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                  step="0.01"
                />
              </div>
            </div>

            {/* Peak Hour Multiplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Peak Hour Multiplier</label>
              <input
                type="number"
                value={costFactors.peakHourMultiplier}
                onChange={(e) => setCostFactors({ ...costFactors, peakHourMultiplier: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                step="0.1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Variables */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-[#1E3A8A] mb-4 font-heading flex items-center gap-2">
          <Clock size={20} color="#1E3A8A" /> Delivery Variables
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Time Buffer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time Buffer (minutes)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                value={variables.deliveryTimeBuffer}
                onChange={(e) => setVariables({ ...variables, deliveryTimeBuffer: parseInt(e.target.value) })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              />
            </div>
          </div>

          {/* Pickup Time Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time Limit (minutes)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1E3A8A]" size={16} />
              <input
                type="number"
                value={variables.pickupTimeLimit}
                onChange={(e) => setVariables({ ...variables, pickupTimeLimit: parseInt(e.target.value) })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              />
            </div>
          </div>

          {/* Max Delivery Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Delivery Time (minutes)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1E3A8A]" size={16} />
              <input
                type="number"
                value={variables.maxDeliveryTime}
                onChange={(e) => setVariables({ ...variables, maxDeliveryTime: parseInt(e.target.value) })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;