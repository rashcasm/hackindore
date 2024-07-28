import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Control } from "leaflet";
import AssetsTable from "./AssetsTableAdm";
import '../index.css';
import 'leaflet/dist/leaflet.css';
import AddAssets from "./AddAssets";
import SideBar from "./SideBar";
import Navbar from "./NavBar";

const MapTypeControl = ({ setMapType }) => {
  const map = useMap();

  useEffect(() => {
    const control = new Control({ position: 'bottomright' });

    const div = L.DomUtil.create('div', 'map-type-control');
    div.innerHTML = `
      <select id="mapType" class="map-type-select">
        <option value="streets">Streets</option>
        <option value="satellite">Satellite</option>
        <option value="hybrid">Hybrid</option>
      </select>
    `;

    div.onchange = (event) => {
      setMapType(event.target.value);
    };

    control.onAdd = () => {
      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map, setMapType]);

  return null;
};

const ManagerAssets = () => {
  const [assets, setAssets] = useState([]);
  const [assetTypeFilter, setAssetTypeFilter] = useState("all");
  const [maintenanceFilter, setMaintenanceFilter] = useState("all");
  const [mapType, setMapType] = useState("streets");
  const [map, setMap] = useState(null);

  const fetchAssets = async () => {
    try {
      const response = await fetch('http://localhost:5000/assets');
      const data = await response.json();
      setAssets(data);
    } catch (err) {
      console.error("Error fetching assets: ", err);
    }
  };

  useEffect(() => {
    const demoAssets = [
      { id: 1, name: "Vehicle 1", type: "vehicle", lat: 22.7196, lng: 75.8577, maintenance: true },
      { id: 2, name: "Building 1", type: "building", lat: 22.7230, lng: 75.8570, maintenance: false },
      { id: 3, name: "Road 1", type: "road", lat: 22.7200, lng: 75.8550, maintenance: true },
      { id: 4, name: "Vehicle 2", type: "vehicle", lat: 22.7190, lng: 75.8600, maintenance: false },
      { id: 5, name: "Building 2", type: "building", lat: 22.7180, lng: 75.8580, maintenance: true },
      { id: 6, name: "Vehicle 3", type: "vehicle", lat: 22.7160, lng: 75.8590, maintenance: false },
      { id: 7, name: "Building 3", type: "building", lat: 22.7210, lng: 75.8620, maintenance: true },
      { id: 8, name: "Road 2", type: "road", lat: 22.7170, lng: 75.8540, maintenance: false },
      { id: 9, name: "Vehicle 4", type: "vehicle", lat: 22.7150, lng: 75.8570, maintenance: true },
      { id: 10, name: "Building 4", type: "building", lat: 22.7195, lng: 75.8555, maintenance: false },
      { id: 11, name: "Vehicle 5", type: "vehicle", lat: 22.7215, lng: 75.8585, maintenance: true },
      { id: 12, name: "Road 3", type: "road", lat: 22.7185, lng: 75.8595, maintenance: false },
      { id: 13, name: "Building 5", type: "building", lat: 22.7205, lng: 75.8605, maintenance: true },
      { id: 14, name: "Vehicle 6", type: "vehicle", lat: 22.7199, lng: 75.8579, maintenance: false },
      { id: 15, name: "Road 4", type: "road", lat: 22.7189, lng: 75.8569, maintenance: true },
      { id: 16, name: "Building 6", type: "building", lat: 22.7229, lng: 75.8599, maintenance: false },
      { id: 17, name: "Vehicle 7", type: "vehicle", lat: 22.7239, lng: 75.8559, maintenance: true },
      { id: 18, name: "Road 5", type: "road", lat: 22.7249, lng: 75.8589, maintenance: false },
      { id: 19, name: "Building 7", type: "building", lat: 22.7259, lng: 75.8579, maintenance: true },
      { id: 20, name: "Vehicle 8", type: "vehicle", lat: 22.7269, lng: 75.8569, maintenance: false },
    ];
    setAssets(demoAssets);
  }, []);

  const handleFilterChange = (event) => {
    setAssetTypeFilter(event.target.value);
    setMaintenanceFilter("all");
  };

  const filteredAssets = assets.filter(asset => 
    (assetTypeFilter === "all" || asset.type === assetTypeFilter) &&
    (maintenanceFilter === "all" || (maintenanceFilter === "maintenance" && asset.maintenance) || (maintenanceFilter === "no-maintenance" && !asset.maintenance))
  );

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Voice recognition started. Speak into the microphone.");
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log("Command received: ", command);

      if (command.includes("zoom to indore")) {
        map?.setView([22.7196, 75.8577], 13);
      } else if (command.includes("show me vehicle assets")) {
        setAssetTypeFilter("vehicle");
        setMaintenanceFilter("all");
      } else if (command.includes("show me vehicles that need maintenance")) {
        setAssetTypeFilter("vehicle");
        setMaintenanceFilter("maintenance");
      } else if (command.includes("show all buildings")) {
        setAssetTypeFilter("building");
        setMaintenanceFilter("all");
      } else if (command.includes("show all roads")) {
        setAssetTypeFilter("road");
        setMaintenanceFilter("all");
      } else if (command.includes("reset view")) {
        map?.setView([22.7196, 75.8577], 13);
        setAssetTypeFilter("all");
        setMaintenanceFilter("all");
      } else if (command.includes("show maintenance required")) {
        setAssetTypeFilter("all");
        setMaintenanceFilter("maintenance");
      } else if (command.includes("show no maintenance needed")) {
        setAssetTypeFilter("all");
        setMaintenanceFilter("no-maintenance");
      }
    };

    recognition.onerror = (event) => {
      console.error("Error occurred in recognition: ", event.error);
    };

    recognition.start();
  };

  const indoreBounds = [
    [22.654, 75.762],
    [22.792, 75.964]
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className='grid grid-cols-12 gap-4 p-6'>
        <SideBar />
        <div className='col-span-12 md:col-span-5 lg:col-span-4 bg-white shadow-lg rounded-lg p-4 flex flex-col overflow-hidden' style={{ height: '75vh' }}>
          <div className="filter-container mb-4">
            <label htmlFor="filter" className="block text-gray-700 font-medium">Filter: </label>
            <select 
              id="filter" 
              onChange={handleFilterChange} 
              className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="all">All</option>
              <option value="vehicle">Vehicle</option>
              <option value="building">Building</option>
              <option value="road">Road</option>
            </select>
          </div>
          <button 
            onClick={startRecognition} 
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition duration-200"
          >
            Start Voice Command
          </button>
          <div className="mt-4 flex-grow overflow-hidden">
            <MapContainer 
              center={[22.7196, 75.8577]} 
              zoom={13} 
              className="h-full w-full rounded-lg shadow-sm" 
              whenCreated={setMap}
              maxBounds={indoreBounds}
              maxBoundsViscosity={1.0}
              minZoom={13}
            >
              <MapTypeControl setMapType={setMapType} />
              {mapType === "streets" && (
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              )}
              {mapType === "satellite" && (
                <TileLayer
                  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.opentopomap.org/copyright">OpenTopoMap</a> contributors'
                />
              )}
              {mapType === "hybrid" && (
                <TileLayer
                  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.opentopomap.org/copyright">OpenTopoMap</a> contributors'
                />
              )}
              {filteredAssets.map((asset, index) => (
                asset.lat && asset.lng && (
                  <Circle
                    key={index}
                    center={[asset.lat, asset.lng]}
                    radius={50}
                    color={asset.maintenance ? "red" : "green"}
                  >
                    <Popup>
                      <b>{asset.name}</b><br />
                      {asset.type}<br />
                      {asset.maintenance ? 'Needs Maintenance' : 'No Maintenance Needed'}
                    </Popup>
                  </Circle>
                )
              ))}
            </MapContainer>
          </div>
        </div>
        <div className='col-span-12 md:col-span-7 lg:col-span-6 bg-white shadow-lg rounded-lg p-6 overflow-auto' style={{ height: '75vh' }}>
          <div className="relative flex flex-wrap items-center justify-between mb-4">
            <p className="text-2xl font-semibold text-gray-800">Assets of Indore Municipal Corporation</p>
            <AddAssets fetchAssets={fetchAssets} />
          </div>
          <hr className="mb-4" />
          <div className="table-container overflow-auto">
            <AssetsTable assets={assets} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerAssets;
