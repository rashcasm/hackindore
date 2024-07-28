import React, { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import { UserContext } from '../custom-hooks/user';
import '../index.css';
import 'leaflet/dist/leaflet.css';
import AllocatedTable from './AllocatedTable';
import Navbar from './NavBar';

const Allocated = () => {
  const { user } = useContext(UserContext);
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('http://localhost:5000/assets');
        const data = await response.json();
        setAssets(data);
      } catch (err) {
        console.error("Error fetching assets: ", err);
      }
    };

    fetchAssets();
  }, []);

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
      } else if (command.includes("reset view")) {
        map.setView([22.7196, 75.8577], 13);
        setFilter("all");
      }
    };

    recognition.onerror = (event) => {
      console.error("Error occurred in recognition: ", event.error);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-3 bg-white shadow-lg rounded-lg p-4">
          <div className="mb-4">
            <button 
              onClick={startRecognition} 
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition duration-200"
            >
              Start Voice Command
            </button>
          </div>
          <div className="h-full">
            <MapContainer 
              center={[22.7196, 75.8577]} 
              zoom={13} 
              className="h-96 w-full rounded-lg shadow-sm" 
              whenCreated={setMap}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {assets.map((asset, index) => {
                if (asset.lat && asset.lng) {
                  return (
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
                  );
                } else {
                  console.warn(`Invalid coordinates for asset ${asset.name}:`, asset);
                  return null;
                }
              })}
            </MapContainer>
          </div>
        </div>
        <div className="col-span-9 min-h-screen pl-2">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-2xl font-semibold text-gray-800">My Assets</p>
            </div>
            <hr className="mb-4" />
            <AllocatedTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allocated;
