import { Recommendation, FitnessPlan, DietPlan, SleepRecommendations, StressManagement, WeeklySchedule } from '../lib/supabase';

export function generateFitnessPlan(diseaseType: string, riskLevel: string): FitnessPlan {
  const baseExercises = {
    low: [
      { name: 'Walking', duration: '30 minutes', frequency: '5 days/week', description: 'Brisk walking in the morning or evening' },
      { name: 'Stretching', duration: '15 minutes', frequency: 'Daily', description: 'Full body stretching routine' },
      { name: 'Yoga', duration: '20 minutes', frequency: '3 days/week', description: 'Basic yoga poses for flexibility' },
    ],
    medium: [
      { name: 'Brisk Walking', duration: '45 minutes', frequency: '5 days/week', description: 'Maintain heart rate at 60-70% max' },
      { name: 'Cycling', duration: '30 minutes', frequency: '3 days/week', description: 'Moderate intensity cycling' },
      { name: 'Swimming', duration: '30 minutes', frequency: '2 days/week', description: 'Low-impact cardio exercise' },
      { name: 'Strength Training', duration: '20 minutes', frequency: '2 days/week', description: 'Light weights or resistance bands' },
    ],
    high: [
      { name: 'Walking Program', duration: '60 minutes', frequency: '6 days/week', description: 'Start with 20 min, gradually increase' },
      { name: 'Aqua Aerobics', duration: '45 minutes', frequency: '3 days/week', description: 'Low-impact water exercises' },
      { name: 'Stationary Bike', duration: '30 minutes', frequency: '4 days/week', description: 'Start at low resistance' },
      { name: 'Chair Exercises', duration: '15 minutes', frequency: 'Daily', description: 'Seated strength exercises' },
      { name: 'Balance Training', duration: '10 minutes', frequency: 'Daily', description: 'Prevent falls and improve stability' },
    ],
  };

  const intensity = riskLevel === 'high' ? 'Gentle progression - Start slow' :
                    riskLevel === 'medium' ? 'Moderate intensity' : 'Moderate to vigorous';

  return {
    exercises: baseExercises[riskLevel as keyof typeof baseExercises],
    duration_weeks: riskLevel === 'high' ? 16 : riskLevel === 'medium' ? 12 : 8,
    intensity,
  };
}

export function generateDietPlan(diseaseType: string, riskLevel: string): DietPlan {
  const baseMeals = {
    diabetes: [
      {
        type: 'Breakfast',
        suggestions: ['Oatmeal with berries and nuts', 'Greek yogurt with seeds', 'Whole grain toast with avocado'],
        notes: 'Focus on low glycemic index foods',
      },
      {
        type: 'Lunch',
        suggestions: ['Grilled chicken salad', 'Quinoa bowl with vegetables', 'Lentil soup with whole grain bread'],
        notes: 'Include lean protein and fiber',
      },
      {
        type: 'Dinner',
        suggestions: ['Baked fish with steamed vegetables', 'Turkey stir-fry with brown rice', 'Chickpea curry with cauliflower rice'],
        notes: 'Keep carbs moderate and include protein',
      },
      {
        type: 'Snacks',
        suggestions: ['Handful of almonds', 'Carrot sticks with hummus', 'Apple with peanut butter'],
        notes: 'Choose snacks with protein or healthy fats',
      },
    ],
    heart_disease: [
      {
        type: 'Breakfast',
        suggestions: ['Overnight oats with flaxseeds', 'Smoothie with spinach and berries', 'Whole grain cereal with almond milk'],
        notes: 'Rich in omega-3 and fiber',
      },
      {
        type: 'Lunch',
        suggestions: ['Salmon salad with olive oil dressing', 'Mediterranean vegetable wrap', 'Bean and vegetable soup'],
        notes: 'Heart-healthy fats and lean proteins',
      },
      {
        type: 'Dinner',
        suggestions: ['Grilled fish with roasted vegetables', 'Chicken breast with sweet potato', 'Plant-based pasta with tomato sauce'],
        notes: 'Low sodium, rich in potassium',
      },
      {
        type: 'Snacks',
        suggestions: ['Walnuts', 'Dark berries', 'Celery with almond butter'],
        notes: 'Anti-inflammatory foods',
      },
    ],
    hypertension: [
      {
        type: 'Breakfast',
        suggestions: ['Banana smoothie with spinach', 'Oatmeal with berries', 'Whole grain toast with tomato'],
        notes: 'High in potassium, low in sodium',
      },
      {
        type: 'Lunch',
        suggestions: ['Leafy green salad with grilled chicken', 'Vegetable soup (low sodium)', 'Brown rice with steamed broccoli'],
        notes: 'DASH diet principles',
      },
      {
        type: 'Dinner',
        suggestions: ['Baked salmon with asparagus', 'Turkey with roasted Brussels sprouts', 'Tofu stir-fry with vegetables'],
        notes: 'Minimal salt, herbs for flavor',
      },
      {
        type: 'Snacks',
        suggestions: ['Fresh fruit', 'Unsalted nuts', 'Cucumber slices'],
        notes: 'Natural, unprocessed foods',
      },
    ],
    obesity: [
      {
        type: 'Breakfast',
        suggestions: ['Egg white omelet with vegetables', 'Protein smoothie with berries', 'Greek yogurt with chia seeds'],
        notes: 'High protein, low calorie',
      },
      {
        type: 'Lunch',
        suggestions: ['Large salad with lean protein', 'Vegetable soup with legumes', 'Grilled chicken with vegetables'],
        notes: 'High volume, low calorie density',
      },
      {
        type: 'Dinner',
        suggestions: ['Grilled fish with large vegetable portion', 'Zucchini noodles with turkey sauce', 'Cauliflower rice with stir-fry'],
        notes: 'Portion control, vegetable-focused',
      },
      {
        type: 'Snacks',
        suggestions: ['Raw vegetables', 'Air-popped popcorn', 'Berries'],
        notes: 'Low calorie, filling options',
      },
    ],
  };

  const caloriesTarget = riskLevel === 'high' ? 1600 : riskLevel === 'medium' ? 1800 : 2000;

  const guidelines = [
    'Drink 8-10 glasses of water daily',
    'Avoid processed and packaged foods',
    'Limit sugar intake',
    'Eat plenty of vegetables and fruits',
    'Choose whole grains over refined grains',
    'Include lean proteins in every meal',
    'Practice portion control',
    'Avoid late-night eating',
  ];

  return {
    meals: baseMeals[diseaseType as keyof typeof baseMeals] || baseMeals.diabetes,
    calories_target: caloriesTarget,
    guidelines,
  };
}

export function generateSleepRecommendations(riskLevel: string): SleepRecommendations {
  return {
    target_hours: 7.5,
    tips: [
      'Maintain consistent sleep schedule',
      'Create a dark, quiet sleeping environment',
      'Avoid screens 1 hour before bedtime',
      'Keep bedroom temperature cool (65-68°F)',
      'Avoid caffeine after 2 PM',
      'Practice relaxation techniques before bed',
      'Exercise regularly, but not close to bedtime',
      'Limit daytime naps to 20-30 minutes',
    ],
  };
}

export function generateStressManagement(riskLevel: string): StressManagement {
  return {
    techniques: [
      'Deep breathing exercises (4-7-8 technique)',
      'Progressive muscle relaxation',
      'Mindfulness meditation',
      'Yoga or tai chi',
      'Journaling',
      'Nature walks',
      'Listening to calming music',
      'Talking to friends or counselor',
    ],
    daily_practices: [
      'Start day with 5 minutes of meditation',
      'Take short breaks every 2 hours',
      'Practice gratitude - write 3 things daily',
      'Limit social media and news consumption',
      'Engage in a hobby you enjoy',
      'Spend time with loved ones',
      'Practice saying no to reduce overwhelm',
      'End day with relaxation routine',
    ],
  };
}

export function generateWeeklySchedule(diseaseType: string, riskLevel: string): WeeklySchedule {
  const schedule: WeeklySchedule = {
    Monday: {
      morning: ['30 min walk', 'Healthy breakfast', 'Hydrate'],
      afternoon: ['Balanced lunch', 'Light stretching', '10 min meditation'],
      evening: ['Light dinner', 'Evening walk', 'Relaxation'],
    },
    Tuesday: {
      morning: ['Yoga session', 'Nutritious breakfast', 'Plan meals'],
      afternoon: ['Healthy lunch', 'Active break', 'Stress relief exercise'],
      evening: ['Home-cooked dinner', 'Family time', 'Early bedtime prep'],
    },
    Wednesday: {
      morning: ['Cardio exercise', 'Protein-rich breakfast', 'Mindful breathing'],
      afternoon: ['Veggie-packed lunch', 'Short walk', 'Hydration check'],
      evening: ['Light dinner', 'Hobby time', 'Screen-free hour'],
    },
    Thursday: {
      morning: ['Strength training', 'Energizing breakfast', 'Goal review'],
      afternoon: ['Balanced lunch', 'Meditation break', 'Healthy snack'],
      evening: ['Nutritious dinner', 'Journaling', 'Prepare for sleep'],
    },
    Friday: {
      morning: ['Active walk', 'Healthy breakfast', 'Positive affirmations'],
      afternoon: ['Light lunch', 'Stretching', 'Social connection'],
      evening: ['Healthy dinner', 'Relaxing activity', 'Wind down'],
    },
    Saturday: {
      morning: ['Longer workout', 'Hearty breakfast', 'Meal prep'],
      afternoon: ['Nutritious lunch', 'Outdoor activity', 'Hobby time'],
      evening: ['Balanced dinner', 'Social time', 'Self-care routine'],
    },
    Sunday: {
      morning: ['Gentle yoga', 'Leisurely breakfast', 'Week planning'],
      afternoon: ['Healthy lunch', 'Nature walk', 'Reflection time'],
      evening: ['Light dinner', 'Prepare for week', 'Early rest'],
    },
  };

  return schedule;
}

export function generateCompleteRecommendation(
  diseaseType: string,
  riskLevel: string
): Omit<Recommendation, 'id' | 'prediction_id' | 'user_id' | 'created_at'> {
  const lifestyleModifications = [
    'Quit smoking if applicable',
    'Limit alcohol consumption',
    'Maintain healthy weight',
    'Regular health check-ups',
    'Monitor blood pressure regularly',
    'Track your progress daily',
    'Stay consistent with lifestyle changes',
    'Seek support from family and friends',
  ];

  return {
    fitness_plan: generateFitnessPlan(diseaseType, riskLevel),
    diet_plan: generateDietPlan(diseaseType, riskLevel),
    lifestyle_modifications: lifestyleModifications,
    sleep_recommendations: generateSleepRecommendations(riskLevel),
    stress_management: generateStressManagement(riskLevel),
    weekly_schedule: generateWeeklySchedule(diseaseType, riskLevel),
  };
}