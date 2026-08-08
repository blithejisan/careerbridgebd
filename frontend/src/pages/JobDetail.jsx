import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getJobById, applyForJob } from '../services/api';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJobById(id);
        setJob(res.data.job);
      } catch (err) {
        console.error('Failed to fetch job:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'graduate') {
      setMessage({ text: 'Only graduates can apply for jobs.', type: 'error' });
      return;
    }

    setApplying(true);
    setMessage({ text: '', type: '' });

    try {
      await applyForJob({ jobId: parseInt(id) });
      setMessage({ text: '🎉 Application submitted successfully!', type: 'success' });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to apply. Please try again.',
        type: 'error'
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div>
      <Navbar />
      <p style={{ textAlign: 'center', marginTop: '60px', color: '#64748b' }}>
        Loading job details...
      </p>
    </div>
  );

  if (!job) return (
    <div>
      <Navbar />
      <p style={{ textAlign: 'center', marginTop: '60px', color: '#ef4444' }}>
        Job not found.
      </p>
    </div>
  );

  return (
    <div>
      <Navbar />

      <div style={styles.container}>
        {/* Job Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.badge}>{job.job_type}</span>
            <h1 style={styles.jobTitle}>{job.title}</h1>
            <p style={styles.companyName}>{job.company_name}</p>
            <div style={styles.metaRow}>
              <span>📍 {job.location}</span>
              <span>🏭 {job.industry}</span>
              <span>💰 {job.salary_range}</span>
              <span>📅 Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          <div style={styles.headerRight}>
            {message.text && (
              <div style={message.type === 'success' ? styles.successMsg : styles.errorMsg}>
                {message.text}
              </div>
            )}
            <button
              onClick={handleApply}
              disabled={applying}
              style={applying ? { ...styles.applyBtn, opacity: 0.7 } : styles.applyBtn}
            >
              {applying ? 'Submitting...' : '✅ Apply Now'}
            </button>
            {!user && (
              <p style={styles.loginHint}>
                Please login as a graduate to apply.
              </p>
            )}
          </div>
        </div>

        {/* Job Body */}
        <div style={styles.body}>
          {/* Description */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Job Description</h2>
            <p style={styles.sectionText}>{job.description}</p>
          </div>

          {/* Requirements */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Requirements</h2>
            <p style={styles.sectionText}>{job.requirements}</p>
          </div>

          {/* Company Info */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>About the Company</h2>
            <p style={styles.sectionText}><strong>{job.company_name}</strong></p>
            <p style={styles.sectionText}>Industry: {job.industry}</p>
            {job.website && (
              <a
                href={job.website.startsWith('http') ? job.website : `https://${job.website}`}
                target="_blank"
                rel="noreferrer"
                style={styles.websiteLink}
              >
                🌐 Visit Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px',
  },
  header: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '12px',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '10px',
    textTransform: 'capitalize',
  },
  jobTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '6px',
  },
  companyName: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: '16px',
    marginBottom: '14px',
  },
  metaRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    fontSize: '14px',
    color: '#64748b',
  },
  applyBtn: {
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  loginHint: {
    fontSize: '12px',
    color: '#94a3b8',
    textAlign: 'right',
  },
  successMsg: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
  },
  errorMsg: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '28px 32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '12px',
    paddingBottom: '10px',
    borderBottom: '2px solid #e2e8f0',
  },
  sectionText: {
    color: '#475569',
    fontSize: '15px',
    lineHeight: '1.7',
    marginBottom: '8px',
  },
  websiteLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
};

export default JobDetail;