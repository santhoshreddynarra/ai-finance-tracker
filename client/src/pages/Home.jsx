import React from 'react';

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <div className="text-center p-8 bg-white shadow-xl rounded-2xl border border-gray-100 max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight mb-4">
          AI Finance Tracker
        </h1>
        <p className="text-gray-500 mb-6 text-lg">
          Your personal AI-powered financial assistant.
        </p>
        <div className="inline-block px-6 py-3 bg-blue-50 text-blue-700 font-medium rounded-lg">
          Phase 1 Complete
        </div>
      </div>
    </div>
  );
};

export default Home;
