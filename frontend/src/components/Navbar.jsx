import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        CareerBridge BD
      </Link>

      <div style={styles.links}>
        <Link to="/jobs" style={styles.link}>Jobs</Link>

        {!user ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.btnLink}>Register</Link>
          </>
        ) : (
          <>
            <Link
              to={`/dashboard/${user.role}`}
              style={styles.link}
            >
              Dashboard
            </Link>
            <span style={styles.userName}>Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 40px',
    backgroundColor: '#1e3a8a',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  brand: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: '800',
    textDecoration: 'none',
    letterSpacing: '0.5px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: '#e2e8f0',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
  btnLink: {
    color: '#fff',
    backgroundColor: '#2563eb',
    padding: '8px 18px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
  },
  userName: {
    color: '#93c5fd',
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    color: '#e2e8f0',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Navbar;