import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import HealthAssessmentForm from './components/Assessment/HealthAssessmentForm';

function App() {
  const { user, profile, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return isLogin ? (
      <Login onToggleForm={() => setIsLogin(false)} />
    ) : (
      <Register onToggleForm={() => setIsLogin(true)} />
    );
  }

  if (showAssessment) {
    return (
      <HealthAssessmentForm
        onComplete={() => {
          setShowAssessment(false);
          setRefreshKey(prev => prev + 1); // Trigger refresh
        }}
      />
    );
  }

  if (profile.is_admin) {
    return <AdminDashboard key={refreshKey} />;
  }

  return <UserDashboard key={refreshKey} onNewAssessment={() => setShowAssessment(true)} />;
}

export default App;
