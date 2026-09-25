import { Loader2, Lock } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="checkout-container center-content">
      <div className="loading-vault">
        <div className="loading-spinner-ring">
          <Loader2 className="spinner" size={36} />
        </div>
        <div className="loading-badge">
          <Lock size={14} className="text-indigo-500" />
          <span>Securing 256-bit Connection</span>
        </div>
        <p className="text-gray-400 mt-2 text-sm font-medium">Verifying checkout credentials...</p>
      </div>
    </div>
  );
}
