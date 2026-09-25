import { Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { Lock, Info, Loader2, ShieldCheck } from 'lucide-react';
import { ACCEPTED_CARD_NETWORKS } from '../../../../constants';
import { CheckoutState, ErrorType } from '../../../../enums';
import type { CardBrand } from '../../../../enums';
import { formatCardNumber, formatExpiry } from '../../../../utils';
import { CardBrandIcon } from '../CardBrandIcon';
import { ErrorBanner } from '../ErrorBanner';
import { VerificationProgress } from '../VerificationProgress';
import type { CheckoutFormValues } from '../../../../types';
import type { CheckoutFormSchema } from '../../../../schemas';

interface PaymentFormProps {
  form: UseFormReturn<CheckoutFormSchema>;
  currentBrand: CardBrand;
  state: CheckoutState;
  errorType: ErrorType | null;
  submissionStep: number;
  onSubmit: (values: CheckoutFormValues) => void;
}

export function PaymentForm({
  form,
  currentBrand,
  state,
  errorType,
  submissionStep,
  onSubmit,
}: PaymentFormProps) {
  const isSubmitting = state === CheckoutState.Submitting;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="checkout-form" noValidate>
      <div className="form-group">
        <label htmlFor="checkout-email" className="input-label">
          <span>Email Address</span>
          <span className="label-badge">Receipt & Invoicing</span>
        </label>
        <input
          id="checkout-email"
          type="email"
          placeholder="alex.smith@example.com"
          disabled={isSubmitting}
          className={`text-input${errors.email ? ' input-error' : ''}`}
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <div className="flex justify-between items-center">
          <label className="input-label">Card Information</label>
          <div className="accepted-cards-row">
            {ACCEPTED_CARD_NETWORKS.map((net) => (
              <span key={net} className="card-badge-mini">
                {net}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`card-fields-box${
            errors.cardNumber || errors.expiry || errors.cvv ? ' card-box-error' : ''
          }`}
        >
          <div className="card-number-wrapper">
            <div className="brand-icon-slot">
              <CardBrandIcon brand={currentBrand} />
            </div>
            <Controller
              name="cardNumber"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="4242 •••• •••• 4242"
                  maxLength={19}
                  disabled={isSubmitting}
                  className="card-input"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  aria-label="Credit card number"
                  onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                />
              )}
            />
            <Lock size={14} className="input-secure-icon" />
          </div>

          <div className="card-details-row">
            <div className="detail-field">
              <Controller
                name="expiry"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="MM / YY"
                    maxLength={7}
                    disabled={isSubmitting}
                    inputMode="numeric"
                    className="expiry-input"
                    aria-label="Card expiry date MM / YY"
                    onChange={(e) => field.onChange(formatExpiry(e.target.value))}
                  />
                )}
              />
            </div>
            <div className="detail-field cvc-field">
              <Controller
                name="cvv"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="CVC / CVV"
                    maxLength={4}
                    disabled={isSubmitting}
                    inputMode="numeric"
                    className="cvc-input"
                    aria-label="Card verification code"
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                  />
                )}
              />
              <span className="cvc-hint" title="3 digits on back (4 on Amex front)">
                <Info size={12} />
              </span>
            </div>
          </div>
        </div>

        {(errors.cardNumber || errors.expiry || errors.cvv) && (
          <span className="field-error">
            {errors.cardNumber?.message || errors.expiry?.message || errors.cvv?.message}
          </span>
        )}
      </div>

      {errorType && errorType !== ErrorType.InvalidProduct && (
        <ErrorBanner errorType={errorType} />
      )}

      {isSubmitting && <VerificationProgress step={submissionStep} />}

      <button type="submit" className="btn-pay" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="spinner-small" size={18} />
            Authorizing Payment...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Lock size={16} />
            <span>Pay $99.00 USD</span>
          </span>
        )}
      </button>

      <div className="checkout-trust-footer">
        <div className="trust-footnote">
          <ShieldCheck size={13} className="text-emerald-600 flex-shrink-0" />
          <span>Card data is tokenized by Dodo Payments and never stored on merchant servers.</span>
        </div>
        <div className="powered-by-row">
          <span>Powered by</span>
          <span className="dodo-brand font-bold">Dodo Payments</span>
          <span className="brand-tag">SECURE</span>
        </div>
      </div>
    </form>
  );
}
