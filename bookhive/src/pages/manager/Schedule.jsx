import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Edit3,
  Save,
  RefreshCw
} from 'lucide-react';
import { hubApi } from '../../services/deliveryService';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [hubId] = useState(1); // This should come from auth context
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  // Fetch hub data from backend
  useEffect(() => {
    fetchHubData();
  }, [hubId]);

  const fetchHubData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch hub information
      const hubResponse = await hubApi.getHubById(hubId);
      
      // Transform backend data to match frontend structure
      setMainHub({
        name: hubResponse.name || 'Hub',
        address: hubResponse.address || '',
        city: hubResponse.city || '',
        zipCode: hubResponse.zipCode || '',
        phone: hubResponse.phoneNumber || '',
        email: hubResponse.email || ''
      });

      // Set delivery variables from hub data or use defaults
      setVariables({
        deliveryTimeBuffer: hubResponse.deliveryTimeBuffer || 15,
        pickupTimeLimit: hubResponse.pickupTimeLimit || 60,
        maxDeliveryTime: hubResponse.maxDeliveryTime || 10080
      });

      // Set cost factors from hub data or use defaults
      setCostFactors({
        fuelRate: hubResponse.fuelRate || 3.45,
        baseCost: hubResponse.baseCost || 15.0,
        peakHourMultiplier: hubResponse.peakHourMultiplier || 1.5,
        distanceRate: hubResponse.distanceRate || 2.5
      });

    } catch (err) {
      console.error('Error fetching hub data:', err);
      setError('Failed to load hub configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleHubChange = (field, value) => {
    setMainHub(prev => ({ ...prev, [field]: value }));
    if (success) setSuccess(false);
  };

  const handleVariableChange = (field, value) => {
    setVariables(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
    if (success) setSuccess(false);
  };

  const handleCostFactorChange = (field, value) => {
    setCostFactors(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    if (success) setSuccess(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Prepare data for backend update
      const updateData = {
        name: mainHub.name,
        address: mainHub.address,
        city: mainHub.city,
        zipCode: mainHub.zipCode,
        phoneNumber: mainHub.phone,
        email: mainHub.email,
        deliveryTimeBuffer: variables.deliveryTimeBuffer,
        pickupTimeLimit: variables.pickupTimeLimit,
        maxDeliveryTime: variables.maxDeliveryTime,
        fuelRate: costFactors.fuelRate,
        baseCost: costFactors.baseCost,
        peakHourMultiplier: costFactors.peakHourMultiplier,
        distanceRate: costFactors.distanceRate
      };

      await hubApi.updateHub(hubId, updateData);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error('Error saving hub configuration:', err);
      setError('Failed to save configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const refreshData = async () => {
    await fetchHubData();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading hub configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={refreshData}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600">Configuration saved successfully!</p>
        </div>
      )}

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
                onChange={(e) => handleHubChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={mainHub.address}
                onChange={(e) => handleHubChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={mainHub.city}
                  onChange={(e) => handleHubChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  value={mainHub.zipCode}
                  onChange={(e) => handleHubChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={mainHub.phone}
                onChange={(e) => handleHubChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={mainHub.email}
                onChange={(e) => handleHubChange('email', e.target.value)}
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
                  onChange={(e) => handleCostFactorChange('fuelRate', e.target.value)}
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
                  onChange={(e) => handleCostFactorChange('baseCost', e.target.value)}
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
                  onChange={(e) => handleCostFactorChange('distanceRate', e.target.value)}
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
                onChange={(e) => handleCostFactorChange('peakHourMultiplier', e.target.value)}
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
                onChange={(e) => handleVariableChange('deliveryTimeBuffer', e.target.value)}
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
                onChange={(e) => handleVariableChange('pickupTimeLimit', e.target.value)}
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
                onChange={(e) => handleVariableChange('maxDeliveryTime', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <Save size={20} />
          <span>{saving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};

export default Schedule;