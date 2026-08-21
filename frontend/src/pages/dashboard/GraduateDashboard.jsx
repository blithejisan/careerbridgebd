import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { myApplications, uploadCV } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
  pending: { bg: '#fef9c3', color: '#854d0e' },
  shortlisted: { bg: '#dbeafe', color: '#1e40af' },
  rejected: { bg: '#fee2e2', color: '#dc2626' },
  hired: { bg: '#dcfce7', color: '#16a34a' },
};

const GraduateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvMessage, setCvMessage] = useState({ text: '', type: '' });

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setCvMessage({ text: 'Only PDF files are allowed.', type: 'error' });
      return;
    }

    setCvUploading(true);
    setCvMessage({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('cv', file);
      await uploadCV(formData);
      setCvMessage({ text: '✅ CV uploaded successfully!', type: 'success' });
    } catch (err) {
      setCvMessage({
        text: err.response?.data?.message || 'Failed to upload CV.',
        type: 'error'
      });
    } finally {
      setCvUploading(false);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await myApplications();
        setApplications(res.data.applications);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    hired: applications.filter(a => a.status === 'hired').length,
  };

  return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Navbar />

      <div style={styles.container}>
        {/* Welcome Header */}
        <div style={styles.welcomeCard}>
          <div>
            <h1 style={styles.welcomeTitle}>
              Welcome back, {user?.name} 👋
            </h1>
            <p style={styles.welcomeSubtitle}>
              Track your job applications and find new opportunities.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/jobs" style={styles.findJobsBtn}>
              🔍 Find Jobs
            </Link>
            <label style={styles.cvUploadBtn}>
              {cvUploading ? 'Uploading...' : '📄 Upload CV'}
              <input
                type="file"
                accept=".pdf"
                onChange={handleCVUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* CV Message */}
        {cvMessage.text && (
          <div style={cvMessage.type === 'success' ? styles.successMsg : styles.errorMsg}>
            {cvMessage.text}
          </div>
        )}

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Applied', value: stats.total, color: '#1e3a8a', bg: '#dbeafe' },
            { label: 'Pending', value: stats.pending, color: '#854d0e', bg: '#fef9c3' },
            { label: 'Shortlisted', value: stats.shortlisted, color: '#1e40af', bg: '#dbeafe' },
            { label: 'Hired', value: stats.hired, color: '#16a34a', bg: '#dcfce7' },
          ].map((stat) => (
            <div key={stat.label} style={{ ...styles.statCard, backgroundColor: stat.bg }}>
              <span style={{ ...styles.statNumber, color: stat.color }}>{stat.value}</span>
              <span style={{ ...styles.statLabel, color: stat.color }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Applications Table */}
        <div style={styles.tableCard}>
          <h2 style={styles.tableTitle}>My Applications</h2>

          {loading ? (
            <p style={styles.loadingText}>Loading applications...</p>
          ) : applications.length === 0 ? (
            <div style={styles.emptyState}>
              <p>You haven't applied for any jobs yet.</p>
              <Link to="/jobs" style={styles.findJobsBtn}>
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Job Title</th>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Applied Date</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} style={styles.tableRow}>
                      <td style={styles.td}>{app.title}</td>
                      <td style={styles.td}>{app.company_name}</td>
                      <td style={styles.td}>{app.location}</td>
                      <td style={styles.td}>
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: statusColors[app.status]?.bg,
                          color: statusColors[app.status]?.color,
                        }}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px 20px',
  },
  welcomeCard: {
    backgroundColor: '#1e3a8a',
    borderRadius: '12px',
    padding: '28px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  welcomeTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '6px',
  },
  welcomeSubtitle: {
    color: '#bfdbfe',
    fontSize: '14px',
  },
  findJobsBtn: {
    backgroundColor: '#f59e0b',
    color: '#fff',
    padding: '10px 22px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '14px',
  },
  cvUploadBtn: {
    backgroundColor: '#059669',
    color: '#fff',
    padding: '10px 22px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    border: 'none',
  },
  successMsg: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontWeight: '600',
  },
  errorMsg: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: '600',
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '20px',
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    padding: '20px',
  },
  emptyState: {
    textAlign: 'center',
    color: '#64748b',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHead: {
    backgroundColor: '#f8fafc',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '700',
    color: '#475569',
    borderBottom: '2px solid #e2e8f0',
  },
  tableRow: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#374151',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
};

export default GraduateDashboard;