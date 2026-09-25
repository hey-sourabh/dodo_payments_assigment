import { useState, useCallback } from 'react';
import { COPY_FEEDBACK_DELAY_MS } from '../constants';

export function useCopyToClipboard() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copy = useCallback((text: string, index: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), COPY_FEEDBACK_DELAY_MS);
  }, []);

  return { copiedIndex, copy };
}
