import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { postJob, getAllJobs, jobApplicants, updateAppStatus, deleteJob } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [jobForm, setJobForm] = useState({
    title: '', category: '', description: '',
    requirements: '', location: '', jobType: '',
    salaryRange: '', deadline: '',
  });

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const res = await getAllJobs({});
      const myJobs = res.data.jobs.filter(j => j.employer_name === user.name);
      setJobs(myJobs);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      await postJob(jobForm);
      setMessage({ text: '✅ Job posted successfully!', type: 'success' });
      setShowForm(false);
      setJobForm({
        title: '', category: '', description: '',
        requirements: '', location: '', jobType: '',
        salaryRange: '', deadline: '',
      });
      fetchMyJobs();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to post job.',
        type: 'error'
      });
    }
  };

  const handleViewApplicants = async (jobId) => {
    setSelectedJobId(jobId);
    try {
      const res = await jobApplicants(jobId);
      setApplicants(res.data.applications);
    } catch (err) {
      console.error('Failed to fetch applicants:', err);
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await updateAppStatus(appId, { status });
      setApplicants(applicants.map(a =>
        a.id === appId ? { ...a, status } : a
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
      if (selectedJobId === jobId) {
        setSelectedJobId(null);
        setApplicants([]);
      }
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  const statusColors = {
    pending: { bg: '#fef9c3', color: '#854d0e' },
    shortlisted: { bg: '#dbeafe', color: '#1e40af' },
    rejected: { bg: '#fee2e2', color: '#dc2626' },
    hired: { bg: '#dcfce7', color: '#16a34a' },
  };

  return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Navbar />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.welcomeCard}>
          <div>
            <h1 style={styles.welcomeTitle}>Employer Dashboard 🏢</h1>
            <p style={styles.welcomeSubtitle}>
              Welcome, {user?.name} — Manage your job listings and applicants.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={styles.postJobBtn}
          >
            {showForm ? '✕ Cancel' : '+ Post New Job'}
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div style={message.type === 'success' ? styles.successMsg : styles.errorMsg}>
            {message.text}
          </div>
        )}

        {/* Post Job Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h2 style={styles.cardTitle}>Post a New Job</h2>
            <form onSubmit={handlePostJob}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Job Title *</label>
                  <input style={styles.input} name="title"
                    value={jobForm.title} onChange={handleFormChange} required />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Category</label>
                  <input style={styles.input} name="category"
                    value={jobForm.category} onChange={handleFormChange} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Location</label>
                  <input style={styles.input} name="location"
                    value={jobForm.location} onChange={handleFormChange} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Job Type</label>
                  <select style={styles.input} name="jobType"
                    value={jobForm.jobType} onChange={handleFormChange}>
                    <option value="">Select type</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Salary Range</label>
                  <input style={styles.input} name="salaryRange"
                    placeholder="e.g. 25,000 - 35,000 BDT"
                    value={jobForm.salaryRange} onChange={handleFormChange} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Deadline</label>
                  <input style={styles.input} type="date" name="deadline"
                    value={jobForm.deadline} onChange={handleFormChange} />
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <textarea style={{ ...styles.input, height: '80px' }}
                  name="description" value={jobForm.description}
                  onChange={handleFormChange} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Requirements</label>
                <textarea style={{ ...styles.input, height: '80px' }}
                  name="requirements" value={jobForm.requirements}
                  onChange={handleFormChange} />
              </div>
              <button type="submit" style={styles.submitBtn}>
                Post Job
              </button>
            </form>
          </div>
        )}

        {/* My Jobs */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>My Job Listings ({jobs.length})</h2>
          {loading ? (
            <p style={styles.loadingText}>Loading...</p>
          ) : jobs.length === 0 ? (
            <p style={styles.loadingText}>No jobs posted yet.</p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Deadline</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} style={styles.tableRow}>
                      <td style={styles.td}>{job.title}</td>
                      <td style={styles.td}>{job.job_type}</td>
                      <td style={styles.td}>{job.location}</td>
                      <td style={styles.td}>
                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleViewApplicants(job.id)}
                            style={styles.viewBtn}
                          >
                            👥 Applicants
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            style={styles.deleteBtn}
                          >
                            🗑 Delete
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

        {/* Applicants Panel */}
        {selectedJobId && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              Applicants for Job #{selectedJobId} ({applicants.length})
            </h2>
            {applicants.length === 0 ? (
              <p style={styles.loadingText}>No applicants yet.</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>University</th>
                      <th style={styles.th}>Skills</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app) => (
                      <tr key={app.id} style={styles.tableRow}>
                        <td style={styles.td}>{app.graduate_name}</td>
                        <td style={styles.td}>{app.email}</td>
                        <td style={styles.td}>{app.university}</td>
                        <td style={styles.td}>{app.skills}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            backgroundColor: statusColors[app.status]?.bg,
                            color: statusColors[app.status]?.color,
                          }}>
                            {app.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <select
                            style={styles.statusSelect}
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
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
  postJobBtn: {
    backgroundColor: '#f59e0b', color: '#fff', border: 'none',
    padding: '10px 22px', borderRadius: '8px', fontWeight: '700',
    fontSize: '14px', cursor: 'pointer',
  },
  successMsg: {
    backgroundColor: '#dcfce7', color: '#16a34a', padding: '12px 16px',
    borderRadius: '8px', marginBottom: '16px', fontWeight: '600',
  },
  errorMsg: {
    backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 16px',
    borderRadius: '8px', marginBottom: '16px',
  },
  formCard: {
    backgroundColor: '#fff', borderRadius: '12px', padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#fff', borderRadius: '12px', padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0',
    marginBottom: '24px',
  },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#374151' },
  input: {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #d1d5db', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', resize: 'vertical',
  },
  submitBtn: {
    backgroundColor: '#1e3a8a', color: '#fff', border: 'none',
    padding: '12px 28px', borderRadius: '8px', fontSize: '14px',
    fontWeight: '700', cursor: 'pointer',
  },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#f8fafc' },
  th: {
    padding: '12px 16px', textAlign: 'left', fontSize: '13px',
    fontWeight: '700', color: '#475569', borderBottom: '2px solid #e2e8f0',
  },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#374151' },
  statusBadge: {
    display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
    fontSize: '12px', fontWeight: '700', textTransform: 'capitalize',
  },
  statusSelect: {
    padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db',
    fontSize: '13px', cursor: 'pointer', outline: 'none',
  },
  viewBtn: {
    backgroundColor: '#dbeafe', color: '#1e40af', border: 'none',
    padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#fee2e2', color: '#dc2626', border: 'none',
    padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer',
  },
  loadingText: { textAlign: 'center', color: '#64748b', padding: '20px' },
};

export default EmployerDashboard;