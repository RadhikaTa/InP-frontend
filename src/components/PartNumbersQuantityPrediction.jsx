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
    setPrediction(null); // Clear previous prediction

    try {
      // Ensure the endpoint is correct (e.g., http://127.0.0.1:8000/predict)
      const res = await axios.post('http://127.0.0.1:8000/predict', {
        dealer_code: dealerCode,
        part_number: partNumber,
        month: month
      });
      setPrediction(res.data.predicted_quantity);
    } catch (error) {
      console.error('Error:', error);
      // Check for CORS or network errors
      if (error.response) {
        setError(`Prediction failed: ${error.response.data.detail || 'Server error'}`);
      } else if (error.request) {
        // This error (e.g., CORS, net::ERR_FAILED) means the server is unreachable
        setError('Prediction failed. Is the server running and CORS configured?');
      } else {
        // Other JS errors
        setError('Prediction failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Use font-sans to match dashboard
    <div className="flex flex-row items-center justify-center min-h-screen bg-gray-50 font-sans">
      {/* Container is wider to accommodate the horizontal layout */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Part Quantity Prediction
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Horizontal Grid for Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Dealer Code */}
            <div>
              <label className="block text-gray-700 mb-2">Dealer Code</label>
              <select
                value={dealerCode}
                onChange={(e) => setDealerCode(e.target.value)}
                // Updated styles to match dashboard (black focus ring)
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select Dealer Code</option>
                <option value="10131">10131</option>
                <option value="23454">23454</option>
                <option value="23925">23925</option>
                <option value="34318">34318</option>
                <option value="51485">51485</option>
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

            {/* Month (All 12) */}
            <div>
              <label className="block text-gray-700 mb-2">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select Month</option>
                {/* Map over all 12 months */}
                {allMonths.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button (Centered, black to match dashboard) */}
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

        {/* --- RESULT SECTION (BELOW THE FORM) --- */}

        {/* Prediction Result (Displayed Below) */}
        {prediction !== null && (
          <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Predicted Quantity:
            </h3>
            {/* Larger font for the result */}
            <p className="text-5xl font-bold text-black">
              {prediction}
            </p>
          </div>
        )}

        {/* Error Message (Replaces alert) */}
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