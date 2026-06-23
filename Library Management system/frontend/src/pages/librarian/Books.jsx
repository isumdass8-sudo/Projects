import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { useToast } from '../../components/Toast';

const SPINE_COLORS = ['spine-blue','spine-green','spine-purple','spine-amber','spine-rose','spine-teal'];
const spineFor = (id) => SPINE_COLORS[id % SPINE_COLORS.length];

function BookCard({ book, onEdit, onDelete }) {
  return (
    <div className={`bg-white dark:bg-navy-light rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 ${spineFor(book.id)} relative group`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-slate-100 dark:bg-navy-muted rounded-lg flex items-center justify-center text-xl shrink-0">📖</div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(book)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-muted text-slate-400 hover:text-indigo-600 text-xs transition-colors">✎</button>
          <button onClick={() => onDelete(book.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 text-xs transition-colors">✕</button>
        </div>
      </div>
      <h3 className="font-semibold text-navy dark:text-white text-sm mb-1 line-clamp-2 leading-snug">{book.title}</h3>
      {book.author_name && <p className="text-xs text-slate-400 mb-3">by {book.author_name}</p>}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-navy-muted">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${book.available_copies > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
          {book.available_copies > 0 ? `${book.available_copies} available` : 'All issued'}
        </span>
        {book.shelf_number && <span className="text-xs text-slate-400">📍 {book.shelf_number}</span>}
      </div>
      {book.isbn && <p className="text-xs text-slate-300 mt-2">ISBN: {book.isbn}</p>}
    </div>
  );
}

export default function LibrarianBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState({ title: '', isbn: '', total_copies: 1, shelf_number: '' });
  const [formError, setFormError] = useState('');
  const { show, ToastEl } = useToast();

  async function loadBooks() {
    try {
      const res = await api.get(`/books${search ? `?search=${search}` : ''}`);
      setBooks(res.data.books);
    } catch { } finally { setLoading(false); }
  }

  useEffect(() => { loadBooks(); }, [search]);

  const filtered = books.filter(b => {
    if (filter === 'available') return b.available_copies > 0;
    if (filter === 'issued') return b.available_copies === 0;
    return true;
  });

  function openAdd() { setEditBook(null); setForm({ title: '', isbn: '', total_copies: 1, shelf_number: '' }); setFormError(''); setShowForm(true); }
  function openEdit(book) { setEditBook(book); setForm({ title: book.title, isbn: book.isbn || '', total_copies: book.total_copies, shelf_number: book.shelf_number || '' }); setFormError(''); setShowForm(true); }

  async function handleSubmit(e) {
    e.preventDefault(); setFormError('');
    try {
      if (editBook) { await api.put(`/books/${editBook.id}`, form); show('Book updated successfully'); }
      else { await api.post('/books', form); show('Book added to catalog'); }
      setShowForm(false); loadBooks();
    } catch (err) { setFormError(err.response?.data?.message || 'Something went wrong'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this book from the catalog?')) return;
    try { await api.delete(`/books/${id}`); show('Book removed'); loadBooks(); }
    catch (err) { show(err.response?.data?.message || 'Delete failed', 'error'); }
  }

  return (
    <Layout>
      {ToastEl}
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy dark:text-white">Book Catalog</h1>
          <p className="text-slate-400 text-sm mt-0.5">{books.length} titles in the library</p>
        </div>
        <button onClick={openAdd} className="bg-amber hover:bg-amber-light text-navy font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
          + Add Book
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">⌕</span>
          <input type="text" placeholder="Search by title, author or ISBN..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-navy-muted rounded-lg text-sm bg-white dark:bg-navy-light dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/40" />
        </div>
        <div className="flex gap-1 bg-white dark:bg-navy-light border border-slate-200 dark:border-navy-muted rounded-lg p-1">
          {['all','available','issued'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors
              ${filter === f ? 'bg-navy text-white dark:bg-amber dark:text-navy' : 'text-slate-500 hover:text-navy dark:text-slate-400'}`}>{f}</button>
          ))}
        </div>
        <div className="flex gap-1 bg-white dark:bg-navy-light border border-slate-200 dark:border-navy-muted rounded-lg p-1">
          <button onClick={() => setView('grid')} className={`px-2.5 py-1.5 rounded-md text-xs transition-colors ${view==='grid' ? 'bg-navy text-white dark:bg-amber dark:text-navy' : 'text-slate-400 hover:text-navy'}`}>⊞</button>
          <button onClick={() => setView('list')} className={`px-2.5 py-1.5 rounded-md text-xs transition-colors ${view==='list' ? 'bg-navy text-white dark:bg-amber dark:text-navy' : 'text-slate-400 hover:text-navy'}`}>≡</button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-navy-light rounded-xl border border-amber/30 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-navy dark:text-white mb-4">{editBook ? 'Edit Book' : 'Add New Book'}</h2>
          {formError && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{formError}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">Title *</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full border border-slate-200 dark:border-navy-muted rounded-lg px-3 py-2.5 text-sm dark:bg-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">ISBN</label>
              <input value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})}
                className="w-full border border-slate-200 dark:border-navy-muted rounded-lg px-3 py-2.5 text-sm dark:bg-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">Total Copies</label>
              <input type="number" min="1" value={form.total_copies} onChange={e => setForm({...form, total_copies: parseInt(e.target.value)})}
                className="w-full border border-slate-200 dark:border-navy-muted rounded-lg px-3 py-2.5 text-sm dark:bg-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">Shelf Number</label>
              <input value={form.shelf_number} onChange={e => setForm({...form, shelf_number: e.target.value})}
                className="w-full border border-slate-200 dark:border-navy-muted rounded-lg px-3 py-2.5 text-sm dark:bg-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/40" />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button type="submit" className="bg-amber hover:bg-amber-light text-navy font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
                {editBook ? 'Save Changes' : 'Add to Catalog'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-muted transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Books Grid/List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading catalog...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-medium">No books found</p>
          <p className="text-sm mt-1">Try a different search or add a new book.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(book => <BookCard key={book.id} book={book} onEdit={openEdit} onDelete={handleDelete} />)}
        </div>
      ) : (
        <div className="bg-white dark:bg-navy-light rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-navy border-b border-slate-100 dark:border-navy-muted">
              <tr>{['Title','ISBN','Total','Available','Shelf',''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-navy-muted">
              {filtered.map(book => (
                <tr key={book.id} className="hover:bg-slate-50 dark:hover:bg-navy transition-colors">
                  <td className="px-5 py-3 font-medium text-navy dark:text-white">{book.title}</td>
                  <td className="px-5 py-3 text-slate-400 font-mono text-xs">{book.isbn || '—'}</td>
                  <td className="px-5 py-3 text-slate-500">{book.total_copies}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${book.available_copies > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{book.available_copies}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{book.shelf_number || '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(book)} className="text-indigo-500 hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(book.id)} className="text-red-400 hover:underline text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
