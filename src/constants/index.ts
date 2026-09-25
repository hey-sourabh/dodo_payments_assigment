import type { ProductInfo, BreakdownItem } from '../types';

export const PRODUCT_INFO: ProductInfo = {
  name: 'Pro Developer Plan',
  price: 99.0,
  currency: 'USD',
  billingCadence: 'Billed monthly • Instant access',
  merchantName: 'Sourabh Labs',
};

export const PRICE_BREAKDOWN: BreakdownItem[] = [
  { label: 'Pro Plan (Monthly)', value: '$99.00' },
  { label: 'VAT / Tax (Included)', value: '$0.00' },
];

export const PLAN_FEATURES: string[] = [
  '50 Concurrent Isolated Sandboxes',
  '99.99% Guaranteed SLA Uptime',
  'Automated Rollback & Snapshot Backups',
  '24/7 Dedicated Support & SOC2 Compliance',
];

export const DEMO_CARDS = {
  success: {
    cardNumber: '4242 4242 4242 4242',
    email: 'alex.turner@example.com',
    expiry: '12 / 28',
    cvv: '789',
  },
  declined: {
    cardNumber: '4000 0000 0000 0002',
    email: 'decline.test@example.com',
    expiry: '12 / 28',
    cvv: '789',
  },
  network: {
    cardNumber: '4000 0000 0000 0341',
    email: 'retry.test@example.com',
    expiry: '12 / 28',
    cvv: '789',
  },
};

export const MOCK_CARD_OUTCOMES = {
  SUCCESS: '4242424242424242',
  DECLINE: '4000000000000002',
  NETWORK: '4000000000000341',
};

export const ACCEPTED_CARD_NETWORKS = ['VISA', 'MC', 'AMEX'];

export const VERIFICATION_STEPS: Record<number, string> = {
  1: 'Tokenizing card with AES-256...',
  2: 'Connecting to card issuing network...',
  3: 'Finalizing 3D-Secure authentication...',
};

export const PRODUCT_ID = 'prod_premium_123';
export const INVALID_PRODUCT_ID = 'invalid_prod_123';

export const PRODUCT_LOAD_DELAY_MS = 700;
export const SUBMISSION_STEP1_DELAY_MS = 600;
export const SUBMISSION_STEP2_DELAY_MS = 1200;
export const SUBMISSION_TOTAL_DELAY_MS = 1800;
export const COPY_FEEDBACK_DELAY_MS = 2000;
export const AUTO_CLOSE_AFTER_SUCCESS_MS = 2000;
export const SDK_UNMOUNT_ANIMATION_MS = 250;
