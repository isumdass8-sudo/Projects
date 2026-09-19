import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-ktma flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-semibold text-gold-500">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-teal-950">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        The page you&rsquo;re looking for may have moved. Let&rsquo;s get you back on the trail.
      </p>
      <Link to="/" className="btn-primary mt-8">Back to home</Link>
    </div>
  );
}
