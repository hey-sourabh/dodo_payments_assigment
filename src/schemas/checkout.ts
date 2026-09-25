import * as yup from 'yup';

export const checkoutFormSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  cardNumber: yup
    .string()
    .required('Card number is required')
    .test('card-length', 'Card number must be 15 or 16 digits', (val) => {
      const len = (val?.replace(/\s/g, '') ?? '').length;
      return len === 15 || len === 16;
    }),

  expiry: yup
    .string()
    .required('Expiry date is required')
    .matches(/^\d{2} \/ \d{2}$/, 'Enter a valid expiry date (MM / YY)')
    .test('valid-month', 'Invalid expiry month', (val) => {
      if (!val) return false;
      const mm = parseInt(val.split(' / ')[0], 10);
      return mm >= 1 && mm <= 12;
    })
    .test('not-expired', 'Card has expired', (val) => {
      if (!val) return false;
      const [mm, yy] = val.split(' / ').map(Number);
      if (isNaN(mm) || isNaN(yy)) return false;
      const now = new Date();
      const expDate = new Date(2000 + yy, mm, 1);
      return expDate > now;
    }),

  cvv: yup
    .string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

export type CheckoutFormSchema = yup.InferType<typeof checkoutFormSchema>;
