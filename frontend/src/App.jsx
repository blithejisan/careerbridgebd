import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Protected Route — login ছাড়া ঢুকতে দেবে না
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — Week 7 e dashboard বানাবো */}
        <Route
          path="/dashboard/graduate"
          element={
            <ProtectedRoute allowedRoles={['graduate']}>
              <h1 style={{ textAlign: 'center', marginTop: '50px' }}>
                Graduate Dashboard — Coming Week 7 🚀
              </h1>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employer"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <h1 style={{ textAlign: 'center', marginTop: '50px' }}>
                Employer Dashboard — Coming Week 7 🚀
              </h1>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;