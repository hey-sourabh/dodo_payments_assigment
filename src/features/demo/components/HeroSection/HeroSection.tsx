import { ShieldCheck, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { PLAN_FEATURES, PRODUCT_ID } from '../../../../constants';

interface HeroSectionProps {
  sdkLoaded: boolean;
  onBuy: (productId: string) => void;
}

export function HeroSection({ sdkLoaded, onBuy }: HeroSectionProps) {
  return (
    <div className="demo-content">
      <div className="hero-banner">
        <div className="hero-badge">
          <Sparkles size={14} className="text-amber-500" />
          <span>Dodo Payments Checkout Demo • Built by @hey-sourabh</span>
        </div>
        <h1 className="hero-title">Developer Cloud Sandboxes</h1>
        <p className="hero-desc">
          Instant isolated Kubernetes clusters for staging, CI/CD, and fast engineering cycles.
          Zero-exposure card payments with PCI-DSS Level 1 isolation.
        </p>

        <div className="trust-strip">
          <div className="trust-item">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>PCI-DSS Level 1 Isolation</span>
          </div>
          <div className="trust-item">
            <Lock size={16} className="text-indigo-500" />
            <span>Zero Raw Card Exposure</span>
          </div>
          <div className="trust-item">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>30-Day Money-Back Guarantee</span>
          </div>
        </div>
      </div>

      <div className="pricing-showcase">
        <div className="featured-card">
          <div className="card-top-tag">MOST POPULAR</div>
          <div className="card-header-block">
            <div>
              <h2 className="plan-name">Pro Subscription</h2>
              <p className="plan-desc">Full access to 50 parallel cloud sandboxes and priority edge compute.</p>
            </div>
            <div className="plan-pricing">
              <span className="currency">$</span>
              <span className="price-number">99</span>
              <span className="period">/mo</span>
            </div>
          </div>

          <div className="plan-features-list">
            {PLAN_FEATURES.map((feat) => (
              <div key={feat} className="feature-item">
                <CheckCircle2 size={16} className="feature-check" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="card-action-block">
            <button
              className="buy-button primary"
              onClick={() => onBuy(PRODUCT_ID)}
              disabled={!sdkLoaded}
              type="button"
            >
              <Lock size={16} />
              <span>{sdkLoaded ? 'Subscribe with Dodo Checkout ($99.00)' : 'Loading SDK...'}</span>
            </button>

            <div className="action-trust-subtext">
              <div className="accepted-card-strip">
                {['VISA', 'MASTERCARD', 'AMEX', 'APPLE PAY'].map((net) => (
                  <span key={net} className="mini-pill">{net}</span>
                ))}
              </div>
              <span className="text-muted-xs">Secure 256-bit encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
