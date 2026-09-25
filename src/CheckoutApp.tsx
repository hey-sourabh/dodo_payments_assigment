import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import './checkout.css';

type CheckoutState = 'loading_product' | 'form' | 'submitting' | 'success';
type ErrorType = 'declined' | 'network' | 'invalid_product' | null;

// HOST_ORIGIN is injected at build time via Vite's define config.
// In dev: http://localhost:5173 | In prod: https://acme-store.dodo-demo.app
// We never use '*' — that would let any page spoof the host.
declare const __HOST_ORIGIN__: string;
const HOST_ORIGIN = __HOST_ORIGIN__;

export default function CheckoutApp() {
  const [state, setState] = useState<CheckoutState>('loading_product');
  const [errorType, setErrorType] = useState<ErrorType>(null);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [email, setEmail] = useState('');

  const [transientFailCount, setTransientFailCount] = useState(0);

  // Set when the host tells us it's tearing down the iframe (Esc, backdrop
  // click, programmatic close). Prevents an in-flight setTimeout from
  // touching state or posting messages after the parent has stopped
  // listening — cheap, but avoids noisy console errors on unmount races.
  const isClosingRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');

    if (!productId) {
      setErrorType('invalid_product');
      notifyParent('CHECKOUT_ERROR', { code: 'invalid_product', message: 'Missing product ID.' });
      return;
    }

    // Simulate loading product details
    const timer = setTimeout(() => {
      if (isClosingRef.current) return;
      if (productId === 'invalid_prod_123') {
        setErrorType('invalid_product');
        notifyParent('CHECKOUT_ERROR', { code: 'invalid_product', message: 'The specified product does not exist.' });
      } else {
        setState('form');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleParentMessage = (event: MessageEvent) => {
      if (event.origin !== HOST_ORIGIN) return;
      if (event.data?.type === 'CHECKOUT_CLOSING') {
        isClosingRef.current = true;
      }
    };
    window.addEventListener('message', handleParentMessage);
    return () => window.removeEventListener('message', handleParentMessage);
  }, []);

  const notifyParent = (type: string, payload?: Record<string, string>) => {
    if (isClosingRef.current) return;
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type, payload }, HOST_ORIGIN);
    }
  };

  const handleClose = () => {
    notifyParent('CHECKOUT_CLOSE_REQUESTED');
  };

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return val;
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
    if (errorType === 'declined' || errorType === 'network') {
      setErrorType(null);
    }
  };

  // Rebuilds "MM / YY" purely from the digits typed so far. Deliberately
  // simple: no attempt to special-case deleting the separator — one extra
  // backspace to drop from "12 / " to "12" is a fine, predictable trade-off
  // versus the fragile string-equality approach this replaced.
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 4);
    const formatted = clean.length >= 3 ? `${clean.slice(0, 2)} / ${clean.slice(2)}` : clean;
    setExpiry(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'submitting') return; // Anti-double-submit

    setState('submitting');
    setErrorType(null);

    // Mock API call
    setTimeout(() => {
      if (isClosingRef.current) return;

      const normalizedCard = cardNumber.replace(/\s+/g, '');
      const sessionId = 'sess_' + Math.random().toString(36).slice(2, 11);

      if (normalizedCard === '4242424242424242') {
        setState('success');
        notifyParent('CHECKOUT_SUCCESS', { sessionId });
      } else if (normalizedCard === '4000000000000002') {
        setState('form');
        setErrorType('declined');
        notifyParent('CHECKOUT_ERROR', { code: 'card_declined', message: 'Your card was declined.' });
      } else if (normalizedCard === '4000000000000341') {
        if (transientFailCount === 0) {
          setTransientFailCount(1);
          setState('form');
          setErrorType('network');
          notifyParent('CHECKOUT_ERROR', {
            code: 'network_error',
            message: 'A network error occurred. Please try again.',
          });
        } else {
          setState('success');
          notifyParent('CHECKOUT_SUCCESS', { sessionId });
        }
      } else {
        // Any other card number: succeed, for demo convenience.
        setState('success');
        notifyParent('CHECKOUT_SUCCESS', { sessionId });
      }
    }, 1500);
  };

  if (errorType === 'invalid_product') {
    return (
      <div className="checkout-container error-fullscreen">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2>Invalid Product</h2>
        <p>The product you are trying to purchase does not exist or is unavailable.</p>
        <button onClick={handleClose} className="btn-secondary mt-6">Close</button>
      </div>
    );
  }

  if (state === 'loading_product') {
    return (
      <div className="checkout-container center-content">
        <Loader2 className="spinner" size={40} />
        <p className="mt-4 text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="checkout-container center-content success-animation">
        <CheckCircle2 size={64} className="text-green-500 mb-4" />
        <h2>Payment Successful!</h2>
        <p className="text-gray-500 text-center mt-2">Your order has been confirmed.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Complete your purchase</h2>
          <button className="close-button" onClick={handleClose} type="button" aria-label="Close checkout">×</button>
        </div>
        <div className="price-tag mt-2">
          <span className="currency">$</span>
          <span className="amount">99.00</span>
        </div>
        <p className="product-name">Premium Subscription</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state === 'submitting'}
          />
        </div>

        <div className="form-group">
          <label>Card Information</label>
          <div className="card-input-wrapper">
            <CreditCard size={18} className="input-icon" />
            <input
              type="text"
              required
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              value={cardNumber}
              onChange={handleCardChange}
              disabled={state === 'submitting'}
              className="card-input"
              inputMode="numeric"
            />
          </div>
          <div className="card-details-row">
            <input
              type="text"
              required
              placeholder="MM / YY"
              maxLength={7}
              value={expiry}
              onChange={handleExpiryChange}
              disabled={state === 'submitting'}
              inputMode="numeric"
            />
            <input
              type="text"
              required
              placeholder="CVC"
              maxLength={4}
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
              disabled={state === 'submitting'}
              inputMode="numeric"
            />
          </div>
        </div>

        {errorType === 'declined' && (
          <div className="error-banner">
            <AlertCircle size={16} />
            <span>Your card was declined. Please try a different card.</span>
          </div>
        )}

        {errorType === 'network' && (
          <div className="error-banner">
            <AlertCircle size={16} />
            <span>A network error occurred. Please try again.</span>
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={state === 'submitting'}>
          {state === 'submitting' ? (
            <>
              <Loader2 className="spinner-small" size={18} />
              Processing...
            </>
          ) : (
            `Pay $99.00`
          )}
        </button>
      </form>
    </div>
  );
}