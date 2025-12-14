import { useState } from 'react';
import { Recommendation } from '../../lib/supabase';
import { Dumbbell, Apple, Moon, Brain, Calendar } from 'lucide-react';

interface RecommendationsViewProps {
  recommendations: Recommendation[];
}

export default function RecommendationsView({ recommendations }: RecommendationsViewProps) {
  const [selectedTab, setSelectedTab] = useState<'fitness' | 'diet' | 'sleep' | 'stress' | 'schedule'>('fitness');

  if (recommendations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          No recommendations available yet. Complete a health assessment to get started.
        </p>
      </div>
    );
  }

  const latestRecommendation = recommendations[0];

  const tabs = [
    { id: 'fitness', label: 'Fitness Plan', icon: Dumbbell },
    { id: 'diet', label: 'Diet Plan', icon: Apple },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'stress', label: 'Stress Management', icon: Brain },
    { id: 'schedule', label: 'Weekly Schedule', icon: Calendar },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors duration-300">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  selectedTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {selectedTab === 'fitness' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Your Personalized Fitness Plan
            </h3>
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Duration:</strong> {latestRecommendation.fitness_plan.duration_weeks} weeks
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Intensity:</strong> {latestRecommendation.fitness_plan.intensity}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestRecommendation.fitness_plan.exercises.map((exercise, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                    {exercise.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <strong>Duration:</strong> {exercise.duration}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <strong>Frequency:</strong> {exercise.frequency}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {exercise.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'diet' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Your Personalized Diet Plan
            </h3>
            <div className="mb-6">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                <strong>Daily Calorie Target:</strong> {latestRecommendation.diet_plan.calories_target} kcal
              </p>
            </div>
            <div className="space-y-4 mb-6">
              {latestRecommendation.diet_plan.meals.map((meal, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                    {meal.type}
                  </h4>
                  <ul className="space-y-1 mb-2">
                    {meal.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm italic text-gray-500 dark:text-gray-400">
                    {meal.notes}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                Dietary Guidelines
              </h4>
              <ul className="space-y-1">
                {latestRecommendation.diet_plan.guidelines.map((guideline, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                    ✓ {guideline}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {selectedTab === 'sleep' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Sleep Optimization
            </h3>
            <div className="mb-6">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                <strong>Target Sleep Hours:</strong> {latestRecommendation.sleep_recommendations.target_hours} hours
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestRecommendation.sleep_recommendations.tips.map((tip, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    ✓ {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'stress' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Stress Management
            </h3>
            <div className="mb-6">
              <h4 className="font-bold text-gray-800 dark:text-white mb-3">
                Relaxation Techniques
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {latestRecommendation.stress_management.techniques.map((technique, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      • {technique}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-3">
                Daily Practices
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {latestRecommendation.stress_management.daily_practices.map((practice, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      ✓ {practice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'schedule' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Your 7-Day Health Schedule
            </h3>
            <div className="space-y-4">
              {Object.entries(latestRecommendation.weekly_schedule).map(([day, schedule]) => (
                <div key={day} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-3">
                    {day}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Morning
                      </p>
                      <ul className="space-y-1">
                        {schedule.morning.map((activity, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Afternoon
                      </p>
                      <ul className="space-y-1">
                        {schedule.afternoon.map((activity, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Evening
                      </p>
                      <ul className="space-y-1">
                        {schedule.evening.map((activity, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}