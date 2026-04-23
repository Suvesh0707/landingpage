'use client';

import { useEffect, useState, useRef } from 'react';

type Submission = {
  index: number;
  fullName: string;
  phone: string;
  timestamp: string;
};

export default function Dashboard() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [newCount, setNewCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const prevLengthRef = useRef(0);

  const handleDownload = () => {
    window.location.href = '/api/export';
  };

  useEffect(() => {
    const es = new EventSource('/api/submissions/stream');

    es.onopen = () => setConnected(true);

    es.onmessage = (event) => {
      const json: Submission[] = JSON.parse(event.data);
      setData(json);
      setLoading(false);
      setConnected(true);
      setLastUpdated(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

      if (prevLengthRef.current > 0 && json.length > prevLengthRef.current) {
        const diff = json.length - prevLengthRef.current;
        setNewCount(diff);
        setTimeout(() => setNewCount(0), 3500);
      }
      prevLengthRef.current = json.length;
    };

    es.onerror = () => setConnected(false);

    return () => es.close();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Submissions</h1>
            {lastUpdated && (
              <p style={styles.subtitle}>Last updated: {lastUpdated}</p>
            )}
          </div>
          <button onClick={handleDownload} style={styles.downloadBtn}>
            ↓ Export Excel
          </button>
        </div>

        {/* New data toast */}
        {newCount > 0 && (
          <div style={styles.toast}>
            +{newCount} new submission{newCount > 1 ? 's' : ''} received
          </div>
        )}

        {/* Stats bar */}
        {!loading && (
          <div style={styles.statsBar}>
            <div style={styles.statCard}>
              <span style={styles.statNum}>{data.length}</span>
              <span style={styles.statLabel}>Total Submissions</span>
            </div>
            <div style={{ ...styles.statCard, ...styles.liveCard }}>
              <span style={{ ...styles.liveDot, background: connected ? '#10b981' : '#f59e0b' }} />
              <span style={styles.statLabel}>{connected ? 'Live' : 'Reconnecting…'}</span>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={styles.empty}>Connecting…</div>
        ) : data.length === 0 ? (
          <div style={styles.empty}>No submissions yet.</div>
        ) : (
          <div style={styles.tableWrap}>
            {/* Desktop table */}
            <table style={styles.table} className="dash-table">
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Full Name</th>
                  <th style={styles.th}>Phone Number</th>
                  <th style={styles.th}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.index} style={styles.tr}>
                    <td style={styles.tdIndex}>{row.index}</td>
                    <td style={styles.td}>{row.fullName}</td>
                    <td style={styles.td}>{row.phone}</td>
                    <td style={{ ...styles.td, ...styles.tdMuted }}>{row.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="dash-cards">
              {data.map((row) => (
                <div key={row.index} style={styles.card}>
                  <div style={styles.cardTop}>
                    <span style={styles.cardIndex}>#{row.index}</span>
                    <span style={styles.cardTime}>{row.timestamp}</span>
                  </div>
                  <p style={styles.cardName}>{row.fullName}</p>
                  <p style={styles.cardPhone}>{row.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && data.length > 0 && (
          <div style={styles.footer}>
            Total: <strong>{data.length}</strong> submissions
          </div>
        )}
      </div>

      <style>{`
        .dash-table { display: table; }
        .dash-cards { display: none; }
        @media (max-width: 600px) {
          .dash-table { display: none !important; }
          .dash-cards { display: flex; flex-direction: column; gap: 10px; padding: 12px; }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: 'Arial, sans-serif',
    background: '#f0f2f5',
    minHeight: '100vh',
    padding: '24px 16px',
  },
  container: {
    maxWidth: '960px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 800,
    color: '#1a1a1a',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#999',
  },
  downloadBtn: {
    background: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
  },
  toast: {
    background: '#2563eb',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '16px',
    textAlign: 'center',
  },
  statsBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  statCard: {
    background: '#fff',
    borderRadius: '10px',
    padding: '14px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
    flex: '1 1 120px',
  },
  liveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    maxWidth: '130px',
  },
  statNum: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: '11px',
    color: '#888',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  liveDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0,
  },
  tableWrap: {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  theadRow: {
    background: '#1e3a5f',
    color: '#fff',
  },
  th: {
    padding: '13px 16px',
    textAlign: 'left',
    fontWeight: 700,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid #f3f4f6',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#333',
  },
  tdIndex: {
    padding: '12px 16px',
    fontSize: '13px',
    color: '#999',
    fontWeight: 700,
    width: '48px',
  },
  tdMuted: {
    color: '#888',
    fontSize: '13px',
  },
  card: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '14px',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  cardIndex: {
    fontSize: '11px',
    color: '#999',
    fontWeight: 700,
  },
  cardTime: {
    fontSize: '11px',
    color: '#aaa',
  },
  cardName: {
    margin: '0 0 2px',
    fontSize: '15px',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  cardPhone: {
    margin: 0,
    fontSize: '13px',
    color: '#555',
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    padding: '60px 20px',
    fontSize: '15px',
  },
  footer: {
    padding: '12px 16px',
    fontSize: '13px',
    color: '#666',
    textAlign: 'right',
  },
};
