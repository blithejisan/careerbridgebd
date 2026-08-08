import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllJobs } from '../services/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    job_type: '',
    location: '',
    category: '',
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      const search = searchParams.get('search');
      if (search) params.search = search;
      const res = await getAllJobs(params);
      setJobs(res.data.jobs);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ job_type: '', location: '', category: '' });
  };

  return (
    <div>
      <Navbar />

      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Browse Jobs</h1>
          <p style={styles.subtitle}>
            {jobs.length} active jobs found for fresh graduates
          </p>
        </div>

        <div style={styles.layout}>
          {/* Filter Sidebar */}
          <div style={styles.sidebar}>
            <h3 style={styles.filterTitle}>Filter Jobs</h3>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Job Type</label>
              <select
                style={styles.filterSelect}
                name="job_type"
                value={filters.job_type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Location</label>
              <select
                style={styles.filterSelect}
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
              >
                <option value="">All Locations</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Category</label>
              <select
                style={styles.filterSelect}
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="Software Development">Software Development</option>
                <option value="Data & Analytics">Data & Analytics</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <button onClick={clearFilters} style={styles.clearBtn}>
              Clear Filters
            </button>
          </div>

          {/* Job List */}
          <div style={styles.jobList}>
            {loading ? (
              <p style={styles.loadingText}>Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No jobs found matching your filters.</p>
                <button onClick={clearFilters} style={styles.clearBtn}>
                  Clear Filters
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} style={styles.jobCard}>
                  <div style={styles.cardLeft}>
                    <div style={styles.jobTypeBadge}>{job.job_type}</div>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <p style={styles.companyName}>{job.company_name}</p>
                    <div style={styles.jobMeta}>
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary_range}</span>
                      <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={styles.cardRight}>
                    <Link to={`/jobs/${job.id}`} style={styles.viewBtn}>
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '6px',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '15px',
  },
  layout: {
    display: 'flex',
    gap: '28px',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
  },
  filterTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '20px',
  },
  filterGroup: {
    marginBottom: '18px',
  },
  filterLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  filterSelect: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '13px',
    color: '#374151',
    outline: 'none',
  },
  clearBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  jobList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    padding: '40px',
  },
  emptyState: {
    textAlign: 'center',
    color: '#64748b',
    padding: '40px',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    flexShrink: 0,
  },
  jobTypeBadge: {
    display: 'inline-block',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    marginBottom: '8px',
    textTransform: 'capitalize',
  },
  jobTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px',
  },
  companyName: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '10px',
  },
  jobMeta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    fontSize: '13px',
    color: '#64748b',
  },
  viewBtn: {
    display: 'inline-block',
    backgroundColor: '#1e3a8a',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
};

export default Jobs;