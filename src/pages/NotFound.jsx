import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-blue-600 mb-2">404 error</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">
          Page not found
        </h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn&apos;t exist or has been moved. Check the URL, or
          use the navigation below to get back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

