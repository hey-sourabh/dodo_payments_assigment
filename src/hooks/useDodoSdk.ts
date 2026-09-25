import { useState, useEffect } from 'react';

type DodoCheckoutWindow = {
  DodoCheckout?: {
    open: (config: {
      productId: string;
      onSuccess?: (payload: Record<string, unknown>) => void;
      onClose?: (reason: string) => void;
      onError?: (error: Record<string, unknown>) => void;
    }) => void;
    close: () => void;
  };
};

export function useDodoSdk() {
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    const checkSdk = () => {
      if ((window as unknown as DodoCheckoutWindow).DodoCheckout) {
        setSdkLoaded(true);
      } else {
        setTimeout(checkSdk, 100);
      }
    };
    checkSdk();
  }, []);

  const getSdk = () => (window as unknown as DodoCheckoutWindow).DodoCheckout ?? null;

  return { sdkLoaded, getSdk };
}
