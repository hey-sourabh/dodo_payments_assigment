import { CreditCard } from 'lucide-react';
import { CardBrand } from '../../../../enums';

interface CardBrandIconProps {
  brand: CardBrand;
}

export function CardBrandIcon({ brand }: CardBrandIconProps) {
  if (brand === CardBrand.Visa) {
    return (
      <svg className="card-brand-badge visa" viewBox="0 0 36 24" width="32" height="20" aria-label="Visa">
        <rect width="36" height="24" rx="4" fill="#1434CB" />
        <path d="M14.5 16.5L16.8 6.5H19.2L16.9 16.5H14.5ZM24.4 6.7C23.9 6.5 23.2 6.3 22.3 6.3C19.8 6.3 18.1 7.6 18.1 9.4C18.1 10.8 19.3 11.5 20.3 12C21.3 12.5 21.6 12.8 21.6 13.3C21.6 14 20.8 14.4 20 14.4C19.1 14.4 18.5 14.2 17.8 13.9L17.4 13.7L17 15.6C17.6 15.9 18.7 16.2 19.8 16.2C22.4 16.2 24.1 14.9 24.1 13C24.1 11.4 23 10.6 21.8 10C20.9 9.5 20.5 9.2 20.5 8.7C20.5 8.2 21.1 7.8 22.1 7.8C22.8 7.8 23.4 8 23.9 8.2L24.4 6.7ZM28.5 6.5H26.7C26.1 6.5 25.7 6.7 25.5 7.3L21.8 16.5H24.3L24.8 15.1H27.9L28.2 16.5H30.4L28.5 6.5ZM25.5 13.3L26.5 9.1L27.1 13.3H25.5ZM13.8 6.5L11.5 13.4L11.2 12.2C10.7 10.5 9.2 8.7 7.4 7.7L9.6 16.5H12.1L16.3 6.5H13.8Z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (brand === CardBrand.Mastercard) {
    return (
      <svg className="card-brand-badge mastercard" viewBox="0 0 36 24" width="32" height="20" aria-label="Mastercard">
        <rect width="36" height="24" rx="4" fill="#0A0A0A" />
        <circle cx="14" cy="12" r="7" fill="#EB001B" />
        <circle cx="22" cy="12" r="7" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    );
  }

  if (brand === CardBrand.Amex) {
    return (
      <svg className="card-brand-badge amex" viewBox="0 0 36 24" width="32" height="20" aria-label="American Express">
        <rect width="36" height="24" rx="4" fill="#006FCF" />
        <text x="18" y="15" fill="#FFFFFF" fontSize="8" fontWeight="800" textAnchor="middle" letterSpacing="-0.5">AMEX</text>
      </svg>
    );
  }

  return <CreditCard size={18} className="input-icon-svg" />;
}
