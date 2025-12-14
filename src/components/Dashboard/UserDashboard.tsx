import { useState, useEffect } from 'react';
import { Activity, Heart, TrendingUp, AlertCircle, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Prediction, Recommendation } from '../../lib/supabase';
import PredictionCard from './PredictionCard';
import RecommendationsView from './RecommendationsView';

interface UserDashboardProps {
  onNewAssessment: () => void;
  refreshKey?: number;
}

export default function UserDashboard({ onNewAssessment, refreshKey }: UserDashboardProps) {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'predictions' | 'recommendations'>('predictions');

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = async () => {
    if (!profile) return;

    try {
      // Load from localStorage
      const storedPredictions = JSON.parse(localStorage.getItem('predictions') || '[]');
      const storedRecommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');

      setPredictions(storedPredictions.filter((p: Prediction) => p.user_id === profile.id));
      setRecommendations(storedRecommendations.filter((r: Recommendation) => r.user_id === profile.id));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const latestPredictions = predictions.slice(0, 4);
  const diabetesPrediction = latestPredictions.find(p => p.disease_type === 'diabetes');
  const heartPrediction = latestPredictions.find(p => p.disease_type === 'heart_disease');
  const hypertensionPrediction = latestPredictions.find(p => p.disease_type === 'hypertension');
  const obesityPrediction = latestPredictions.find(p => p.disease_type === 'obesity');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  const hasData = predictions.length > 0 || recommendations.length > 0;

  if (!hasData) {
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
                  Health Dashboard
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Welcome to Your Health Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Take control of your health journey. Complete your first health assessment to receive personalized risk predictions and comprehensive wellness recommendations tailored just for you.
            </p>
            <button
              onClick={onNewAssessment}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              Start My Health Assessment
            </button>
          </div>
        </main>
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
                Health Dashboard
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
            Welcome back, {profile?.full_name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Track your health journey and follow personalized recommendations
          </p>
        </div>

        {predictions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Start Your Health Assessment
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Complete your first health assessment to receive personalized predictions and recommendations
            </p>
            <button
              onClick={onNewAssessment}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Take Assessment
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedView('predictions')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedView === 'predictions'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Risk Predictions
              </button>
              <button
                onClick={() => setSelectedView('recommendations')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedView === 'recommendations'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Recommendations
              </button>
              <button
                onClick={onNewAssessment}
                className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                New Assessment
              </button>
            </div>

            {selectedView === 'predictions' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {diabetesPrediction && (
                  <PredictionCard
                    prediction={diabetesPrediction}
                    title="Diabetes Risk"
                    icon={Activity}
                    getRiskColor={getRiskColor}
                  />
                )}
                {heartPrediction && (
                  <PredictionCard
                    prediction={heartPrediction}
                    title="Heart Disease Risk"
                    icon={Heart}
                    getRiskColor={getRiskColor}
                  />
                )}
                {hypertensionPrediction && (
                  <PredictionCard
                    prediction={hypertensionPrediction}
                    title="Hypertension Risk"
                    icon={TrendingUp}
                    getRiskColor={getRiskColor}
                  />
                )}
                {obesityPrediction && (
                  <PredictionCard
                    prediction={obesityPrediction}
                    title="Obesity Risk"
                    icon={AlertCircle}
                    getRiskColor={getRiskColor}
                  />
                )}
              </div>
            ) : (
              <RecommendationsView recommendations={recommendations} />
            )}
          </>
        )}
      </div>
    </div>
  );
}