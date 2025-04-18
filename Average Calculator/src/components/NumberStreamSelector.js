import React, { useState } from 'react';
import axios from 'axios';

const NumberStreamSelector = () => {
  const [selectedType, setSelectedType] = useState('');
  const [average, setAverage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const types = {
    p: 'Prime',
    f: 'Fibonacci',
    e: 'Even',
    r: 'Random',
  };

  const handleStreamRequest = async () => {
    if (!selectedType) {
      setError('Please select a type');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`http://localhost:9876/numbers/${selectedType}`);
      const { average } = response.data;

      setAverage(average);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white space-y-6">
      <h2 className="text-xl font-semibold text-center">Number Stream Average</h2>

      <div className="flex justify-center gap-4">
        {Object.keys(types).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 border transition ${
              selectedType === type
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            {types[type]}
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleStreamRequest}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Get Average'}
        </button>
      </div>

      {average !== null && (
        <div className="text-center text-lg font-medium text-green-700">
          Average: {average}
        </div>
      )}

      {error && (
        <div className="text-center text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default NumberStreamSelector;
