import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'graduate',
    // Graduate fields
    university: '',
    degree: '',
    graduationYear: '',
    district: '',
    // Employer fields
    companyName: '',
    industry: '',
    location: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>CareerBridge BD</h2>
        <p style={styles.subtitle}>Create your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Common Fields */}
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role Selector */}
          <div style={styles.field}>
            <label style={styles.label}>I am a</label>
            <select
              style={styles.input}
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="graduate">Fresh Graduate</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* Graduate Fields */}
          {formData.role === 'graduate' && (
            <>
              <div style={styles.field}>
                <label style={styles.label}>University</label>
                <input
                  style={styles.input}
                  type="text"
                  name="university"
                  placeholder="e.g. Green University of Bangladesh"
                  value={formData.university}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Degree</label>
                <input
                  style={styles.input}
                  type="text"
                  name="degree"
                  placeholder="e.g. B.Sc. in CSE"
                  value={formData.degree}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Graduation Year</label>
                <input
                  style={styles.input}
                  type="number"
                  name="graduationYear"
                  placeholder="e.g. 2025"
                  value={formData.graduationYear}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>District</label>
                <input
                  style={styles.input}
                  type="text"
                  name="district"
                  placeholder="e.g. Dhaka"
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* Employer Fields */}
          {formData.role === 'employer' && (
            <>
              <div style={styles.field}>
                <label style={styles.label}>Company Name</label>
                <input
                  style={styles.input}
                  type="text"
                  name="companyName"
                  placeholder="e.g. TechCorp BD"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Industry</label>
                <input
                  style={styles.input}
                  type="text"
                  name="industry"
                  placeholder="e.g. Information Technology"
                  value={formData.industry}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Location</label>
                <input
                  style={styles.input}
                  type="text"
                  name="location"
                  placeholder="e.g. Dhaka"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account?{' '}
          <Link to="/login" style={styles.linkText}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: '6px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: '24px',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1e3a8a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  link: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#64748b',
  },
  linkText: {
    color: '#1e3a8a',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default Register;