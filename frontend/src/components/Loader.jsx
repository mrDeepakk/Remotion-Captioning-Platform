import React from 'react';

/**
 * Loader Component
 * Reusable loading spinner
 */
export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-400">{message}</p>
    </div>
  );
}
