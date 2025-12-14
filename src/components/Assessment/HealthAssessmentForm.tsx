import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  predictDiabetesRisk,
  predictHeartDiseaseRisk,
  predictHypertensionRisk,
  predictObesityRisk,
  calculateBMI
} from '../../services/predictionService';
import { generateCompleteRecommendation } from '../../services/recommendationService';
import { Activity } from 'lucide-react';

interface HealthAssessmentFormProps {
  onComplete: () => void;
}

export default function HealthAssessmentForm({ onComplete }: HealthAssessmentFormProps) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sampleDataFilled, setSampleDataFilled] = useState(false);

  const [formData, setFormData] = useState({
    glucose_level: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    cholesterol: '',
    heart_rate: '',
    exercise_hours: '',
    smoking: false,
    alcohol_consumption: 'none',
    family_history: false,
    stress_level: '5',
    sleep_hours: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const fillSampleData = () => {
    setFormData({
      glucose_level: '95',
      blood_pressure_systolic: '120',
      blood_pressure_diastolic: '80',
      cholesterol: '180',
      heart_rate: '72',
      exercise_hours: '3',
      smoking: false,
      alcohol_consumption: 'moderate',
      family_history: true,
      stress_level: '6',
      sleep_hours: '7',
    });
    setError(''); // Clear any existing errors
    setSampleDataFilled(true);
    // Reset the indicator after 3 seconds
    setTimeout(() => setSampleDataFilled(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      setError('You must be logged in to submit an assessment');
      return;
    }

    if (loading) {
      return; // Prevent multiple submissions
    }

    // Comprehensive validation
    const errors: string[] = [];

    if (!formData.exercise_hours || parseFloat(formData.exercise_hours) < 0) {
      errors.push('Please enter valid weekly exercise hours');
    }

    if (formData.glucose_level && (parseFloat(formData.glucose_level) < 0 || parseFloat(formData.glucose_level) > 1000)) {
      errors.push('Please enter a valid glucose level (0-1000 mg/dL)');
    }

    if (formData.blood_pressure_systolic && (parseInt(formData.blood_pressure_systolic) < 60 || parseInt(formData.blood_pressure_systolic) > 300)) {
      errors.push('Please enter a valid systolic blood pressure (60-300 mmHg)');
    }

    if (formData.blood_pressure_diastolic && (parseInt(formData.blood_pressure_diastolic) < 40 || parseInt(formData.blood_pressure_diastolic) > 200)) {
      errors.push('Please enter a valid diastolic blood pressure (40-200 mmHg)');
    }

    if (formData.cholesterol && (parseFloat(formData.cholesterol) < 0 || parseFloat(formData.cholesterol) > 1000)) {
      errors.push('Please enter a valid cholesterol level (0-1000 mg/dL)');
    }

    if (formData.heart_rate && (parseInt(formData.heart_rate) < 40 || parseInt(formData.heart_rate) > 200)) {
      errors.push('Please enter a valid heart rate (40-200 bpm)');
    }

    if (formData.sleep_hours && (parseFloat(formData.sleep_hours) < 0 || parseFloat(formData.sleep_hours) > 24)) {
      errors.push('Please enter valid sleep hours (0-24 hours)');
    }

    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Starting assessment submission...');
      console.log('Profile data:', profile);
      
      // Validate profile data
      if (!profile.weight || !profile.height || profile.weight <= 0 || profile.height <= 0) {
        throw new Error(`Invalid profile data: weight=${profile.weight}, height=${profile.height}`);
      }
      
      const bmi = calculateBMI(profile.weight, profile.height);
      console.log('BMI calculated:', bmi);
      
      if (isNaN(bmi) || !isFinite(bmi)) {
        throw new Error('Invalid BMI calculation result');
      }

      const assessmentData = {
        id: Date.now().toString(),
        user_id: profile.id,
        assessment_type: 'comprehensive',
        glucose_level: formData.glucose_level ? parseFloat(formData.glucose_level) : null,
        blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic) : null,
        blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic) : null,
        cholesterol: formData.cholesterol ? parseFloat(formData.cholesterol) : null,
        bmi,
        heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
        exercise_hours: formData.exercise_hours ? parseFloat(formData.exercise_hours) : 0,
        smoking: formData.smoking,
        alcohol_consumption: formData.alcohol_consumption,
        family_history: formData.family_history,
        stress_level: formData.stress_level ? parseInt(formData.stress_level) : 5,
        sleep_hours: formData.sleep_hours ? parseFloat(formData.sleep_hours) : null,
        created_at: new Date().toISOString(),
      };
      console.log('Assessment data created:', assessmentData);

      // Validate parsed values
      if (assessmentData.stress_level < 1 || assessmentData.stress_level > 10) {
        throw new Error(`Invalid stress level: ${assessmentData.stress_level}`);
      }
      if (assessmentData.exercise_hours < 0 || assessmentData.exercise_hours > 24) {
        throw new Error(`Invalid exercise hours: ${assessmentData.exercise_hours}`);
      }

      // Store assessment in localStorage
      try {
        const assessments = JSON.parse(localStorage.getItem('health_assessments') || '[]');
        assessments.push(assessmentData);
        localStorage.setItem('health_assessments', JSON.stringify(assessments));
        console.log('Assessment stored in localStorage');
      } catch (storageError) {
        console.error('Error storing assessment:', storageError);
        throw new Error('Failed to save assessment data. Storage might be full.');
      }

      const assessment = assessmentData;

      console.log('Generating predictions...');
      const diabetesPrediction = predictDiabetesRisk(assessment, profile.age, bmi);
      const heartPrediction = predictHeartDiseaseRisk(assessment, profile.age, profile.gender, bmi);
      const hypertensionPrediction = predictHypertensionRisk(assessment, profile.age, bmi);
      const obesityPrediction = predictObesityRisk(bmi, assessment, profile.age);

      const predictions = [diabetesPrediction, heartPrediction, hypertensionPrediction, obesityPrediction];

      for (const prediction of predictions) {
        console.log('Processing prediction:', prediction.disease_type);
        const predictionData = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          assessment_id: assessment.id,
          user_id: profile.id,
          disease_type: prediction.disease_type,
          risk_level: prediction.risk_level,
          confidence_score: prediction.confidence_score,
          risk_factors: prediction.risk_factors,
          created_at: new Date().toISOString(),
        };

        // Store prediction in localStorage
        try {
          const storedPredictions = JSON.parse(localStorage.getItem('predictions') || '[]');
          storedPredictions.push(predictionData);
          localStorage.setItem('predictions', JSON.stringify(storedPredictions));
          console.log('Prediction stored:', prediction.disease_type);
        } catch (storageError) {
          console.error('Error storing prediction:', storageError);
          throw new Error(`Failed to save prediction data for ${prediction.disease_type}`);
        }

        console.log('Generating recommendation for:', prediction.disease_type, prediction.risk_level);
        const recommendation = generateCompleteRecommendation(
          prediction.disease_type,
          prediction.risk_level
        );
        console.log('Recommendation generated for:', prediction.disease_type);

        const recommendationData = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          prediction_id: predictionData.id,
          user_id: profile.id,
          ...recommendation,
          created_at: new Date().toISOString(),
        };

        // Store recommendation in localStorage
        try {
          const storedRecommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
          storedRecommendations.push(recommendationData);
          localStorage.setItem('recommendations', JSON.stringify(storedRecommendations));
          console.log('Recommendation stored for:', prediction.disease_type);
        } catch (storageError) {
          console.error('Error storing recommendation:', storageError);
          throw new Error(`Failed to save recommendation data for ${prediction.disease_type}`);
        }
      }

      console.log('Assessment completed successfully');
      setSuccess(true);
      // onComplete will be called when user clicks the button
    } catch (err) {
      console.error('Error during assessment submission:', err);
      let errorMessage = 'Failed to complete assessment. Please try again.';
      
      if (err instanceof Error) {
        errorMessage += ` Details: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Assessment Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your health assessment has been processed successfully. You can now view your personalized recommendations.
          </p>
          <button
            onClick={onComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Health Assessment
          </h2>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Complete this comprehensive health assessment to receive personalized risk predictions and recommendations.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className={`border rounded-lg p-4 mb-6 transition-colors ${
          sampleDataFilled 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className={`text-sm font-medium mb-1 ${
                sampleDataFilled 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-blue-800 dark:text-blue-200'
              }`}>
                {sampleDataFilled ? '✓ Sample Data Filled' : 'Quick Testing'}
              </h3>
              <p className={`text-xs ${
                sampleDataFilled 
                  ? 'text-green-600 dark:text-green-300' 
                  : 'text-blue-600 dark:text-blue-300'
              }`}>
                {sampleDataFilled 
                  ? 'Form has been filled with sample health data' 
                  : 'Use sample data to quickly test the assessment system'
                }
              </p>
            </div>
            <button
              type="button"
              onClick={fillSampleData}
              className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 shadow-sm ${
                sampleDataFilled 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              title="Fill form with realistic sample health data"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {sampleDataFilled ? 'Refill Sample Data' : 'Fill Sample Data'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fasting Glucose Level (mg/dL)
              </label>
              <input
                type="number"
                name="glucose_level"
                value={formData.glucose_level}
                onChange={handleChange}
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blood Pressure (Systolic)
              </label>
              <input
                type="number"
                name="blood_pressure_systolic"
                value={formData.blood_pressure_systolic}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blood Pressure (Diastolic)
              </label>
              <input
                type="number"
                name="blood_pressure_diastolic"
                value={formData.blood_pressure_diastolic}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cholesterol Level (mg/dL)
              </label>
              <input
                type="number"
                name="cholesterol"
                value={formData.cholesterol}
                onChange={handleChange}
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resting Heart Rate (bpm)
              </label>
              <input
                type="number"
                name="heart_rate"
                value={formData.heart_rate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 72"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weekly Exercise Hours
              </label>
              <input
                type="number"
                name="exercise_hours"
                value={formData.exercise_hours}
                onChange={handleChange}
                step="0.5"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Average Sleep Hours
              </label>
              <input
                type="number"
                name="sleep_hours"
                value={formData.sleep_hours}
                onChange={handleChange}
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 7"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stress Level (1-10)
              </label>
              <input
                type="range"
                name="stress_level"
                value={formData.stress_level}
                onChange={handleChange}
                min="1"
                max="10"
                required
                className="w-full"
              />
              <div className="text-center text-gray-900 dark:text-white font-medium">
                {formData.stress_level}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alcohol Consumption
              </label>
              <select
                name="alcohol_consumption"
                value={formData.alcohol_consumption}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="none">None</option>
                <option value="light">Light (1-2 drinks/week)</option>
                <option value="moderate">Moderate (3-7 drinks/week)</option>
                <option value="heavy">Heavy (8+ drinks/week)</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="smoking"
                  checked={formData.smoking}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Currently Smoking
                </span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="family_history"
                  checked={formData.family_history}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Family History of Disease
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Complete Assessment'}
          </button>
        </form>
      </div>
    </div>
  );
}