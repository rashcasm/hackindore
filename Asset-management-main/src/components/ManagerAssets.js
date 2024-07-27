import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import AssetsTable from "./AssetsTableAdm";
import '../index.css';
import 'leaflet/dist/leaflet.css';
import AddAssets from "./AddAssets";
import SideBar from "./SideBar";

const ManagerAssets = () => {
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState("all");
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
    ];
    setAssets(demoAssets);
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredAssets = assets.filter(asset =>
    filter === "all" || asset.type === filter
  );

  const getColor = (type, maintenance) => {
    if (maintenance) return "red";
    if (type === "vehicle") return "blue";
    if (type === "building") return "green";
    return "orange";
  };

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
		map.setView([22.7196, 75.8577], 13);
	  } else if (command.includes("show me vehicle assets")) {
		setFilter("vehicle");
	  } else if (command.includes("show me vehicles that need maintenance")) {
		const maintenanceAssets = assets.filter(asset => asset.type === "vehicle" && asset.maintenance);
		if (maintenanceAssets.length > 0) {
		  map.setView([maintenanceAssets[0].lat, maintenanceAssets[0].lng], 15);
		  setFilter("vehicle");
		}
	  } else if (command.includes("show all buildings")) {
		setFilter("building");
	  } else if (command.includes("zoom to all buildings")) {
		const buildingAssets = assets.filter(asset => asset.type === "building");
		if (buildingAssets.length > 0) {
		  map.setView([buildingAssets[0].lat, buildingAssets[0].lng], 15);
		}
	  } else if (command.includes("show all roads")) {
		setFilter("road");
	  } else if (command.includes("zoom to all roads")) {
		const roadAssets = assets.filter(asset => asset.type === "road");
		if (roadAssets.length > 0) {
		  map.setView([roadAssets[0].lat, roadAssets[0].lng], 15);
		}
	  } else if (command.includes("reset view")) {
		map.setView([22.7196, 75.8577], 13);
		setFilter("all");
	  } else if (command.includes("show maintenance required")) {
		const maintenanceAssets = assets.filter(asset => asset.maintenance);
		if (maintenanceAssets.length > 0) {
		  map.setView([maintenanceAssets[0].lat, maintenanceAssets[0].lng], 15);
		}
	  } else if (command.includes("show no maintenance needed")) {
		const noMaintenanceAssets = assets.filter(asset => !asset.maintenance);
		if (noMaintenanceAssets.length > 0) {
		  map.setView([noMaintenanceAssets[0].lat, noMaintenanceAssets[0].lng], 15);
		}
	  }
	};
  
	recognition.onerror = (event) => {
	  console.error("Error occurred in recognition: ", event.error);
	};
  
	recognition.start();
  };
  

  return (
    <div className="min-h-screen">
      <nav className="relative flex flex-wrap shadow-md">
        <div className="container mx-auto flex flex-wrap">
          <div className="w-full relative flex lg:w-auto lg:static flex">
            <p className="py-2 flex text-2xl uppercase font-bold leading-snug text-dark">SEMA</p>
          </div>
        </div>
      </nav>
      <div className='grid grid-cols-12'>
        <SideBar />
        <div className='col-span-3'>
          <div className="h-full p-2">
            <div className="filter-container mb-4">
              <label htmlFor="filter">Filter: </label>
              <select id="filter" onChange={handleFilterChange} className="ml-2 p-2 border border-gray-300 rounded-md">
                <option value="all">All</option>
                <option value="vehicle">Vehicle</option>
                <option value="building">Building</option>
                <option value="road">Road</option>
              </select>
            </div>
            <button onClick={startRecognition} className="p-2 bg-blue-500 text-white rounded-md">Start Voice Command</button>
            <div className="h-full">
              <MapContainer center={[22.7196, 75.8577]} zoom={13} className="h-full w-full" whenCreated={setMap}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredAssets.map((asset, index) => (
                  asset.lat && asset.lng && ( // Check if lat and lng are defined
                    <Circle
                      key={index}
                      center={[asset.lat, asset.lng]}
                      radius={100}
                      color={getColor(asset.type, asset.maintenance)}
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
        </div>
        <div className='col-span-9 min-h-screen pl-2 md:col-span-7'>
          <div className="relative flex flex-wrap items-center justify-between py-3 px-5">
            <p className="text-2xl">Assets Available</p>
            <AddAssets fetchAssets={fetchAssets} />
          </div>
          <hr />
          <AssetsTable assets={assets} />
        </div>
      </div>
    </div>
  );
};

export default ManagerAssets;
