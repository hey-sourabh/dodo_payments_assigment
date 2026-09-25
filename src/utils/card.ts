import { CardBrand } from '../enums';

export function formatCardNumber(val: string): string {
  const digits = val.replace(/\s+/g, '').replace(/[^0-9]/g, '');
  const match = digits.match(/\d{4,16}/)?.[0] ?? '';
  const parts: string[] = [];
  for (let i = 0; i < match.length; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  return parts.length ? parts.join(' ') : val;
}

export function formatExpiry(raw: string): string {
  let clean = raw.replace(/\D/g, '');
  
  // Auto-pad single digit months (2-9), or '1/' 
  if (clean.length === 1) {
    if (parseInt(clean, 10) > 1) {
      clean = '0' + clean;
    } else if (raw.endsWith('/') || raw.endsWith(' /')) {
      clean = '0' + clean;
    }
  }
  
  clean = clean.slice(0, 4);
  return clean.length >= 3 ? `${clean.slice(0, 2)} / ${clean.slice(2)}` : clean;
}

export function detectCardBrand(val: string): CardBrand {
  const clean = val.replace(/\D/g, '');
  if (/^4/.test(clean)) return CardBrand.Visa;
  if (/^(5[1-5]|2[2-7])/.test(clean)) return CardBrand.Mastercard;
  if (/^3[47]/.test(clean)) return CardBrand.Amex;
  if (/^6(011|5)/.test(clean)) return CardBrand.Discover;
  return CardBrand.Generic;
}

export function normalizeCardNumber(val: string): string {
  return val.replace(/\s+/g, '');
}

export function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).slice(2, 11);
}

export function copyToClipboard(text: string): void {
  navigator.clipboard?.writeText(text);
}
