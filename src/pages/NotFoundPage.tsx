import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="mt-4 mb-8 text-4xl font-semibold">Page Not Found</h2>
        <p className="mb-8 text-lg text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};
