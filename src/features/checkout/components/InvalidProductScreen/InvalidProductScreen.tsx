import { AlertCircle, ShieldCheck } from 'lucide-react';

interface InvalidProductScreenProps {
  targetHostOrigin: string;
  onClose: () => void;
}

export function InvalidProductScreen({ targetHostOrigin, onClose }: InvalidProductScreenProps) {
  return (
    <div className="checkout-container error-fullscreen">
      <div className="error-icon-wrapper">
        <AlertCircle size={40} className="text-red-500" />
      </div>
      <h2 className="error-title">Product Not Found</h2>
      <p className="error-desc">
        The requested product checkout session is invalid or has expired. Please return to the store catalog.
      </p>
      <div className="security-notice">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>Origin verified: {targetHostOrigin}</span>
      </div>
      <button onClick={onClose} className="btn-secondary mt-6" type="button">
        Return to Store
      </button>
    </div>
  );
}
