import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const UpdateMaintenanceStatus = () => {
  const [status, setStatus] = useState("");
  const [assetId, setAssetId] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your maintenance status update logic here
    console.log("Maintenance status updated:", { assetId, status });
  };

  const handleResult = (result, error) => {
    if (result) {
      setAssetId(result.text);
      setScanning(false);
    }
    if (error) {
      console.error("QR Code Scan Error: ", error);
      setError(error.message);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">Update Maintenance Status</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="assetId" className="block text-sm font-medium text-gray-700">
            Asset ID
          </label>
          <input
            type="text"
            id="assetId"
            name="assetId"
            className="mt-1 p-2 w-full border rounded"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <textarea
            id="status"
            name="status"
            rows="4"
            className="mt-1 p-2 w-full border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-500 text-white font-medium rounded shadow-md hover:bg-green-600 transition duration-150"
        >
          Update
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={() => setScanning(true)}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded shadow-md hover:bg-blue-600 transition duration-150"
        >
          Scan Barcode
        </button>
      </div>

      {scanning && (
        <div className="mt-4">
          <QrReader
            delay={300}
            onResult={handleResult}
            style={{ width: "100%" }}
          />
          <button
            onClick={() => setScanning(false)}
            className="mt-2 px-4 py-2 bg-red-500 text-white font-medium rounded shadow-md hover:bg-red-600 transition duration-150"
          >
            Cancel
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 border border-red-300 rounded">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default UpdateMaintenanceStatus;