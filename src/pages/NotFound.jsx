import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="bg-beige min-h-[60vh] flex items-center">
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <p className="text-6xl font-bold text-navy mb-2">404</p>
        <h1 className="text-2xl font-bold text-navy mb-3">Page Not Found</h1>
        <p className="text-teal mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="bg-navy text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors">
            Back to Home
          </Link>
          <Link to="/features" className="bg-white text-navy border border-skyblue font-semibold px-6 py-2.5 rounded-lg hover:bg-skyblue/30 transition-colors">
            Browse Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
