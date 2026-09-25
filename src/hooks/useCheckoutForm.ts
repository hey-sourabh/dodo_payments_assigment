import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { checkoutFormSchema } from '../schemas';
import type { CheckoutFormSchema } from '../schemas';
import { QuickFillType } from '../enums';
import { DEMO_CARDS } from '../constants';
import { detectCardBrand } from '../utils';

export function useCheckoutForm() {
  const form = useForm<CheckoutFormSchema>({
    resolver: yupResolver(checkoutFormSchema),
    defaultValues: {
      email: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
    mode: 'onTouched',
  });

  const emailValue = form.watch('email') || '';
  const cardNumberValue = form.watch('cardNumber') || '';
  const currentBrand = detectCardBrand(cardNumberValue);

  const quickFill = (type: QuickFillType) => {
    const card = DEMO_CARDS[type];
    form.setValue('email', card.email, { shouldValidate: true, shouldDirty: true });
    form.setValue('cardNumber', card.cardNumber, { shouldValidate: true, shouldDirty: true });
    form.setValue('expiry', card.expiry, { shouldValidate: true, shouldDirty: true });
    form.setValue('cvv', card.cvv, { shouldValidate: true, shouldDirty: true });
  };

  return {
    form,
    emailValue,
    cardNumberValue,
    currentBrand,
    quickFill,
  };
}
