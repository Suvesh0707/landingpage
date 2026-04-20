'use client';

import { useEffect, useState } from 'react';

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

  async function fetchData() {
    setLoading(true);
    const res = await fetch('/api/submissions');
    const json = await res.json();
    setData(json);
    setLastUpdated(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '32px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1a1a1a' }}>Submissions</h1>
            {lastUpdated && (
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>Last updated: {lastUpdated}</p>
            )}
          </div>
          <button
            onClick={fetchData}
            style={{
              background: '#2563eb', color: '#fff', border: 'none',
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '14px', fontWeight: 600,
            }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '60px' }}>Loading...</p>
        ) : data.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '60px' }}>No submissions yet.</p>
        ) : (
          <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2563eb', color: '#fff' }}>
                  <th style={th}>#</th>
                  <th style={th}>Full Name</th>
                  <th style={th}>Phone Number</th>
                  <th style={th}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={td}>{row.index}</td>
                    <td style={td}>{row.fullName}</td>
                    <td style={td}>{row.phone}</td>
                    <td style={td}>{row.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 16px', background: '#f9fafb', borderTop: '1px solid #f0f0f0', fontSize: '13px', color: '#666' }}>
              Total: <strong>{data.length}</strong> submissions
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: '14px 16px', textAlign: 'left', fontWeight: 600, fontSize: '14px',
};

const td: React.CSSProperties = {
  padding: '13px 16px', fontSize: '14px', color: '#333',
};
