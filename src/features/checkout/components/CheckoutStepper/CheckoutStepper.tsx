interface CheckoutStepperProps {
  progressWidth: string;
  emailFilled: boolean;
  isSuccess?: boolean;
}

export function CheckoutStepper({ progressWidth, emailFilled, isSuccess }: CheckoutStepperProps) {
  return (
    <div className="checkout-stepper">
      <div className="stepper-bar">
        <div className="stepper-progress" style={{ width: progressWidth }} />
      </div>
      <div className="stepper-labels">
        {isSuccess ? (
          <>
            <span className="step-label done">1. Details</span>
            <span className="step-label done">2. Payment</span>
            <span className="step-label active">3. Confirmed ✓</span>
          </>
        ) : (
          <>
            <span className={`step-label ${emailFilled ? 'done' : 'active'}`}>
              {emailFilled ? '✓ Email' : '1. Account'}
            </span>
            <span className="step-label active">2. Payment</span>
            <span className="step-label">3. Confirm</span>
          </>
        )}
      </div>
    </div>
  );
}
