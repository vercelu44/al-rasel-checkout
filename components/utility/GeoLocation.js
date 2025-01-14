"use client";
import { useEffect } from "react";

function GeoLocation() {
  useEffect(() => {
    const getLocationName = async (latitude, longitude) => {
      //   const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key
      //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data, "sdsdsdsdsds");
        if (data.display_name) {
          const humanReadableLocation = data.display_name;
          // console.log(humanReadableLocation, "hei hei");
          //   setLocationName(humanReadableLocation);

          // Save to localStorage
          localStorage.setItem(
            "userLocation",
            JSON.stringify(humanReadableLocation)
          );
        } else {
          console.error("No address found for the given coordinates");
        }
      } catch (error) {
        console.error("Error fetching location name:", error);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Convert coordinates to a human-readable location
          getLocationName(latitude, longitude);
        },
        (error) => {
          console.error("Error obtaining location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return null;
}

export default GeoLocation;
