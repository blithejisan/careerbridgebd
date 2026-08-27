import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getAllUsers, getAllJobs, verifyEmployer, getPendingJobs, approveJob, rejectJob } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, jobsRes, pendingRes] = await Promise.all([
        getAllUsers(),
        getAllJobs({}),
        getPendingJobs()
      ]);
      setUsers(usersRes.data.users);
      setJobs(jobsRes.data.jobs);
      setPendingJobs(pendingRes.data.jobs);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (employerId) => {
    try {
      await verifyEmployer(employerId);
      setMessage({ text: '✅ Employer verified successfully!', type: 'success' });
      fetchData();
    } catch (err) {
      setMessage({ text: 'Failed to verify employer.', type: 'error' });
    }
  };

  const handleApprove = async (jobId) => {
    try {
      await approveJob(jobId);
      setMessage({ text: '✅ Job approved successfully!', type: 'success' });
      fetchData();
    } catch (err) {
      setMessage({ text: 'Failed to approve job.', type: 'error' });
    }
  };

  const handleReject = async (jobId) => {
    try {
      await rejectJob(jobId);
      setMessage({ text: '❌ Job rejected.', type: 'error' });
      fetchData();
    } catch (err) {
      setMessage({ text: 'Failed to reject job.', type: 'error' });
    }
  };

  const graduates = users.filter(u => u.role === 'graduate');
  const employers = users.filter(u => u.role === 'employer');

  const roleColors = {
    graduate: { bg: '#dcfce7', color: '#16a34a' },
    employer: { bg: '#dbeafe', color: '#1e40af' },
    admin: { bg: '#f3e8ff', color: '#7e22ce' },
  };

  return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Navbar />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.welcomeCard}>
          <div>
            <h1 style={styles.welcomeTitle}>Admin Dashboard ⚙️</h1>
            <p style={styles.welcomeSubtitle}>
              Welcome, {user?.name} — Manage platform users and listings.
            </p>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div style={message.type === 'success' ? styles.successMsg : styles.errorMsg}>
            {message.text}
          </div>
        )}

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Users', value: users.length, bg: '#dbeafe', color: '#1e40af' },
            { label: 'Graduates', value: graduates.length, bg: '#dcfce7', color: '#16a34a' },
            { label: 'Employers', value: employers.length, bg: '#f3e8ff', color: '#7e22ce' },
            { label: 'Active Jobs', value: jobs.length, bg: '#fef9c3', color: '#854d0e' },
            { label: 'Pending Approval', value: pendingJobs.length, bg: '#fee2e2', color: '#dc2626' },
          ].map((stat) => (
            <div key={stat.label} style={{ ...styles.statCard, backgroundColor: stat.bg }}>
              <span style={{ ...styles.statNumber, color: stat.color }}>{stat.value}</span>
              <span style={{ ...styles.statLabel, color: stat.color }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { key: 'pending', label: `⏳ Pending Jobs (${pendingJobs.length})` },
            { key: 'users', label: '👥 All Users' },
            { key: 'jobs', label: '💼 Active Jobs' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                ...styles.tab,
                ...(activeTab === tab.key ? styles.activeTab : {})
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pending Jobs Tab */}
        {activeTab === 'pending' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              ⏳ Jobs Pending Approval ({pendingJobs.length})
            </h2>
            {loading ? (
              <p style={styles.loadingText}>Loading...</p>
            ) : pendingJobs.length === 0 ? (
              <p style={styles.loadingText}>No pending jobs — all clear! ✅</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Company</th>
                      <th style={styles.th}>Location</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Posted</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingJobs.map((job) => (
                      <tr key={job.id} style={styles.tableRow}>
                        <td style={styles.td}>{job.title}</td>
                        <td style={styles.td}>{job.company_name}</td>
                        <td style={styles.td}>{job.location}</td>
                        <td style={styles.td}>{job.job_type}</td>
                        <td style={styles.td}>
                          {new Date(job.created_at).toLocaleDateString()}
                        </td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleApprove(job.id)}
                              style={styles.approveBtn}
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleReject(job.id)}
                              style={styles.rejectBtn}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>All Users ({users.length})</h2>
            {loading ? (
              <p style={styles.loadingText}>Loading...</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Joined</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={styles.tableRow}>
                        <td style={styles.td}>{u.id}</td>
                        <td style={styles.td}>{u.name}</td>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.roleBadge,
                            backgroundColor: roleColors[u.role]?.bg,
                            color: roleColors[u.role]?.color,
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td style={styles.td}>
                          {u.role === 'employer' && (
                            <button
                              onClick={() => handleVerify(u.id)}
                              style={styles.verifyBtn}
                            >
                              ✅ Verify
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Active Jobs Tab */}
        {activeTab === 'jobs' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Active Job Listings ({jobs.length})</h2>
            {loading ? (
              <p style={styles.loadingText}>Loading...</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Company</th>
                      <th style={styles.th}>Location</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} style={styles.tableRow}>
                        <td style={styles.td}>{job.id}</td>
                        <td style={styles.td}>{job.title}</td>
                        <td style={styles.td}>{job.company_name}</td>
                        <td style={styles.td}>{job.location}</td>
                        <td style={styles.td}>{job.job_type}</td>
                        <td style={styles.td}>
                          {job.deadline
                            ? new Date(job.deadline).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' },
  welcomeCard: {
    backgroundColor: '#1e3a8a', borderRadius: '12px', padding: '28px 32px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '24px', flexWrap: 'wrap', gap: '16px',
  },
  welcomeTitle: { fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '6px' },
  welcomeSubtitle: { color: '#bfdbfe', fontSize: '14px' },
  successMsg: {
    backgroundColor: '#dcfce7', color: '#16a34a', padding: '12px 16px',
    borderRadius: '8px', marginBottom: '16px', fontWeight: '600',
  },
  errorMsg: {
    backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 16px',
    borderRadius: '8px', marginBottom: '16px',
  },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px', marginBottom: '24px',
  },
  statCard: {
    borderRadius: '12px', padding: '24px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
  },
  statNumber: { fontSize: '36px', fontWeight: '800' },
  statLabel: { fontSize: '13px', fontWeight: '600', textAlign: 'center' },
  tabs: {
    display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap',
  },
  tab: {
    padding: '10px 20px', borderRadius: '8px', border: '2px solid #e2e8f0',
    backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600',
    fontSize: '14px', color: '#64748b',
  },
  activeTab: {
    backgroundColor: '#1e3a8a', color: '#fff', borderColor: '#1e3a8a',
  },
  card: {
    backgroundColor: '#fff', borderRadius: '12px', padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0',
    marginBottom: '24px',
  },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#f8fafc' },
  th: {
    padding: '12px 16px', textAlign: 'left', fontSize: '13px',
    fontWeight: '700', color: '#475569', borderBottom: '2px solid #e2e8f0',
  },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#374151' },
  roleBadge: {
    display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
    fontSize: '12px', fontWeight: '700', textTransform: 'capitalize',
  },
  verifyBtn: {
    backgroundColor: '#dcfce7', color: '#16a34a', border: 'none',
    padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer',
  },
  approveBtn: {
    backgroundColor: '#dcfce7', color: '#16a34a', border: 'none',
    padding: '6px 14px', borderRadius: '6px', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer',
  },
  rejectBtn: {
    backgroundColor: '#fee2e2', color: '#dc2626', border: 'none',
    padding: '6px 14px', borderRadius: '6px', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer',
  },
  loadingText: { textAlign: 'center', color: '#64748b', padding: '20px' },
};

export default AdminDashboard;