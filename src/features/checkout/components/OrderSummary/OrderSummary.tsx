import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { PRODUCT_INFO, PRICE_BREAKDOWN } from '../../../../constants';

interface OrderSummaryProps {
  onClose: () => void;
}

export function OrderSummary({ onClose }: OrderSummaryProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="order-summary-box">
      <div className="flex justify-between items-start">
        <div className="product-summary-info">
          <div className="merchant-brand">
            <span className="brand-dot" />
            <span className="merchant-name">{PRODUCT_INFO.merchantName}</span>
          </div>
          <h1 className="item-title">{PRODUCT_INFO.name}</h1>
          <p className="billing-cadence">{PRODUCT_INFO.billingCadence}</p>
        </div>
        <button
          className="close-button"
          onClick={onClose}
          type="button"
          aria-label="Close checkout"
          title="Close checkout"
        >
          ×
        </button>
      </div>

      <div className="summary-price-row">
        <div className="price-tag">
          <span className="currency">$</span>
          <span className="amount">{PRODUCT_INFO.price.toFixed(2)}</span>
          <span className="currency-code">{PRODUCT_INFO.currency}</span>
        </div>
        <button
          type="button"
          className="details-toggle"
          onClick={() => setShowBreakdown((prev) => !prev)}
        >
          <span>Breakdown</span>
          {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {showBreakdown && (
        <div className="price-breakdown-details">
          {PRICE_BREAKDOWN.map((item) => (
            <div key={item.label} className="breakdown-row">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
          <div className="breakdown-row total-row">
            <span className="font-semibold">Total Due Today</span>
            <span className="font-bold text-indigo-600">
              ${PRODUCT_INFO.price.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="guarantee-pill">
        <Sparkles size={13} className="text-amber-500" />
        <span>30-Day Money-Back Guarantee • Cancel Anytime</span>
      </div>
    </div>
  );
}
