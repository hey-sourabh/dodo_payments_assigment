import { CheckCircle2, CreditCard, Copy, Check, ShieldCheck } from 'lucide-react';
import { CheckoutStepper } from '../CheckoutStepper';
import { PRODUCT_INFO } from '../../../../constants';

interface SuccessScreenProps {
  confirmedSessionId: string;
  email: string;
  last4: string;
  copiedSession: boolean;
  onCopySession: (id: string) => void;
}

export function SuccessScreen({
  confirmedSessionId,
  email,
  last4,
  copiedSession,
  onCopySession,
}: SuccessScreenProps) {
  return (
    <div className="checkout-container success-container">
      <CheckoutStepper progressWidth="100%" emailFilled isSuccess />

      <div className="success-content">
        <div className="success-icon-badge">
          <CheckCircle2 size={44} className="text-emerald-500" />
        </div>
        <h2 className="success-heading">Payment Confirmed!</h2>
        <p className="success-subtext">Your transaction was authenticated and processed securely.</p>

        <div className="receipt-card">
          <div className="receipt-row">
            <span className="receipt-label">Amount Paid</span>
            <span className="receipt-value font-bold">
              ${PRODUCT_INFO.price.toFixed(2)} {PRODUCT_INFO.currency}
            </span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Payment Method</span>
            <span className="receipt-value flex items-center gap-1">
              <CreditCard size={14} className="text-gray-500" />
              •••• {last4}
            </span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Receipt Sent To</span>
            <span className="receipt-value text-ellipsis">{email || 'customer@example.com'}</span>
          </div>
          <div className="receipt-divider" />
          <div className="receipt-row session-row">
            <span className="receipt-label">Session ID</span>
            <button
              type="button"
              className="session-id-pill"
              onClick={() => onCopySession(confirmedSessionId)}
              title="Click to copy Session ID"
            >
              <code>{confirmedSessionId || 'sess_demo99'}</code>
              {copiedSession ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        <div className="trust-seal-footer">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Guaranteed by Dodo Payments • Bank-Grade Security</span>
        </div>

        <p className="auto-close-hint">
          <span className="pulse-dot" /> Returning to merchant in a moment...
        </p>
      </div>
    </div>
  );
}
