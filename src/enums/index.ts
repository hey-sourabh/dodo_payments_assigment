export enum CheckoutState {
  LoadingProduct = 'loading_product',
  Form = 'form',
  Submitting = 'submitting',
  Success = 'success',
}

export enum ErrorType {
  Declined = 'declined',
  Network = 'network',
  InvalidProduct = 'invalid_product',
}

export enum CheckoutMessageType {
  Success = 'CHECKOUT_SUCCESS',
  Error = 'CHECKOUT_ERROR',
  CloseRequested = 'CHECKOUT_CLOSE_REQUESTED',
  Closing = 'CHECKOUT_CLOSING',
}

export enum CloseReason {
  UserClosed = 'user_closed',
  Completed = 'completed',
  Escape = 'escape',
}

export enum CardBrand {
  Visa = 'visa',
  Mastercard = 'mastercard',
  Amex = 'amex',
  Discover = 'discover',
  Generic = 'generic',
}

export enum LogEventType {
  Success = 'success',
  Error = 'error',
  Close = 'close',
}

export enum FilterType {
  All = 'all',
  Success = 'success',
  Error = 'error',
  Close = 'close',
}

export enum QuickFillType {
  Success = 'success',
  Declined = 'declined',
  Network = 'network',
}
