interface DodoCheckoutSuccessPayload {
  sessionId: string;
}

interface DodoCheckoutErrorPayload {
  code: string;
  message: string;
}

interface DodoCheckoutConfig {
  productId: string;
  onSuccess?: (payload: DodoCheckoutSuccessPayload) => void;
  onClose?: (reason: 'user_closed' | 'completed' | 'escape') => void;
  onError?: (error: DodoCheckoutErrorPayload) => void;
}

type CheckoutMessage =
  | { type: 'CHECKOUT_SUCCESS'; payload: DodoCheckoutSuccessPayload }
  | { type: 'CHECKOUT_ERROR'; payload: DodoCheckoutErrorPayload }
  | { type: 'CHECKOUT_CLOSE_REQUESTED' };

// CHECKOUT_ORIGIN is injected at build time via esbuild --define.
// In dev: http://localhost:5173 (same Vite server serves /checkout)
// In prod: https://checkout.dodo-demo.app (separately-hosted, cross-origin app)
// The security story (strict event.origin check) is identical in both environments —
// the constant is always a fixed trusted value, never window.location.origin.
declare const __CHECKOUT_ORIGIN__: string;
const CHECKOUT_ORIGIN = __CHECKOUT_ORIGIN__;

class DodoCheckout {
  private static instance: DodoCheckout | null = null;
  private iframe: HTMLIFrameElement | null = null;
  private overlay: HTMLDivElement | null = null;
  private config: DodoCheckoutConfig | null = null;
  private isClosing: boolean = false;

  constructor() {
    this.handleMessage = this.handleMessage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  public static open(config: DodoCheckoutConfig) {
    if (!config || typeof config.productId !== 'string' || config.productId.trim() === '') {
      throw new Error('[DodoCheckout] Invalid configuration: "productId" is required and must be a string.');
    }

    if (!DodoCheckout.instance) {
      DodoCheckout.instance = new DodoCheckout();
    }

    DodoCheckout.instance.mount(config);
  }

  public static close() {
    if (DodoCheckout.instance) {
      DodoCheckout.instance.triggerClose('user_closed');
    }
  }

  private mount(config: DodoCheckoutConfig) {
    if (this.iframe) {
      console.warn('[DodoCheckout] Checkout is already open. Ignoring request.');
      return;
    }

    this.config = config;
    this.isClosing = false;

    this.overlay = document.createElement('div');
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('aria-label', 'Checkout');
    this.overlay.style.position = 'fixed';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.width = '100vw';
    this.overlay.style.height = '100vh';
    this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    this.overlay.style.backdropFilter = 'blur(4px)';
    this.overlay.style.zIndex = '2147483647';
    this.overlay.style.display = 'flex';
    this.overlay.style.alignItems = 'center';
    this.overlay.style.justifyContent = 'center';
    this.overlay.style.opacity = '0';
    this.overlay.style.transition = 'opacity 0.3s ease';

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.triggerClose('user_closed');
      }
    });

    this.iframe = document.createElement('iframe');
    this.iframe.src = `${CHECKOUT_ORIGIN}/checkout?productId=${encodeURIComponent(config.productId)}`;
    this.iframe.style.width = '100%';
    this.iframe.style.maxWidth = '420px';
    this.iframe.style.height = '600px';
    this.iframe.style.border = 'none';
    this.iframe.style.borderRadius = '16px';
    this.iframe.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    this.iframe.style.transform = 'scale(0.95) translateY(20px)';
    this.iframe.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
    this.iframe.style.opacity = '0';
    this.iframe.allow = 'payment';
    this.iframe.title = 'Dodo Checkout';

    this.overlay.appendChild(this.iframe);
    document.body.appendChild(this.overlay);
    document.body.style.overflow = 'hidden';

    void this.overlay.offsetWidth;
    this.overlay.style.opacity = '1';
    this.iframe.style.transform = 'scale(1) translateY(0)';
    this.iframe.style.opacity = '1';

    window.addEventListener('message', this.handleMessage);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  private triggerClose(reason: 'user_closed' | 'completed' | 'escape') {
    if (this.isClosing || !this.iframe) return;
    this.isClosing = true;

    this.iframe.contentWindow?.postMessage({ type: 'CHECKOUT_CLOSING', reason }, CHECKOUT_ORIGIN);
    this.unmount(reason);
  }

  private unmount(reason: 'user_closed' | 'completed' | 'escape') {
    if (!this.overlay) return;

    this.overlay.style.opacity = '0';
    if (this.iframe) {
      this.iframe.style.transform = 'scale(0.95) translateY(20px)';
      this.iframe.style.opacity = '0';
    }

    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      this.overlay = null;
      this.iframe = null;
      document.body.style.overflow = '';
      window.removeEventListener('message', this.handleMessage);
      document.removeEventListener('keydown', this.handleKeyDown);

      this.config?.onClose?.(reason);
      this.config = null;
      this.isClosing = false;
    }, 300);
  }

  private handleMessage(event: MessageEvent) {
    if (event.origin !== CHECKOUT_ORIGIN) return;

    const data = event.data as CheckoutMessage;
    if (!data || typeof data !== 'object') return;

    switch (data.type) {
      case 'CHECKOUT_SUCCESS':
        this.config?.onSuccess?.(data.payload);
        setTimeout(() => this.triggerClose('completed'), 2000);
        break;
      case 'CHECKOUT_ERROR':
        this.config?.onError?.(data.payload);
        break;
      case 'CHECKOUT_CLOSE_REQUESTED':
        this.triggerClose('user_closed');
        break;
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.triggerClose('escape');
    }
  }
}

(window as any).DodoCheckout = DodoCheckout;
