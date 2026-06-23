import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const SPINE_COLORS = ['spine-blue','spine-green','spine-purple','spine-amber','spine-rose','spine-teal'];
const spineFor = id => SPINE_COLORS[id % SPINE_COLORS.length];

export default function MemberBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/books${search ? `?search=${search}` : ''}`);
        setBooks(res.data.books);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [search]);

  const filtered = books.filter(b => {
    if (filter === 'available') return b.available_copies > 0;
    if (filter === 'unavailable') return b.available_copies === 0;
    return true;
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy dark:text-white">Browse Catalog</h1>
        <p className="text-slate-400 text-sm mt-0.5">{books.length} titles available to explore</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">⌕</span>
          <input type="text" placeholder="Search by title, author or ISBN..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-navy-muted rounded-lg text-sm bg-white dark:bg-navy-light dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/40" />
        </div>
        <div className="flex gap-1 bg-white dark:bg-navy-light border border-slate-200 dark:border-navy-muted rounded-lg p-1">
          {['all','available','unavailable'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors
              ${filter===f ? 'bg-navy text-white dark:bg-amber dark:text-navy' : 'text-slate-400 hover:text-navy dark:hover:text-white'}`}>{f}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading catalog...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-medium">No books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(book => (
            <div key={book.id} className={`bg-white dark:bg-navy-light rounded-xl shadow-sm hover:shadow-md transition-all p-5 ${spineFor(book.id)}`}>
              <div className="w-10 h-10 bg-slate-100 dark:bg-navy-muted rounded-lg flex items-center justify-center text-xl mb-3">📖</div>
              <h3 className="font-semibold text-navy dark:text-white text-sm mb-1 line-clamp-2">{book.title}</h3>
              {book.author_name && <p className="text-xs text-slate-400 mb-1">by {book.author_name}</p>}
              {book.isbn && <p className="text-xs text-slate-300 mb-3 font-mono">ISBN: {book.isbn}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-navy-muted">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${book.available_copies > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                  {book.available_copies > 0 ? `${book.available_copies} available` : 'Unavailable'}
                </span>
                {book.shelf_number && <span className="text-xs text-slate-400">📍 {book.shelf_number}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
