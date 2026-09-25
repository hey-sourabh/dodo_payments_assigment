import { useState, useRef, useEffect } from 'react';
import { CheckoutState, ErrorType } from '../enums';
import {
  normalizeCardNumber,
  generateSessionId,
  resolveHostOrigin,
} from '../utils';
import {
  MOCK_CARD_OUTCOMES,
  PRODUCT_LOAD_DELAY_MS,
  SUBMISSION_STEP1_DELAY_MS,
  SUBMISSION_STEP2_DELAY_MS,
  SUBMISSION_TOTAL_DELAY_MS,
  COPY_FEEDBACK_DELAY_MS,
} from '../constants';
import type { CheckoutFormValues } from '../types';

export function useCheckout() {
  const [state, setState] = useState<CheckoutState>(CheckoutState.LoadingProduct);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [submissionStep, setSubmissionStep] = useState(0);
  const [confirmedSessionId, setConfirmedSessionId] = useState('');
  const [copiedSession, setCopiedSession] = useState(false);
  const [transientFailCount, setTransientFailCount] = useState(0);

  const isClosingRef = useRef(false);
  const targetHostOrigin = resolveHostOrigin();

  const notifyParent = (type: string, payload?: Record<string, string>) => {
    if (isClosingRef.current) return;
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type, payload }, targetHostOrigin);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');

    if (!productId) {
      setErrorType(ErrorType.InvalidProduct);
      notifyParent('CHECKOUT_ERROR', { code: 'invalid_product', message: 'Missing product ID.' });
      return;
    }

    const timer = setTimeout(() => {
      if (isClosingRef.current) return;
      if (productId === 'invalid_prod_123') {
        setErrorType(ErrorType.InvalidProduct);
        notifyParent('CHECKOUT_ERROR', {
          code: 'invalid_product',
          message: 'The specified product does not exist.',
        });
      } else {
        setState(CheckoutState.Form);
      }
    }, PRODUCT_LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleParentMessage = (event: MessageEvent) => {
      if (event.origin !== targetHostOrigin) return;
      if (event.data?.type === 'CHECKOUT_CLOSING') {
        isClosingRef.current = true;
      }
    };
    window.addEventListener('message', handleParentMessage);
    return () => window.removeEventListener('message', handleParentMessage);
  }, [targetHostOrigin]);

  const handleClose = () => notifyParent('CHECKOUT_CLOSE_REQUESTED');

  const handleCopySession = (id: string) => {
    if (!id) return;
    navigator.clipboard?.writeText(id);
    setCopiedSession(true);
    setTimeout(() => setCopiedSession(false), COPY_FEEDBACK_DELAY_MS);
  };

  const submitPayment = (values: CheckoutFormValues) => {
    if (state === CheckoutState.Submitting) return;

    setState(CheckoutState.Submitting);
    setErrorType(null);
    setSubmissionStep(1);

    const step1 = setTimeout(() => {
      if (!isClosingRef.current) setSubmissionStep(2);
    }, SUBMISSION_STEP1_DELAY_MS);

    const step2 = setTimeout(() => {
      if (!isClosingRef.current) setSubmissionStep(3);
    }, SUBMISSION_STEP2_DELAY_MS);

    setTimeout(() => {
      clearTimeout(step1);
      clearTimeout(step2);
      if (isClosingRef.current) return;

      const normalized = normalizeCardNumber(values.cardNumber);
      const sessionId = generateSessionId();

      if (normalized === MOCK_CARD_OUTCOMES.SUCCESS) {
        setConfirmedSessionId(sessionId);
        setState(CheckoutState.Success);
        notifyParent('CHECKOUT_SUCCESS', { sessionId });
      } else if (normalized === MOCK_CARD_OUTCOMES.DECLINE) {
        setState(CheckoutState.Form);
        setErrorType(ErrorType.Declined);
        notifyParent('CHECKOUT_ERROR', { code: 'card_declined', message: 'Your card was declined.' });
      } else if (normalized === MOCK_CARD_OUTCOMES.NETWORK) {
        if (transientFailCount === 0) {
          setTransientFailCount(1);
          setState(CheckoutState.Form);
          setErrorType(ErrorType.Network);
          notifyParent('CHECKOUT_ERROR', {
            code: 'network_error',
            message: 'A network error occurred. Please try again.',
          });
        } else {
          setConfirmedSessionId(sessionId);
          setState(CheckoutState.Success);
          notifyParent('CHECKOUT_SUCCESS', { sessionId });
        }
      } else {
        setConfirmedSessionId(sessionId);
        setState(CheckoutState.Success);
        notifyParent('CHECKOUT_SUCCESS', { sessionId });
      }
    }, SUBMISSION_TOTAL_DELAY_MS);
  };

  return {
    state,
    errorType,
    submissionStep,
    confirmedSessionId,
    copiedSession,
    targetHostOrigin,
    handleClose,
    handleCopySession,
    submitPayment,
  };
}
