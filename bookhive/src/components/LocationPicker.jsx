import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Check, ChevronDown, X } from 'lucide-react';
import { sriLankaLocations, getDistricts, getProvinces } from '../utils/sriLankaLocations';

/**
 * Smart Location Picker for Sri Lankan Addresses
 * Features:
 * - Autocomplete with fuzzy search
 * - District and Province filters
 * - Real-time location matching
 * - Visual feedback for selected location
 */
const LocationPicker = ({ value, onChange, error, label = "Location", placeholder = "Start typing your city or area..." }) => {
  const [searchQuery, setSearchQuery] = useState(value || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const districts = getDistricts();
  const provinces = getProvinces();

  // Convert location database to searchable array
  const locationsList = Object.entries(sriLankaLocations).map(([name, data]) => ({
    name,
    displayName: name.charAt(0).toUpperCase() + name.slice(1),
    ...data
  }));

  // Filter locations based on search query and filters
  useEffect(() => {
    if (searchQuery.length < 1) {
      setFilteredLocations([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    let results = locationsList.filter(loc => {
      const matchesSearch = loc.name.includes(query) ||
                           loc.displayName.toLowerCase().includes(query) ||
                           loc.district?.toLowerCase().includes(query) ||
                           loc.province?.toLowerCase().includes(query);

      const matchesDistrict = !selectedDistrict || loc.district === selectedDistrict;
      const matchesProvince = !selectedProvince || loc.province === selectedProvince;

      return matchesSearch && matchesDistrict && matchesProvince;
    });

    // Sort by relevance
    results = results.sort((a, b) => {
      const aStartsWith = a.name.startsWith(query);
      const bStartsWith = b.name.startsWith(query);
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return a.name.length - b.name.length; // Prefer shorter names
    });

    setFilteredLocations(results.slice(0, 10)); // Limit to 10 results
  }, [searchQuery, selectedDistrict, selectedProvince]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle location selection
  const handleSelectLocation = (location) => {
    const formattedLocation = `${location.displayName}, ${location.district}`;
    setSearchQuery(formattedLocation);
    onChange(formattedLocation);
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || filteredLocations.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredLocations.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredLocations.length) {
          handleSelectLocation(filteredLocations[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Clear selection
  const handleClear = () => {
    setSearchQuery('');
    onChange('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  // Check if current input matches a location
  const getMatchedLocation = () => {
    if (!searchQuery) return null;

    const query = searchQuery.toLowerCase();
    const match = locationsList.find(loc =>
      loc.name === query ||
      loc.displayName.toLowerCase() === query ||
      searchQuery.toLowerCase().includes(loc.name)
    );

    return match;
  };

  const matchedLocation = getMatchedLocation();

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Main Search Input */}
      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
              onChange(e.target.value);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error
                ? 'border-red-300 focus:ring-red-200'
                : matchedLocation
                ? 'border-green-300 focus:ring-green-200'
                : 'border-gray-300 focus:ring-yellow-200'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Match Indicator */}
        {matchedLocation && !showDropdown && (
          <div className="mt-2 flex items-center text-sm text-green-600">
            <Check className="w-4 h-4 mr-1" />
            <span>
              Matched: {matchedLocation.displayName}, {matchedLocation.district}, {matchedLocation.province}
            </span>
          </div>
        )}

        {/* Dropdown */}
        {showDropdown && (filteredLocations.length > 0 || searchQuery.length >= 1) && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
            {/* Filters */}
            <div className="p-3 border-b border-gray-200 bg-gray-50 space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-200"
                  >
                    <option value="">All Provinces</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-200"
                  >
                    <option value="">All Districts</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-60 overflow-y-auto">
              {filteredLocations.length > 0 ? (
                <ul className="py-1">
                  {filteredLocations.map((location, index) => (
                    <li
                      key={location.name}
                      onClick={() => handleSelectLocation(location)}
                      className={`px-4 py-2 cursor-pointer transition-colors ${
                        index === highlightedIndex
                          ? 'bg-yellow-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {location.displayName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {location.district}, {location.province}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : searchQuery.length >= 1 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No locations found matching "{searchQuery}"</p>
                  <p className="text-xs mt-1">Try searching for a major city or district</p>
                </div>
              ) : null}
            </div>

            {/* Quick Suggestions */}
            {searchQuery.length < 1 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="text-xs font-medium text-gray-500 mb-2">Popular Locations:</div>
                <div className="flex flex-wrap gap-2">
                  {['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo'].map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setSearchQuery(city);
                        setShowDropdown(true);
                      }}
                      className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Helper Text */}
      {!error && !matchedLocation && searchQuery && (
        <p className="text-xs text-gray-500">
          Start typing to see matching locations from our Sri Lankan database
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
