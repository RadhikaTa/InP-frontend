"use client";
import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import AiLogo from '../assets/iAI.png';
import Excel from '../assets/Excel.svg';
import Print from '../assets/Print.svg';
import Active from '../assets/Active-1.svg';
import Returnable from '../assets/Returnable.svg';
import Collision from '../assets/Collision.svg';
import Scrap from '../assets/Scrap.svg';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const data = [
    {
      id: 1,
      partNo: "0000 11 0154",
      description: "BLUB",
      onHandQty: 3,
      suggestedQty: 5,
      suggestedOrderQty: 2.05,
      dnp: 1,
      dmsLastSoldDate: "02/13/2025",
      lastPurchaseDate: "03/23/2025",
      dmsAge: "1",
      saleQty: 25,
      productHierarchy: "REPAIR ELECTRICAL"
    },
    {
      id: 2,
      partNo: "KXB4 03-220",
      description: "COVER COLUMN UPPER",
      onHandQty: 3,
      suggestedQty: 7,
      suggestedOrderQty: 5.0,
      dnp: 2,
      dmsLastSoldDate: "02/15/2025",
      lastPurchaseDate: "03/15/2024",
      dmsAge: "2",
      saleQty: 35,
      productHierarchy: "IDREL OTHER INTERIOR"
    },
    {
      id: 3,
      partNo: "0000 11 0187",
      description: "BLUB LOW BEAM",
      onHandQty: 50,
      suggestedQty: 30,
      suggestedOrderQty: 0.5,
      dnp: 0,
      dmsLastSoldDate: "02/27/2025",
      lastPurchaseDate: "02/27/2025",
      dmsAge: "5",
      saleQty: 332,
      productHierarchy: "REPAIR ELECTRICAL"
    },
    {
      id: 4,
      partNo: "VAB1-V9-004",
      description: "Crossbars, Black PIO-Set",
      onHandQty: 5,
      suggestedQty: 5,
      suggestedOrderQty: 1.8,
      dnp: 4,
      dmsLastSoldDate: "05/15/2025",
      lastPurchaseDate: "02/14/2025",
      dmsAge: "4",
      saleQty: 43,
      productHierarchy: "ACCESSORY ACCESSORY"
    },
    {
      id: 5,
      partNo: "VG47-V4-430",
      description: "Splash Guards, Front & Rear",
      onHandQty: 10,
      suggestedQty: 10,
      suggestedOrderQty: 20.7,
      dnp: 10,
      dmsLastSoldDate: "07/27/2024",
      lastPurchaseDate: "02/13/2025",
      dmsAge: "5",
      saleQty: 45,
      productHierarchy: "ACCESSORY ACCESSORY"
    }
  ];

  const inventoryChartData = {
    labels: ["Normal", "Drop Ship", "Idle", "Pre Idle"],
    datasets: [
      {
        data: [1922, 190, 120, 100],
        backgroundColor: ["#28a745", "#3399ff", "#ffc107", "#d63384"]
      }
    ]
  };

  const stockChartData = {
    labels: ["Others", "Suggested", "Excluded"],
    datasets: [
      {
        data: [1541, 476, 245],
        backgroundColor: ["#ffcc00", "#ff8800", "#adb5bd"]
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    cutout: '85%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 md:p-6 bg-white text-sm font-sans overflow-y-auto min-h-screen">
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
          <h2 className="font-bold text-sm text-center mb-2 uppercase">Inventory Health</h2>
          <Doughnut data={inventoryChartData} options={doughnutOptions} />
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-bold text-sm text-center mb-2 uppercase">Suggested Stocks</h2>
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
          <span className="flex items-center gap-1">Active <img src={Active} className="w-4 h-4" /></span>
          <span className="flex items-center gap-1">Returnable <img src={Returnable} className="w-4 h-4" /></span>
          <span className="flex items-center gap-1">Collision Part <img src={Collision} className="w-4 h-4" /></span>
          <span className="flex items-center gap-1">Scrap <img src={Scrap} className="w-4 h-4" /></span>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="min-w-[1200px] w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#2B2B2B] text-white uppercase h-11">
              {["✓", "Part No", "Part Description", "On Hand Qty", "Suggested Qty", "Order Qty", "DNP Qty", "DMS Last Sold", "DMS Age", "13 Month Qty", "17 Month Qty", "Product Hierarchy", "Item Info"].map((heading, i) => (
                <th key={i} className="px-3 py-2 text-left font-bold border border-[#E0E0E0] whitespace-nowrap">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white text-[#101010]">
            {data.map((item) => (
              <tr key={item.id} className="h-11">
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">
                  <input type="checkbox" className="accent-black" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)} />
                </td>
                <td className="border border-[#E0E0E0] px-3 py-2">{item.partNo}</td>
                <td className="border border-[#E0E0E0] px-3 py-2">{item.description}</td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">{item.onHandQty}</td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">{item.suggestedQty}</td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">{item.suggestedOrderQty}</td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">{item.dnp}</td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">{item.dmsLastSoldDate}</td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">{item.dmsAge}</td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">{item.saleQty}</td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center">{item.saleQty}</td>
                <td className="border border-[#E0E0E0] px-3 py-2">{item.productHierarchy}</td>
                <td className="border border-[#E0E0E0] px-3 py-2 text-center text-green-600">✔</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <ul className="flex gap-2 text-sm">
          {[1, 2, 3, 4, 5].map(n => (
            <li key={n} className={`px-3 py-1 border ${n === 1 ? 'bg-black text-white' : 'bg-white text-black'}`}>
              {n}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button className="bg-black text-white py-2 px-4 rounded text-sm">Generate Data File</button>
        <button className="bg-black text-white py-2 px-4 rounded text-sm">Transfer to VOR</button>
        <button className="bg-black text-white py-2 px-4 rounded text-sm">Transfer to Stock Order</button>
        <button className="bg-black text-white py-2 px-4 rounded text-sm">Reset</button>
      </div>
    </div>
  );
};

export default Dashboard;
