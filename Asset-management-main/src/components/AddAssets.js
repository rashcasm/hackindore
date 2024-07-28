import React, { useState, useRef } from 'react';
import Barcode from 'react-barcode'; // Import barcode component
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const generateUID = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  const length = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // Random length between 5 and 10
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const departments = [
  "Administration",
  "Finance and Accounts",
  "Public Health",
  "Urban Planning and Development",
  "Water Supply and Sewerage",
  "Education",
  "Environment",
  "Solid Waste Management",
  "Parks and Gardens",
  "Fire",
  "Public Relations",
  "Legal",
  "Social Welfare",
  "Housing and Slum Development",
  "Electricity",
  "Traffic and Transportation"
];

const categoriesByDepartment = {
  "Administration": ["Computer", "Office Supplies"],
  "Finance and Accounts": ["Financial Software", "Accounting Books"],
  "Public Health": ["Medical Equipment", "Sanitizers"],
  "Urban Planning and Development": ["Survey Tools", "Maps"],
  "Water Supply and Sewerage": ["Pipes", "Water Testing Kits"],
  "Education": ["Books", "Stationery"],
  "Environment": ["Plant Equipment", "Soil Testers"],
  "Solid Waste Management": ["Waste Bins", "Recycling Equipment"],
  "Parks and Gardens": ["Garden Tools", "Benches"],
  "Fire": ["Fire Extinguishers", "Safety Gear"],
  "Public Relations": ["Media Equipment", "Promotional Material"],
  "Legal": ["Law Books", "Office Supplies"],
  "Social Welfare": ["Relief Supplies", "Counseling Materials"],
  "Housing and Slum Development": ["Construction Tools", "Building Materials"],
  "Electricity": ["Transformers", "Cables"],
  "Traffic and Transportation": ["Traffic Cones", "Road Signs"]
};

const AddAssets = ({ fetchAssets }) => {
  const [showModal, setShowModal] = useState(false);
  const [uid, setUid] = useState('');
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [assetCreated, setAssetCreated] = useState(false); // State to track if asset was created
  const token = localStorage.getItem("jwt");
  const barcodeRef = useRef(null); // Reference for barcode container

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("department", department);
    formData.append("name", name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("user_id", 1);
    formData.append("status", true); // Set status to true (Allocated)
    formData.append("owner", department); // Add owner field with department name
    if (image) {
      formData.append("image", image);
    }
  
    try {
      const response = await fetch('http://localhost:5000/assets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const text = await response.text(); // Get the raw response text
      console.log('Raw response text:', text); // Log the raw response text
      const data = JSON.parse(text); // Parse the JSON manually
      if (response.ok) {
        // Generate UID and show barcode
        const newUid = generateUID();
        setUid(newUid);
        setAssetCreated(true); // Set asset created state to true
        fetchAssets();
      } else {
        alert(`Error creating asset: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error creating asset: " + err.message);
    }
  };
  

  const handleDownloadBarcode = () => {
    if (barcodeRef.current) {
      html2canvas(barcodeRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10);
        pdf.save('barcode.pdf');
      });
    }
  };

  const handlePrintBarcode = () => {
    if (barcodeRef.current) {
      html2canvas(barcodeRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const printWindow = window.open('', '', 'width=600,height=400');
        printWindow.document.write('<html><head><title>Print Barcode</title></head><body>');
        printWindow.document.write('<img src="' + imgData + '" style="width: 100%;">');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      });
    }
  };

  return (
    <>
      <button
        type="button"
        className="inline-block px-6 py-2.5 bg-emerald-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
        onClick={() => setShowModal(true)}
      >
        Add Asset
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none" style={{ zIndex: 1050 }}>
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-400 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Add New Asset</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                      <label
                        htmlFor="department"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        id="department"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept, index) => (
                          <option key={index} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter Asset's Name"
                        required
                      />
                      <label
                        htmlFor="category"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        id="category"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {department && categoriesByDepartment[department].map((cat, index) => (
                          <option key={index} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="description"
                        rows="4"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Describe asset"
                        required
                      ></textarea>
                      <label
                        htmlFor="image"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Attach Image
                      </label>
                      <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Submit
                    </button>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          {assetCreated && (
            <div className="fixed inset-0 flex items-center justify-center z-50" style={{ zIndex: 1060 }}>
              <div className="relative w-auto my-6 mx-auto max-w-3xl bg-white p-5 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Barcode</h3>
                  <button
                    className="text-red-500 font-bold text-lg"
                    onClick={() => {
                      setAssetCreated(false); // Reset the asset created state
                      setUid(''); // Clear the UID
                    }}
                  >
                    ×
                  </button>
                </div>
                <div ref={barcodeRef} className="mb-4">
                  <Barcode value={uid} />
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleDownloadBarcode}
                  >
                    Download Barcode
                  </button>
                  <button
                    className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handlePrintBarcode}
                  >
                    Print Barcode
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </>
  );
};

export default AddAssets;
