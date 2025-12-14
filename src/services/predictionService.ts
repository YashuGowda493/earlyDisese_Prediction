import { HealthAssessment } from '../lib/supabase';

export interface PredictionResult {
  disease_type: string;
  risk_level: 'low' | 'medium' | 'high';
  confidence_score: number;
  risk_factors: string[];
}

export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

export function predictDiabetesRisk(assessment: HealthAssessment, age: number, bmi: number): PredictionResult {
  let riskScore = 0;
  const riskFactors: string[] = [];

  if (assessment.glucose_level) {
    if (assessment.glucose_level >= 126) {
      riskScore += 40;
      riskFactors.push('High fasting glucose level');
    } else if (assessment.glucose_level >= 100) {
      riskScore += 25;
      riskFactors.push('Elevated fasting glucose (prediabetic range)');
    }
  }

  if (bmi >= 30) {
    riskScore += 20;
    riskFactors.push('Obesity (BMI ≥ 30)');
  } else if (bmi >= 25) {
    riskScore += 10;
    riskFactors.push('Overweight (BMI 25-29.9)');
  }

  if (age >= 45) {
    riskScore += 15;
    riskFactors.push('Age over 45 years');
  }

  if (assessment.family_history) {
    riskScore += 15;
    riskFactors.push('Family history of diabetes');
  }

  if (assessment.exercise_hours < 2) {
    riskScore += 10;
    riskFactors.push('Insufficient physical activity');
  }

  if (assessment.blood_pressure_systolic && assessment.blood_pressure_systolic >= 140) {
    riskScore += 10;
    riskFactors.push('High blood pressure');
  }

  let risk_level: 'low' | 'medium' | 'high';
  if (riskScore >= 60) {
    risk_level = 'high';
  } else if (riskScore >= 30) {
    risk_level = 'medium';
  } else {
    risk_level = 'low';
  }

  return {
    disease_type: 'diabetes',
    risk_level,
    confidence_score: Math.min(95, 65 + riskScore / 3),
    risk_factors: riskFactors,
  };
}

export function predictHeartDiseaseRisk(assessment: HealthAssessment, age: number, gender: string, bmi: number): PredictionResult {
  let riskScore = 0;
  const riskFactors: string[] = [];

  if (assessment.blood_pressure_systolic && assessment.blood_pressure_diastolic) {
    if (assessment.blood_pressure_systolic >= 140 || assessment.blood_pressure_diastolic >= 90) {
      riskScore += 25;
      riskFactors.push('Hypertension (Stage 2)');
    } else if (assessment.blood_pressure_systolic >= 130 || assessment.blood_pressure_diastolic >= 80) {
      riskScore += 15;
      riskFactors.push('Elevated blood pressure (Stage 1)');
    }
  }

  if (assessment.cholesterol) {
    if (assessment.cholesterol >= 240) {
      riskScore += 30;
      riskFactors.push('High cholesterol (≥ 240 mg/dL)');
    } else if (assessment.cholesterol >= 200) {
      riskScore += 15;
      riskFactors.push('Borderline high cholesterol');
    }
  }

  if (age >= 65) {
    riskScore += 20;
    riskFactors.push('Age 65 or older');
  } else if (age >= 45 && gender === 'male') {
    riskScore += 15;
    riskFactors.push('Male over 45 years');
  } else if (age >= 55 && gender === 'female') {
    riskScore += 15;
    riskFactors.push('Female over 55 years');
  }

  if (assessment.smoking) {
    riskScore += 25;
    riskFactors.push('Current smoker');
  }

  if (assessment.family_history) {
    riskScore += 15;
    riskFactors.push('Family history of heart disease');
  }

  if (bmi >= 30) {
    riskScore += 15;
    riskFactors.push('Obesity');
  }

  if (assessment.exercise_hours < 2.5) {
    riskScore += 10;
    riskFactors.push('Sedentary lifestyle');
  }

  if (assessment.stress_level && assessment.stress_level >= 7) {
    riskScore += 10;
    riskFactors.push('High stress levels');
  }

  let risk_level: 'low' | 'medium' | 'high';
  if (riskScore >= 70) {
    risk_level = 'high';
  } else if (riskScore >= 35) {
    risk_level = 'medium';
  } else {
    risk_level = 'low';
  }

  return {
    disease_type: 'heart_disease',
    risk_level,
    confidence_score: Math.min(95, 70 + riskScore / 4),
    risk_factors: riskFactors,
  };
}

export function predictHypertensionRisk(assessment: HealthAssessment, age: number, bmi: number): PredictionResult {
  let riskScore = 0;
  const riskFactors: string[] = [];

  if (assessment.blood_pressure_systolic && assessment.blood_pressure_diastolic) {
    if (assessment.blood_pressure_systolic >= 140 || assessment.blood_pressure_diastolic >= 90) {
      riskScore += 50;
      riskFactors.push('Current hypertension (Stage 2)');
    } else if (assessment.blood_pressure_systolic >= 130 || assessment.blood_pressure_diastolic >= 80) {
      riskScore += 35;
      riskFactors.push('Stage 1 hypertension');
    } else if (assessment.blood_pressure_systolic >= 120) {
      riskScore += 20;
      riskFactors.push('Elevated blood pressure');
    }
  }

  if (age >= 65) {
    riskScore += 20;
    riskFactors.push('Age 65 or older');
  } else if (age >= 45) {
    riskScore += 10;
    riskFactors.push('Age over 45');
  }

  if (bmi >= 30) {
    riskScore += 20;
    riskFactors.push('Obesity');
  } else if (bmi >= 25) {
    riskScore += 10;
    riskFactors.push('Overweight');
  }

  if (assessment.family_history) {
    riskScore += 15;
    riskFactors.push('Family history of hypertension');
  }

  if (assessment.smoking) {
    riskScore += 15;
    riskFactors.push('Smoking');
  }

  if (assessment.alcohol_consumption === 'heavy') {
    riskScore += 15;
    riskFactors.push('Heavy alcohol consumption');
  } else if (assessment.alcohol_consumption === 'moderate') {
    riskScore += 5;
    riskFactors.push('Moderate alcohol consumption');
  }

  if (assessment.exercise_hours < 2) {
    riskScore += 10;
    riskFactors.push('Insufficient physical activity');
  }

  if (assessment.stress_level && assessment.stress_level >= 7) {
    riskScore += 10;
    riskFactors.push('Chronic stress');
  }

  let risk_level: 'low' | 'medium' | 'high';
  if (riskScore >= 65) {
    risk_level = 'high';
  } else if (riskScore >= 35) {
    risk_level = 'medium';
  } else {
    risk_level = 'low';
  }

  return {
    disease_type: 'hypertension',
    risk_level,
    confidence_score: Math.min(95, 75 + riskScore / 5),
    risk_factors: riskFactors,
  };
}

export function predictObesityRisk(bmi: number, assessment: HealthAssessment, age: number): PredictionResult {
  let riskScore = 0;
  const riskFactors: string[] = [];

  if (bmi >= 40) {
    riskScore += 60;
    riskFactors.push('Class III Obesity (BMI ≥ 40)');
  } else if (bmi >= 35) {
    riskScore += 50;
    riskFactors.push('Class II Obesity (BMI 35-39.9)');
  } else if (bmi >= 30) {
    riskScore += 40;
    riskFactors.push('Class I Obesity (BMI 30-34.9)');
  } else if (bmi >= 25) {
    riskScore += 25;
    riskFactors.push('Overweight (BMI 25-29.9)');
  }

  if (assessment.exercise_hours < 1) {
    riskScore += 20;
    riskFactors.push('Very low physical activity');
  } else if (assessment.exercise_hours < 2.5) {
    riskScore += 10;
    riskFactors.push('Insufficient physical activity');
  }

  if (assessment.family_history) {
    riskScore += 15;
    riskFactors.push('Family history of obesity');
  }

  if (assessment.sleep_hours) {
    if (assessment.sleep_hours < 6) {
      riskScore += 10;
      riskFactors.push('Insufficient sleep (< 6 hours)');
    } else if (assessment.sleep_hours > 9) {
      riskScore += 5;
      riskFactors.push('Excessive sleep (> 9 hours)');
    }
  }

  if (assessment.stress_level && assessment.stress_level >= 7) {
    riskScore += 10;
    riskFactors.push('High stress levels');
  }

  if (age >= 40) {
    riskScore += 5;
    riskFactors.push('Age-related metabolism changes');
  }

  let risk_level: 'low' | 'medium' | 'high';
  if (riskScore >= 60) {
    risk_level = 'high';
  } else if (riskScore >= 30) {
    risk_level = 'medium';
  } else {
    risk_level = 'low';
  }

  return {
    disease_type: 'obesity',
    risk_level,
    confidence_score: Math.min(95, 80 + riskScore / 6),
    risk_factors: riskFactors,
  };
}