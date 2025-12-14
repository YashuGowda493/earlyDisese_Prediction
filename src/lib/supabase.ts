// Mock data for local development
export const mockUsers: UserProfile[] = [
  {
    id: '1',
    full_name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    gender: 'male',
    height: 175,
    weight: 70,
    is_admin: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockPredictions: Prediction[] = [
  {
    id: '1',
    assessment_id: '1',
    user_id: '1',
    disease_type: 'diabetes',
    risk_level: 'low',
    confidence_score: 0.85,
    risk_factors: ['Family history', 'Sedentary lifestyle'],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    assessment_id: '1',
    user_id: '1',
    disease_type: 'heart_disease',
    risk_level: 'medium',
    confidence_score: 0.72,
    risk_factors: ['High cholesterol', 'Stress'],
    created_at: new Date().toISOString(),
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    prediction_id: '1',
    user_id: '1',
    fitness_plan: {
      exercises: [
        {
          name: 'Walking',
          duration: '30 minutes',
          frequency: 'Daily',
          description: 'Brisk walking to improve cardiovascular health',
        },
      ],
      duration_weeks: 12,
      intensity: 'moderate',
    },
    diet_plan: {
      meals: [
        {
          type: 'Breakfast',
          suggestions: ['Oatmeal with fruits', 'Whole grain toast'],
          notes: 'Focus on whole grains and fresh fruits',
        },
      ],
      calories_target: 2000,
      guidelines: ['Reduce sugar intake', 'Increase vegetable consumption'],
    },
    lifestyle_modifications: ['Quit smoking', 'Reduce alcohol'],
    sleep_recommendations: {
      target_hours: 8,
      tips: ['Maintain consistent sleep schedule', 'Avoid screens before bed'],
    },
    stress_management: {
      techniques: ['Meditation', 'Deep breathing'],
      daily_practices: ['Morning meditation', 'Evening walk'],
    },
    weekly_schedule: {
      monday: {
        morning: ['Exercise', 'Breakfast'],
        afternoon: ['Work', 'Healthy lunch'],
        evening: ['Dinner', 'Relaxation'],
      },
    },
    created_at: new Date().toISOString(),
  },
];

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface HealthAssessment {
  id: string;
  user_id: string;
  assessment_type: string;
  glucose_level?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  cholesterol?: number;
  bmi?: number;
  heart_rate?: number;
  exercise_hours: number;
  smoking: boolean;
  alcohol_consumption: string;
  family_history: boolean;
  stress_level?: number;
  sleep_hours?: number;
  created_at: string;
}

export interface Prediction {
  id: string;
  assessment_id: string;
  user_id: string;
  disease_type: string;
  risk_level: 'low' | 'medium' | 'high';
  confidence_score: number;
  risk_factors: string[];
  created_at: string;
}

export interface Recommendation {
  id: string;
  prediction_id: string;
  user_id: string;
  fitness_plan: FitnessPlan;
  diet_plan: DietPlan;
  lifestyle_modifications: string[];
  sleep_recommendations: SleepRecommendations;
  stress_management: StressManagement;
  weekly_schedule: WeeklySchedule;
  created_at: string;
}

export interface FitnessPlan {
  exercises: Exercise[];
  duration_weeks: number;
  intensity: string;
}

export interface Exercise {
  name: string;
  duration: string;
  frequency: string;
  description: string;
}

export interface DietPlan {
  meals: Meal[];
  calories_target: number;
  guidelines: string[];
}

export interface Meal {
  type: string;
  suggestions: string[];
  notes: string;
}

export interface SleepRecommendations {
  target_hours: number;
  tips: string[];
}

export interface StressManagement {
  techniques: string[];
  daily_practices: string[];
}

export interface WeeklySchedule {
  [key: string]: DaySchedule;
}

export interface DaySchedule {
  morning: string[];
  afternoon: string[];
  evening: string[];
}