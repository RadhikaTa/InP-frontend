"use client";
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import AiLogo from "../assets/iAI.png";
import Excel from "../assets/Excel.svg";
import Print from "../assets/Print.svg";
import Active from "../assets/Active-1.svg";
import Returnable from "../assets/Returnable.svg";
import Collision from "../assets/Collision.svg";
import Scrap from "../assets/Scrap.svg";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [partsData, setPartsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW PAGINATION STATE 
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch data from API
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/parts");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPartsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParts();
  }, []);

  
  // Data for the first chart
  const inventoryDataSource = [
    { label: "Normal", count: 1922, donatcolor: "#28a745" },
    { label: "Drop Ship", count: 190, donatcolor: "#3399ff" },
    { label: "Idle", count: 120, donatcolor: "#ffc107" },
    { label: "Pre Idle", count: 100, donatcolor: "#d63384" },
  ];

  // Data for the second chart
  const stockDataSource = [
    { label: "Others", count: 1541, donatcolor: "#ffcc00" },
    { label: "Suggested", count: 476, donatcolor: "#ff8800" },
    { label: "Excluded", count: 245, donatcolor: "#adb5bd" },
  ];

  // TRANSFORM DATA FOR CHART.JS
  
  // Automatically create the chart data structure from your source
  const inventoryChartData = {
    labels: inventoryDataSource.map(item => item.label),
    datasets: [
      {
        data: inventoryDataSource.map(item => item.count),
        backgroundColor: inventoryDataSource.map(item => item.donatcolor),
      },
    ],
  };

  // Automatically create the chart data structure from your source
  const stockChartData = {
    labels: stockDataSource.map(item => item.label),
    datasets: [
      {
        data: stockDataSource.map(item => item.count),
        backgroundColor: stockDataSource.map(item => item.donatcolor),
      },
    ],
  };
  
  const doughnutOptions = {
    responsive: true,
    // maintainAspectRatio: false,
    cutout: "85%",
    plugins: {
      legend: { display: false },
    },
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // --- NEW PAGINATION LOGIC ---
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // Get the parts for the *current page*
  const currentParts = partsData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(partsData.length / rowsPerPage);

  // Handlers for pagination buttons
  const goToNextPage = () => {
    setCurrentPage((page) => (page < totalPages ? page + 1 : page));
  };
  const goToPrevPage = () => {
    setCurrentPage((page) => (page > 1 ? page - 1 : page));
  };
  // ----------------------------

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 bg-white text-sm font-sans min-h-screen flex justify-center items-center">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-white text-sm font-sans min-h-screen flex justify-center items-center text-red-600">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white text-sm font-sans overflow-y-auto min-h-screen">
      {/* =================== TOP CARDS =================== */}
      {/* ... (same as before) ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="border p-4 rounded">
          <h2 className="font-bold text-sm mb-2 uppercase">Generate Graphs</h2>
          <p className="text-xs mb-3 text-gray-500">(At max 1 or 2)</p>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked readOnly className="accent-black" />
              Inventory Health
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked readOnly className="accent-black" />
              Suggested Stocks
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-black" />
              Idle & Pre Idle Inventory Trends
            </label>
          </div>
          <button className="bg-black text-white mt-4 w-full py-2 rounded text-sm">
            Generate Report
          </button>
        </div>
        <div className="border p-4 rounded">
          <h2 className="font-bold text-sm text-center mb-2 uppercase">
            Inventory Health
          </h2>
          <Doughnut data={inventoryChartData} options={doughnutOptions} />
        </div>
        <div className="border p-4 rounded">
          <h2 className="font-bold text-sm text-center mb-2 uppercase">
            Suggested Stocks
          </h2>
          <Doughnut data={stockChartData} options={doughnutOptions} />
        </div>
        <div className="border p-4 rounded">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <img src={AiLogo} alt="AI" className="w-9 h-5" />
            <h2 className="font-bold text-sm uppercase">Tips</h2>
          </div>
          <ul className="text-sm list-disc pl-5 space-y-1 text-red-600">
            <li>Suggested Stocks Below RDP 38</li>
            <li>Idle Inventory &gt; 2%</li>
            <li>Pre Idle Inventory &gt; 2%</li>
          </ul>
        </div>
      </div>

      {/* =================== BUTTONS & LEGENDS =================== */}
      {/* ... (same as before) ... */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <button className="bg-black text-white px-4 py-2 flex items-center gap-2 rounded text-sm">
            <img src={Excel} className="w-4 h-4" alt="Excel" /> Export to Excel
          </button>
          <button className="bg-black text-white px-4 py-2 flex items-center gap-2 rounded text-sm">
            <img src={Print} className="w-4 h-4" alt="Print" /> Print
          </button>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-mazda">
          <span className="font-semibold">LEGENDS:</span>
          <span className="flex items-center gap-1">
            Active <img src={Active} className="w-4 h-4" />
          </span>
          <span className="flex items-center gap-1">
            Returnable <img src={Returnable} className="w-4 h-4" />
          </span>
          <span className="flex items-center gap-1">
            Collision Part <img src={Collision} className="w-4 h-4" />
          </span>
          <span className="flex items-center gap-1">
            Scrap <img src={Scrap} className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* =================== DATA TABLE =================== */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="min-w-[1200px] w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#2B2B2B] text-white uppercase h-11">
              {/* UPDATED: Added an empty string for the checkbox column to fix alignment */}
              {[
                "", // For the checkbox
                "Part No",
                "Part Name",
                "Status",
                "Part Returnable fl",
                "Vendor No",
                "Oversize Hvywt Flag",
                "Hazmat Item Flag",
                "Inactive Date",
                "Case Pack Fctr",
                "Last Updated Tm",
                "Last Userid Cd",
              ].map((heading, i) => (
                <th
                  key={i}
                  className={`px-3 py-2 text-left font-bold border border-[#E0E0E0] whitespace-nowrap ${
                    i === 0 ? "w-12" : "" // Give first column a fixed width
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white text-[#101010]">
            {/* UPDATED: Map over `currentParts` instead of `partsData` */}
            {/* UPDATED: Using `item.id` as the key (assuming it's unique) */}
            {currentParts.map((item) => (
              <tr key={item.id} className="h-11">
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    className="accent-black"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                  />
                </td>
                <td className="border border-[#E0E0E0] px-3 py-2">
                  {item.part_no}
                </td>
                <td className="border border-[#E0E0E0] px-3 py-2">
                  {item.part_name}
                </td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">
                  {item.status}
                </td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">
                  {item.part_returnable_fl}
                </td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">
                  {item.vndr_no}
                </td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">
                  {item.ovrsize_hvywt_flag}
                </td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">
                  {item.hazmat_item_flag}
                </td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">
                  {item.inactive_date}
                </td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">
                  {item.case_pack_fctr}
                </td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">
                  {item.last_updt_tm}
                </td>
                <td className="border border-[#E0E0E0] px-3 py-2">
                  {item.last_userid_cd}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =================== PAGINATION =================== */}
      {/* UPDATED: This section is now dynamic */}
      <div className="flex justify-center mt-4">
        <ul className="flex gap-2 text-sm items-center">
          {/* Previous Button */}
          <li>
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 border bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt;
            </button>
          </li>
          
          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={`px-3 py-1 border cursor-pointer ${
                page === currentPage
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </li>
          ))}

          {/* Next Button */}
          <li>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </li>
        </ul>
      </div>

      {/* =================== BOTTOM BUTTONS =================== */}
      {/* ... (same as before) ... */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button className="bg-black text-white py-2 px-4 rounded text-sm">
          Generate Data File
        </button>
        <button className="bg-black text-white py-2 px-4 rounded text-sm">
          Transfer to VOR
        </button>
        <button className="bg-black text-white py-2 px-4 rounded text-sm">
          Transfer to Stock Order
        </button>
        <button className="bg-black text-white py-2 px-4 rounded text-sm">
          Reset
        </button>
      </div>
    </div>
  );
};

export default Dashboard;