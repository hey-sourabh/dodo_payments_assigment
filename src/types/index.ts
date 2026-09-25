import { CloseReason, LogEventType } from '../enums';

export interface DodoCheckoutSuccessPayload {
  sessionId: string;
}

export interface DodoCheckoutErrorPayload {
  code: string;
  message: string;
}

export interface DodoCheckoutConfig {
  productId: string;
  onSuccess?: (payload: DodoCheckoutSuccessPayload) => void;
  onClose?: (reason: CloseReason) => void;
  onError?: (error: DodoCheckoutErrorPayload) => void;
}

export interface CheckoutFormValues {
  email: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface LogEntry {
  timestamp: string;
  type: LogEventType;
  payload?: Record<string, unknown>;
}

export interface ProductInfo {
  name: string;
  price: number;
  currency: string;
  billingCadence: string;
  merchantName: string;
}

export interface BreakdownItem {
  label: string;
  value: string;
}
