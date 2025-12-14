import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile, Prediction, mockPredictions } from '../../lib/supabase';
import { Users, Activity, TrendingUp, BarChart3, Moon, Sun, Heart } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function AdminDashboard({ refreshKey }: { refreshKey?: number }) {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssessments: 0,
    highRiskUsers: 0,
    recentAssessments: 0,
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [refreshKey]);

  const loadAnalytics = async () => {
    try {
      // Load users from localStorage
      const usersData = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(usersData);

      // Mock assessments (since no local storage for assessments yet)
      const assessmentsData = [];

      // Use mock predictions
      setPredictions(mockPredictions);

      const highRiskCount = mockPredictions.filter(p => p.risk_level === 'high').length;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentCount = assessmentsData.filter(
        (assessment: any) => new Date(assessment.created_at) > sevenDaysAgo
      ).length;

      setStats({
        totalUsers: usersData.length,
        totalAssessments: assessmentsData.length,
        highRiskUsers: highRiskCount,
        recentAssessments: recentCount,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskDistribution = () => {
    const distribution = { low: 0, medium: 0, high: 0 };
    predictions.forEach(p => {
      distribution[p.risk_level]++;
    });
    return distribution;
  };

  const getDiseaseDistribution = () => {
    const distribution: Record<string, number> = {};
    predictions.forEach(p => {
      distribution[p.disease_type] = (distribution[p.disease_type] || 0) + 1;
    });
    return distribution;
  };

  const riskDist = getRiskDistribution();
  const diseaseDist = getDiseaseDistribution();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-300" />
                )}
              </button>
              <span className="text-gray-700 dark:text-gray-300">
                {profile?.full_name}
              </span>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            System Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive overview of system usage and user health metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  Total Assessments
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats.totalAssessments}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  High Risk Cases
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats.highRiskUsers}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  Recent (7 days)
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats.recentAssessments}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <BarChart3 className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Risk Level Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Low Risk</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {riskDist.low}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${predictions.length > 0 ? (riskDist.low / predictions.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Medium Risk</span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {riskDist.medium}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-yellow-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${predictions.length > 0 ? (riskDist.medium / predictions.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">High Risk</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {riskDist.high}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-red-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${predictions.length > 0 ? (riskDist.high / predictions.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Disease Category Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(diseaseDist).map(([disease, count]) => (
                <div key={disease} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 capitalize">
                    {disease.replace('_', ' ')}
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Recent Users
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-semibold">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-semibold">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-semibold">
                    Age
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-semibold">
                    Gender
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-semibold">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 text-gray-800 dark:text-white">
                      {user.full_name}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {user.age}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300 capitalize">
                      {user.gender}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}