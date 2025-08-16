import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from 'lucide-react';

// Mock Data: Initial Assessments
const assessments = [
  { id: 'choice-communication', title: 'Choice & Communication', icon: '💬', updatedAt: '20-04-2025 • 18:37', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'health-medication', title: 'Health & Medication', icon: '🏥', updatedAt: '20-04-2025 • 16:41', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'eating-drinking', title: 'Eating & Drinking', icon: '🍽️', updatedAt: '20-04-2025 • 16:42', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'living-safely', title: 'Living Safely & Taking Risks', icon: '🛡️', updatedAt: '20-04-2025 • 16:44', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'family-relationships', title: 'Family & Relationships', icon: '👨‍👩‍👧‍👦', updatedAt: '20-04-2025 • 16:44', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'managing-money', title: 'Managing Money', icon: '💰', updatedAt: '20-04-2025 • 16:44', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'community-leisure', title: 'Community, Learning & Leisure', icon: '📚', updatedAt: '20-04-2025 • 16:46', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'behaviour', title: 'Behaviour', icon: '🧠', updatedAt: '20-04-2025 • 16:48', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'daily-routine', title: 'Daily Routine', icon: '⏰', updatedAt: '20-04-2025 • 16:55', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'continence', title: 'Continence', icon: '🚽', updatedAt: '20-04-2025 • 17:36', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'mobility', title: 'Mobility', icon: '🚶', updatedAt: '20-04-2025 • 17:37', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'personal-care', title: 'Personal Care', icon: '🧴', updatedAt: '20-04-2025 • 17:37', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'end-of-life', title: 'End of Life', icon: '🕯️', updatedAt: '20-04-2025 • 17:37', createdBy: 'Yasmin Calasow', status: 'Done' },
  { id: 'skin', title: 'Skin', icon: '🫧', updatedAt: '20-04-2025 • 17:37', createdBy: 'Yasmin Calasow', status: 'Done' },
];

export default function InitialAssessmentPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-2 ">
      <h1 className="text-2xl font-bold">Initial Assessment</h1>
      <p className="text-muted-foreground mb-6">
        Review and access detailed initial assessments for the service user.
      </p>

      <div>
        <div className='bg-white p-4 rounded-lg shadow-md'>
          <ul className="space-y-3">
            {assessments.map((assessment) => (
              <li
                key={assessment.id}
                onClick={() => navigate(`/admin/people-planner/initial-assessment/${assessment.id}`)}
                className="flex justify-between items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{assessment.icon}</span>
                  <div>
                    <div className="font-medium">{assessment.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Updated {assessment.updatedAt} • {assessment.createdBy}
                    </div>
                  </div>
                </div>
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  {assessment.status}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}