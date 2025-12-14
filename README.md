# Early Prediction of Lifestyle Diseases

A comprehensive health prediction and monitoring system powered by AI that helps users assess their risk for lifestyle diseases and receive personalized health recommendations.

## Features

### Core Functionality

- **AI-Powered Risk Prediction**: Advanced algorithms to predict risks for:
  - Diabetes
  - Heart Disease
  - Hypertension
  - Obesity

- **Personalized Recommendations**:
  - Custom fitness plans tailored to your risk level
  - Personalized diet suggestions and meal plans
  - Lifestyle modifications
  - Sleep optimization strategies
  - Stress management techniques
  - 7-day structured weekly schedules

- **User Dashboard**:
  - Track health assessments over time
  - Monitor progress with visual analytics
  - View detailed risk predictions with confidence scores
  - Access comprehensive health recommendations

- **Admin Analytics**:
  - System-wide usage statistics
  - User health metrics overview
  - Risk level distribution analytics
  - Disease category insights

- **Light/Dark Mode**:
  - Full theme support with smooth transitions
  - Persistent theme preferences
  - Eye-friendly interface for all lighting conditions

- **Local Authentication**:
  - Secure user registration and login
  - Profile management
  - Data persistence in browser storage

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Storage**: Browser LocalStorage
- **Authentication**: Custom local authentication system
- **Icons**: Lucide React

## Prerequisites

- Node.js 16+ and npm
- Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project credentials from Settings > API
3. Update the `.env` file with your credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

The database schema has already been created through migrations. The following tables are set up:

- `user_profiles` - Extended user information
- `health_assessments` - Health assessment records
- `predictions` - Disease risk predictions
- `recommendations` - Personalized health recommendations

All tables have Row Level Security (RLS) enabled for data protection.

### 5. Run the Application

#### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

#### Production Build

```bash
npm run build
npm run preview
```

## Usage Guide

### For Regular Users

1. **Sign Up**: Create an account with your basic health information (age, gender, height, weight)

2. **Complete Health Assessment**:
   - Fill out comprehensive health questionnaire
   - Include vital signs (blood pressure, glucose, cholesterol)
   - Provide lifestyle information (exercise, smoking, sleep habits)

3. **View Predictions**:
   - Get instant AI-powered risk assessments for 4 disease categories
   - See confidence scores and specific risk factors
   - Understand your health status

4. **Follow Recommendations**:
   - Access personalized fitness plans
   - View custom diet suggestions
   - Follow stress management techniques
   - Implement sleep optimization strategies
   - Use the 7-day structured schedule

5. **Track Progress**: Monitor your health journey over time with multiple assessments

### For Administrators

To create an admin account:

1. Register a regular user account
2. In the Supabase dashboard, navigate to the `user_profiles` table
3. Find your user record and set `is_admin` to `true`
4. Log out and log back in to access the admin dashboard

Admin features include:
- View total user count
- Monitor assessment statistics
- Track high-risk cases
- Analyze risk level distribution
- Review disease category trends
- Access user details

## Project Structure

```
src/
├── components/
│   ├── Admin/
│   │   └── AdminDashboard.tsx       # Admin analytics panel
│   ├── Assessment/
│   │   └── HealthAssessmentForm.tsx # Health questionnaire
│   ├── Auth/
│   │   ├── Login.tsx                # Login page
│   │   └── Register.tsx             # Registration page
│   └── Dashboard/
│       ├── PredictionCard.tsx       # Risk prediction display
│       ├── RecommendationsView.tsx  # Health recommendations
│       └── UserDashboard.tsx        # Main user dashboard
├── contexts/
│   ├── AuthContext.tsx              # Authentication state
│   └── ThemeContext.tsx             # Theme management
├── lib/
│   └── supabase.ts                  # Supabase client & types
├── services/
│   ├── predictionService.ts         # AI prediction algorithms
│   └── recommendationService.ts     # Recommendation generation
├── App.tsx                          # Main app component
├── main.tsx                         # App entry point
└── index.css                        # Global styles
```

## Health Assessment Guidelines

### Required Measurements

- **Fasting Glucose**: Measured in mg/dL (optimal: 70-99)
- **Blood Pressure**: Systolic/Diastolic in mmHg (optimal: 120/80 or lower)
- **Cholesterol**: Total cholesterol in mg/dL (optimal: below 200)
- **Heart Rate**: Resting heart rate in bpm (optimal: 60-100)

### Lifestyle Factors

- **Exercise**: Weekly hours of physical activity
- **Sleep**: Average hours per night
- **Stress Level**: Self-assessed on scale of 1-10
- **Smoking Status**: Current smoking habits
- **Alcohol Consumption**: Frequency of alcohol intake
- **Family History**: History of lifestyle diseases in family

## Risk Level Interpretation

- **Low Risk**: Continue maintaining healthy lifestyle habits
- **Medium Risk**: Implement recommended lifestyle changes
- **High Risk**: Follow recommendations closely and consult healthcare provider

## Security Features

- Email/password authentication with Supabase Auth
- Row Level Security (RLS) on all database tables
- Users can only access their own health data
- Admin access restricted to authorized users
- Secure data transmission

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

This is a demonstration project. For production use:

1. Implement proper medical disclaimer
2. Add data export functionality
3. Integrate with healthcare APIs
4. Add more comprehensive validation
5. Include professional medical review

## Disclaimer

This application is for educational and demonstration purposes only. It does not provide medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.

## License

MIT License

## Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase