// src/components/IndoreMap.js
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const IndoreMap = ({ assets }) => {
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredAssets = assets.filter(asset => 
    filter === "all" || asset.type === filter
  );

  return (
    <div className="h-full">
      <div className="filter-container">
        <label htmlFor="filter">Filter: </label>
        <select id="filter" onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="road">Road</option>
          <option value="building">Building</option>
          {/* Add more options as necessary */}
        </select>
      </div>
      <MapContainer center={[22.7196, 75.8577]} zoom={13} className="h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredAssets.map((asset, index) => (
          <Marker key={index} position={[asset.lat, asset.lng]}>
            <Popup>
              <b>{asset.name}</b><br />
              {asset.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IndoreMap;
