import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-display font-bold text-harbor mb-3">404</h1>
      <p className="text-ink/60 mb-6">This page doesn't exist.</p>
      <Link to="/" className="text-harbor font-medium underline underline-offset-4">
        Back to Home
      </Link>
    </div>
  );
}
