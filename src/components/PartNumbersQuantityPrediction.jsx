import React, { useState } from 'react';
import axios from 'axios';

// Array for all months
const allMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function PartNumbersQuantityPrediction() {
  const [dealerCode, setDealerCode] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [month, setMonth] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPrediction(null);

    console.log("Payload sent:", {
      dealer_code: dealerCode,
      part_number: partNumber,
      month: month
    });

    try {
      const res = await axios.post('http://127.0.0.1:8000/predict', {
        dealer_code: dealerCode.trim(),
        part_number: partNumber.trim(),
        month: month.trim(),
      });

      setPrediction(res.data.predicted_quantity);

    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        setError(`Prediction failed: ${error.response.data.detail || 'Server error'}`);
      } else if (error.request) {
        setError('Prediction failed. Is the server running and CORS configured?');
      } else {
        setError('Prediction failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-gray-50 font-sans">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Part Quantity Prediction
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Dealer Code */}
            <div>
              <label className="block text-gray-700 mb-2">Dealer Code</label>
              <select
                value={dealerCode}
                onChange={(e) => setDealerCode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select Dealer Code</option>

                {/* Only show valid dealer codes */}
                <option value="10131">10131</option>
              </select>
            </div>

            {/* Part Number */}
            <div>
              <label className="block text-gray-700 mb-2">Part Number</label>
              <input
                type="text"
                placeholder="Enter Part Number"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Month */}
            <div>
              <label className="block text-gray-700 mb-2">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select Month</option>
                {allMonths.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full md:w-auto bg-black hover:bg-gray-800 text-white rounded-lg px-12 py-3 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Predicting...' : 'Predict'}
            </button>
          </div>
        </form>

        {prediction !== null && (
          <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Predicted Quantity:
            </h3>
            <p className="text-5xl font-bold text-black">
              {prediction}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Error
            </h3>
            <p className="text-xl font-medium text-red-600">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
