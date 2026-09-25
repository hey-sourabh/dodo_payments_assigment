import { CheckoutState, ErrorType } from '../../enums';
import { useCheckout, useCheckoutForm } from '../../hooks';
import { SecurityStrip } from './components/SecurityStrip';
import { CheckoutStepper } from './components/CheckoutStepper';
import { OrderSummary } from './components/OrderSummary';
import { QuickFillStrip } from './components/QuickFillStrip';
import { PaymentForm } from './components/PaymentForm';
import { LoadingScreen } from './components/LoadingScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { InvalidProductScreen } from './components/InvalidProductScreen';
import { normalizeCardNumber } from '../../utils';

export function CheckoutFeature() {
  const {
    state,
    errorType,
    submissionStep,
    confirmedSessionId,
    copiedSession,
    targetHostOrigin,
    handleClose,
    handleCopySession,
    submitPayment,
  } = useCheckout();

  const { form, emailValue, cardNumberValue, currentBrand, quickFill } = useCheckoutForm();

  if (errorType === ErrorType.InvalidProduct) {
    return (
      <InvalidProductScreen
        targetHostOrigin={targetHostOrigin}
        onClose={handleClose}
      />
    );
  }

  if (state === CheckoutState.LoadingProduct) {
    return <LoadingScreen />;
  }

  if (state === CheckoutState.Success) {
    const last4 = cardNumberValue
      ? normalizeCardNumber(cardNumberValue).slice(-4)
      : '4242';

    return (
      <SuccessScreen
        confirmedSessionId={confirmedSessionId}
        email={emailValue}
        last4={last4}
        copiedSession={copiedSession}
        onCopySession={handleCopySession}
      />
    );
  }

  const progressWidth = emailValue ? '75%' : '50%';

  return (
    <div className="checkout-container">
      <div className="checkout-sticky-header">
        <SecurityStrip />
        <CheckoutStepper progressWidth={progressWidth} emailFilled={!!emailValue} />
        <OrderSummary onClose={handleClose} />
      </div>
      <QuickFillStrip onFill={quickFill} />
      <PaymentForm
        form={form}
        currentBrand={currentBrand}
        state={state}
        errorType={errorType}
        submissionStep={submissionStep}
        onSubmit={submitPayment}
      />
    </div>
  );
}
