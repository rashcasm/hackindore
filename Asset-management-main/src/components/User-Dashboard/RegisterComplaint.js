import React, { useState, useRef } from "react";
import axios from 'axios'; // Import axios for HTTP requests

const RegisterComplaint = () => {
  const [complaint, setComplaint] = useState("");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });
  };

  const handleCapture = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    const imgData = canvasRef.current.toDataURL("image/png");
    setImageURL(imgData);
    setIsCameraOpen(false);
  };

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImageURL(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("complaint", complaint);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post('http://localhost:5000/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccessMessage("Complaint submitted successfully!");
        setComplaint("");
        setImage(null);
        setImageURL(null);
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">Register Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="complaint" className="block text-sm font-medium text-gray-700">
            Complaint Description
          </label>
          <textarea
            id="complaint"
            name="complaint"
            rows="4"
            className="mt-1 p-2 w-full border rounded"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Attach Image
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-emerald-500 text-white font-medium rounded shadow-md hover:bg-green-600 transition duration-150"
              onClick={handleOpenCamera}
            >
              Take Picture
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="upload"
            />
            <label htmlFor="upload" className="cursor-pointer px-4 py-2 bg-blue-500 text-white font-medium rounded shadow-md hover:bg-blue-600 transition duration-150">
              Upload Image
            </label>
          </div>
        </div>
        {imageURL && (
          <div className="mb-4">
            <img src={imageURL} alt="Captured" className="max-w-full h-auto rounded shadow" />
          </div>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-500 text-white font-medium rounded shadow-md hover:bg-green-600 transition duration-150"
        >
          Submit
        </button>
      </form>
      {successMessage && (
        <div className="mt-4 p-2 bg-green-500 text-white rounded">
          {successMessage}
        </div>
      )}

      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <video ref={videoRef} autoPlay className="w-80 h-60 bg-gray-800" />
            <canvas ref={canvasRef} className="hidden" width="640" height="480"></canvas>
            <button
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white font-medium px-4 py-2 rounded shadow-md"
              onClick={handleCapture}
            >
              Capture
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterComplaint;
