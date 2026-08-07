import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MapView from '../components/MapView';
import { atmsApi, userApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const DETAIL_ROWS = [
  ['bank_name', 'Bank'],
  ['address', 'Address'],
  ['city', 'City'],
  ['district_name', 'District'],
  ['is_24_hours', '24 Hours', 'bool'],
  ['cash_deposit', 'Cash Deposit', 'bool'],
  ['wheelchair_access', 'Wheelchair Access', 'bool'],
  ['drive_through', 'Drive Through', 'bool'],
  ['foreign_card', 'Foreign Card Accepted', 'bool'],
  ['latitude', 'Latitude'],
  ['longitude', 'Longitude'],
];

function formatValue(value, type) {
  if (type === 'bool') return value ? 'Yes' : 'No';
  return value ?? '—';
}

export default function ATMDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [atm, setAtm] = useState(null);
  const [feedback, setFeedback] = useState({ feedback: [], summary: {} });
  const [isFavorite, setIsFavorite] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportStatus, setReportStatus] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    atmsApi.getById(id).then(setAtm).catch(() => {});
    atmsApi.getFeedback(id).then(setFeedback).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!user) return;
    userApi.getFavorites().then((favs) => {
      setIsFavorite(favs.some((f) => String(f.atm_id) === String(id)));
    });
  }, [user, id]);

  async function toggleFavorite() {
    if (!user) return;
    if (isFavorite) {
      await userApi.removeFavorite(id);
    } else {
      await userApi.addFavorite(id);
    }
    setIsFavorite(!isFavorite);
  }

  async function submitReport(e) {
    e.preventDefault();
    if (!reportText.trim()) return;
    await atmsApi.reportProblem(id, reportText.trim());
    setReportStatus('Thanks — this has been reported to the admin team.');
    setReportText('');
  }

  async function submitFeedback(e) {
    e.preventDefault();
    if (!user) return;
    await atmsApi.submitFeedback(id, { rating, comment, machine_working: true, cash_available: true });
    setComment('');
    const updated = await atmsApi.getFeedback(id);
    setFeedback(updated);
  }

  if (!atm) return <div className="max-w-4xl mx-auto px-4 py-10 text-ink/50">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-harbor font-semibold uppercase tracking-wide">
            {atm.bank_name}
          </p>
          <h1 className="text-3xl font-display font-bold text-ink">{atm.name}</h1>
        </div>
        {user && (
          <button
            onClick={toggleFavorite}
            className={`shrink-0 px-4 py-2 rounded border font-medium text-sm ${
              isFavorite
                ? 'bg-coral text-white border-coral'
                : 'border-mist text-ink/70 hover:border-coral hover:text-coral'
            }`}
          >
            {isFavorite ? '❤ Favorited' : '♡ Add to Favorites'}
          </button>
        )}
      </div>

      <div className="h-64 rounded overflow-hidden border border-mist mb-6">
        <MapView atms={[atm]} focusLocation={{ lat: atm.latitude, lng: atm.longitude }} />
      </div>

      <div className="bg-white border border-mist rounded p-5 mb-6">
        <h2 className="font-display font-semibold text-lg mb-3">ATM Details</h2>
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {DETAIL_ROWS.map(([key, label, type]) => (
            <div key={key} className="flex justify-between border-b border-mist py-1.5 text-sm">
              <dt className="text-ink/50">{label}</dt>
              <dd className="font-medium text-ink">{formatValue(atm[key], type)}</dd>
            </div>
          ))}
        </dl>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${atm.latitude},${atm.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 px-5 py-2 bg-gold text-ink font-medium rounded hover:brightness-95"
        >
          Get Directions
        </a>
      </div>

      {/* Feedback */}
      <div className="bg-white border border-mist rounded p-5 mb-6">
        <h2 className="font-display font-semibold text-lg mb-1">Feedback</h2>
        <p className="text-sm text-ink/50 mb-4">
          {feedback.summary?.avg_rating
            ? `${feedback.summary.avg_rating} ★ average (${feedback.summary.total} reviews)`
            : 'No reviews yet'}
        </p>

        <div className="space-y-3 mb-4">
          {feedback.feedback?.slice(0, 5).map((f) => (
            <div key={f.feedback_id} className="border-b border-mist pb-2">
              <p className="text-sm font-medium">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)} <span className="text-ink/40 font-normal">— {f.user_name}</span></p>
              {f.comment && <p className="text-sm text-ink/70 mt-0.5">{f.comment}</p>}
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={submitFeedback} className="space-y-2">
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="px-3 py-2 rounded border border-mist text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional comment..."
              className="w-full px-3 py-2 rounded border border-mist text-sm"
              rows={2}
            />
            <button type="submit" className="px-4 py-2 bg-harbor text-paper rounded text-sm font-medium">
              Submit Feedback
            </button>
          </form>
        ) : (
          <p className="text-sm text-ink/50">Log in to leave feedback.</p>
        )}
      </div>

      {/* Report problem */}
      <div className="bg-coral/5 border border-coral/20 rounded p-5">
        <h2 className="font-display font-semibold text-lg text-coral mb-2">Report a Problem</h2>
        <form onSubmit={submitReport} className="flex gap-2">
          <input
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="e.g. Machine out of service"
            className="flex-1 px-3 py-2 rounded border border-mist text-sm"
          />
          <button type="submit" className="px-4 py-2 bg-coral text-white rounded text-sm font-medium">
            Submit
          </button>
        </form>
        {reportStatus && <p className="text-sm text-coral mt-2">{reportStatus}</p>}
      </div>
    </div>
  );
}
