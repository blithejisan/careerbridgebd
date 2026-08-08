import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllJobs } from '../services/api';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs({});
        setFeaturedJobs(res.data.jobs.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${search}`);
  };

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Your Career Starts Here 🚀
        </h1>
        <p style={styles.heroSubtitle}>
          Bangladesh's dedicated job portal for fresh graduates.
          Find entry-level jobs that match your skills and education.
        </p>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search by job title or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" style={styles.searchBtn}>
            Find Jobs
          </button>
        </form>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.stat}>
          <span style={styles.statNumber}>{featuredJobs.length}+</span>
          <span style={styles.statLabel}>Active Jobs</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statNumber}>50+</span>
          <span style={styles.statLabel}>Companies</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statNumber}>1000+</span>
          <span style={styles.statLabel}>Graduates Hired</span>
        </div>
      </div>

      {/* Featured Jobs */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Jobs</h2>
        <p style={styles.sectionSubtitle}>
          Latest opportunities for fresh graduates
        </p>

        {featuredJobs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>
            No jobs available right now.
          </p>
        ) : (
          <div style={styles.jobGrid}>
            {featuredJobs.map((job) => (
              <div key={job.id} style={styles.jobCard}>
                <div style={styles.jobType}>{job.job_type}</div>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <p style={styles.companyName}>{job.company_name}</p>
                <p style={styles.jobLocation}>📍 {job.location}</p>
                <p style={styles.jobSalary}>💰 {job.salary_range}</p>
                <Link to={`/jobs/${job.id}`} style={styles.viewBtn}>
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/jobs" style={styles.allJobsBtn}>
            View All Jobs →
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    padding: '80px 40px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '42px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '16px',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#bfdbfe',
    maxWidth: '600px',
    margin: '0 auto 32px',
    lineHeight: '1.6',
  },
  searchForm: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  searchInput: {
    padding: '14px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '15px',
    width: '380px',
    outline: 'none',
  },
  searchBtn: {
    padding: '14px 28px',
    backgroundColor: '#f59e0b',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '60px',
    backgroundColor: '#fff',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e3a8a',
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
  },
  section: {
    padding: '60px 40px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: '8px',
  },
  sectionSubtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: '36px',
  },
  jobGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s',
  },
  jobType: {
    display: 'inline-block',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '12px',
    textTransform: 'capitalize',
  },
  jobTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '6px',
  },
  companyName: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '8px',
  },
  jobLocation: {
    color: '#64748b',
    fontSize: '13px',
    marginBottom: '4px',
  },
  jobSalary: {
    color: '#64748b',
    fontSize: '13px',
    marginBottom: '16px',
  },
  viewBtn: {
    display: 'block',
    textAlign: 'center',
    backgroundColor: '#1e3a8a',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
  },
  allJobsBtn: {
    display: 'inline-block',
    backgroundColor: '#f59e0b',
    color: '#fff',
    padding: '12px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '700',
  },
};

export default Home;