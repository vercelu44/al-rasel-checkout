"use client";
import { useEffect, useState, useCallback } from "react";
import Modal from "../elements/Modal";
import { useDebounce } from "@/hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { setDeliveryAddressModalOpen } from "@/store/slices/commonSlice";

function GeoLocation() {
  const dispatch = useDispatch();
  const { isDeliveryAddressModalOpen } = useSelector((state) => state.common);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [userLocation, setUserLocation] = useState("");

  const debouncedSearchText = useDebounce(searchTerm, 300);

  // Function to fetch location name from coordinates
  const getLocationName = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch location");

      const data = await response.json();
      if (data.display_name) {
        // setUserLocation(data.display_name);
        localStorage.setItem("userLocation", JSON.stringify(data.display_name));
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  // Function to fetch search suggestions
  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      setSuggestions(data.map((place) => place.display_name));
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  }, []);

  // Handle selecting a suggestion
  const handleSelectLocation = (location) => {
    setUserLocation(location);
    setSearchTerm("");
    setSuggestions([]);
    localStorage.setItem("userLocation", JSON.stringify(location));
  };

  useEffect(() => {
    if (debouncedSearchText) {
      fetchSuggestions(debouncedSearchText);
    }
  }, [debouncedSearchText, fetchSuggestions]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getLocationName(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error obtaining location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handlePopupClose = () => {
    dispatch(setDeliveryAddressModalOpen(false));
  };

  const handleApply = () => {
    window.location.reload();
    handlePopupClose();
  };

  return (
    <Modal
      title="Select Delivery Location"
      showModal={isDeliveryAddressModalOpen}
      setShowModal={handlePopupClose}
    >
      <div className="relative mx-auto mt-4 h-[80vh] lg:h-[500px] lg:w-[600px]">
        <input
          type="text"
          placeholder="Search location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1 border border-gray-300 rounded-md"
        />

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul
            role="listbox"
            className="absolute w-full bg-white border rounded-md mt-1 max-h-60 overflow-auto shadow-md"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                role="option"
                aria-selected="false"
                onClick={() => handleSelectLocation(suggestion)}
                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        {/* Display Selected Location */}
        {userLocation && (
          <p className="mt-2 text-sm text-gray-700">
            <strong>Selected Location:</strong> {userLocation}
          </p>
        )}
        {/* Buttons */}
        <div className="flex mt-2 justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            onClick={handlePopupClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>

      </div>
    </Modal>
  );
}

export default GeoLocation;
