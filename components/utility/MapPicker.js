"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: "/assets/icons/location/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to handle clicks on the map
function LocationMarker({ setSelectedCoords, getLocationName }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setSelectedCoords([lat, lng]);
      getLocationName(lat, lng);
    },
  });

  return null;
}

// Main Map Component
const MapPicker = ({ selectedCoords, setSelectedCoords, getLocationName }) => {
  if (!selectedCoords) return null;

  return (
    <MapContainer
      center={selectedCoords}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-full rounded-md"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker setSelectedCoords={setSelectedCoords} getLocationName={getLocationName} />
      <Marker position={selectedCoords} icon={markerIcon} />
    </MapContainer>
  );
};

export default MapPicker;
