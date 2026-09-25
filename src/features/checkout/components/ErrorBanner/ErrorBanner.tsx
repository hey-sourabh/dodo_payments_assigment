import { AlertCircle } from 'lucide-react';
import { ErrorType } from '../../../../enums';

interface ErrorBannerProps {
  errorType: ErrorType;
}

const ERROR_CONFIG: Record<ErrorType.Declined | ErrorType.Network, { title: string; description: string }> = {
  [ErrorType.Declined]: {
    title: 'Card Declined',
    description: 'Your bank declined this transaction. Please try another card or check available funds.',
  },
  [ErrorType.Network]: {
    title: 'Temporary Network Error',
    description: 'Could not connect to payment processor. Please click Pay again to retry.',
  },
};

export function ErrorBanner({ errorType }: ErrorBannerProps) {
  if (errorType === ErrorType.InvalidProduct) return null;

  const config = ERROR_CONFIG[errorType as ErrorType.Declined | ErrorType.Network];
  if (!config) return null;

  return (
    <div className="error-banner animate-shake">
      <AlertCircle size={18} className="error-icon" />
      <div className="error-text-block">
        <strong>{config.title}</strong>
        <p>{config.description}</p>
      </div>
    </div>
  );
}
