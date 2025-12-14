import { Prediction } from '../../lib/supabase';
import { LucideIcon } from 'lucide-react';

interface PredictionCardProps {
  prediction: Prediction;
  title: string;
  icon: LucideIcon;
  getRiskColor: (level: string) => string;
}

export default function PredictionCard({ prediction, title, icon: Icon, getRiskColor }: PredictionCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(prediction.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${getRiskColor(prediction.risk_level)}`}>
            {prediction.risk_level}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            {prediction.confidence_score.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Risk Factors:
        </h4>
        <ul className="space-y-1">
          {prediction.risk_factors.slice(0, 3).map((factor, index) => (
            <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
              <span className="mr-2">•</span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}