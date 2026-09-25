import { Loader2 } from 'lucide-react';
import { VERIFICATION_STEPS } from '../../../../constants';

interface VerificationProgressProps {
  step: number;
}

export function VerificationProgress({ step }: VerificationProgressProps) {
  const progressMap: Record<number, string> = { 1: '35%', 2: '70%', 3: '95%' };

  return (
    <div className="submitting-verification-box">
      <div className="verification-step-bar">
        <div className="verification-progress" style={{ width: progressMap[step] ?? '10%' }} />
      </div>
      <div className="verification-status-row">
        <Loader2 size={14} className="spinner text-indigo-600" />
        <span className="text-xs font-semibold text-gray-700">
          {VERIFICATION_STEPS[step] ?? ''}
        </span>
      </div>
    </div>
  );
}
