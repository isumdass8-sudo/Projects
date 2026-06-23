import { useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { useToast } from '../../components/Toast';

// --- CSV Export ---
function exportCSV(data, filename) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const header = keys.join(',');
  const rows = data.map(row =>
    keys.map(k => {
      const v = row[k] === null || row[k] === undefined ? '' : String(row[k]);
      return v.includes(',') ? `"${v}"` : v;
    }).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// --- PDF Export using jsPDF ---
async function exportPDF(data, title, columns) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(14);
  doc.text(title, 14, 15);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);
  autoTable(doc, {
    head: [columns.map(c => c.label)],
    body: data.map(row => columns.map(c => {
      const v = row[c.key];
      if (v === null || v === undefined) return '—';
      if (typeof v === 'boolean') return v ? 'Yes' : 'No';
      if (c.key.includes('date') && v) return String(v).split('T')[0];
      return String(v);
    })),
    startY: 26,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [26, 35, 50] },
    alternateRowStyles: { fillColor: [248, 247, 244] },
  });
  doc.save(`${title.toLowerCase().replace(/ /g, '_')}.pdf`);
}

// Column definitions per report type
const COLUMNS = {
  issues: [
    { key: 'id', label: 'ID' }, { key: 'book', label: 'Book' },
    { key: 'isbn', label: 'ISBN' }, { key: 'member', label: 'Member' },
    { key: 'student_id', label: 'Student ID' }, { key: 'issue_date', label: 'Issue Date' },
    { key: 'due_date', label: 'Due Date' }, { key: 'return_date', label: 'Return Date' },
    { key: 'status', label: 'Status' },
  ],
  books: [
    { key: 'id', label: 'ID' }, { key: 'title', label: 'Title' },
    { key: 'isbn', label: 'ISBN' }, { key: 'author', label: 'Author' },
    { key: 'category', label: 'Category' }, { key: 'total_copies', label: 'Total' },
    { key: 'available_copies', label: 'Available' }, { key: 'shelf_number', label: 'Shelf' },
  ],
  fines: [
    { key: 'id', label: 'ID' }, { key: 'book', label: 'Book' },
    { key: 'member', label: 'Member' }, { key: 'due_date', label: 'Due Date' },
    { key: 'return_date', label: 'Returned' }, { key: 'amount', label: 'Amount (Rs.)' },
    { key: 'paid', label: 'Paid' }, { key: 'payment_date', label: 'Payment Date' },
  ],
};

export default function Reports() {
  const [type, setType]     = useState('issues');
  const [from, setFrom]     = useState('');
  const [to, setTo]         = useState('');
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const { show, ToastEl }   = useToast();

  async function generate() {
    setLoading(true); setGenerated(false);
    try {
      const params = new URLSearchParams({ type });
      if (from) params.set('from', from);
      if (to)   params.set('to', to);
      const res = await api.get(`/stats/report?${params}`);
      setData(res.data.report);
      setGenerated(true);
      if (res.data.report.length === 0) show('No records found for the selected filters.', 'warning');
    } catch (err) {
      show(err.response?.data?.message || 'Failed to generate report', 'error');
    } finally { setLoading(false); }
  }

  const cols = COLUMNS[type];
  const titles = { issues: 'Issue Report', books: 'Book Inventory Report', fines: 'Fines Report' };

  function fmtCell(row, col) {
    const v = row[col.key];
    if (v === null || v === undefined) return <span className="text-slate-300">—</span>;
    if (typeof v === 'boolean') return v ? <span className="text-emerald-600 text-xs font-medium">Yes</span> : <span className="text-red-400 text-xs">No</span>;
    if (col.key.includes('date') && v) return String(v).split('T')[0];
    if (col.key === 'status') return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
        ${v === 'returned' ? 'bg-emerald-50 text-emerald-700' : v === 'issued' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{v}</span>
    );
    return String(v);
  }

  return (
    <Layout>
      {ToastEl}

      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy dark:text-white">Reports</h1>
        <p className="text-slate-400 text-sm mt-0.5">Generate, view and export library data reports.</p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-navy-light rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">

          {/* Report type */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1.5">Report Type</label>
            <div className="flex gap-1 border border-slate-200 dark:border-navy-muted rounded-lg p-1">
              {Object.keys(COLUMNS).map(t => (
                <button key={t} onClick={() => { setType(t); setData([]); setGenerated(false); }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors
                    ${type===t ? 'bg-navy text-white dark:bg-amber dark:text-navy' : 'text-slate-500 hover:text-navy dark:text-slate-400'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date range (only for issues and fines) */}
          {type !== 'books' && (
            <>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1.5">From</label>
                <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                  className="border border-slate-200 dark:border-navy-muted rounded-lg px-3 py-2 text-sm dark:bg-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/40" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1.5">To</label>
                <input type="date" value={to} onChange={e => setTo(e.target.value)}
                  className="border border-slate-200 dark:border-navy-muted rounded-lg px-3 py-2 text-sm dark:bg-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/40" />
              </div>
            </>
          )}

          <button onClick={generate} disabled={loading}
            className="bg-amber hover:bg-amber-light text-navy font-semibold px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? '⏳ Generating...' : '▶ Generate Report'}
          </button>
        </div>
      </div>

      {/* Results */}
      {generated && (
        <>
          {/* Export buttons */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-navy dark:text-white">{data.length}</span> records found
            </p>
            {data.length > 0 && (
              <div className="flex gap-2">
                <button onClick={() => exportCSV(data, `${type}_report.csv`)}
                  className="flex items-center gap-1.5 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                  ⬇ Export CSV
                </button>
                <button onClick={() => exportPDF(data, titles[type], cols)}
                  className="flex items-center gap-1.5 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                  ⬇ Export PDF
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          {data.length === 0 ? (
            <div className="bg-white dark:bg-navy-light rounded-xl p-12 text-center text-slate-400">
              <p className="text-3xl mb-2">📭</p>
              <p className="font-medium">No records found</p>
              <p className="text-sm mt-1">Try adjusting your filters or date range.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-navy-light rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-navy border-b border-slate-100 dark:border-navy-muted">
                  <tr>
                    {cols.map(c => (
                      <th key={c.key} className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide whitespace-nowrap">{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-navy-muted">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-navy transition-colors">
                      {cols.map(col => (
                        <td key={col.key} className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {fmtCell(row, col)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!generated && !loading && (
        <div className="bg-white dark:bg-navy-light rounded-xl p-16 text-center text-slate-300">
          <p className="text-5xl mb-4">📊</p>
          <p className="font-medium text-slate-400">Select a report type and click Generate</p>
          <p className="text-sm mt-1 text-slate-300">Reports can be exported as CSV or PDF.</p>
        </div>
      )}
    </Layout>
  );
}
