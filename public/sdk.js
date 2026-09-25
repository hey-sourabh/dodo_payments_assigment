(() => {
  // src/sdk.ts
  function resolveCheckoutOrigin() {
    if (typeof window !== "undefined") {
      if ("http://localhost:5173".includes("dodo-demo.app") || window.location.hostname.endsWith(".vercel.app") || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return window.location.origin;
      }
    }
    return true ? "http://localhost:5173" : "http://localhost:5173";
  }
  var DodoCheckout = class _DodoCheckout {
    static instance = null;
    iframe = null;
    overlay = null;
    config = null;
    isClosing = false;
    checkoutOrigin = resolveCheckoutOrigin();
    constructor() {
      this.handleMessage = this.handleMessage.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    static open(config) {
      if (!config || typeof config.productId !== "string" || config.productId.trim() === "") {
        throw new Error('[DodoCheckout] Invalid configuration: "productId" is required and must be a string.');
      }
      if (!_DodoCheckout.instance) {
        _DodoCheckout.instance = new _DodoCheckout();
      }
      _DodoCheckout.instance.mount(config);
    }
    static close() {
      if (_DodoCheckout.instance) {
        _DodoCheckout.instance.triggerClose("user_closed" /* UserClosed */);
      }
    }
    mount(config) {
      if (this.iframe) {
        console.warn("[DodoCheckout] Checkout is already open. Ignoring request.");
        return;
      }
      this.config = config;
      this.isClosing = false;
      this.checkoutOrigin = resolveCheckoutOrigin();
      this.overlay = document.createElement("div");
      this.overlay.setAttribute("role", "dialog");
      this.overlay.setAttribute("aria-modal", "true");
      this.overlay.setAttribute("aria-label", "Checkout");
      this.overlay.style.position = "fixed";
      this.overlay.style.top = "0";
      this.overlay.style.left = "0";
      this.overlay.style.width = "100vw";
      this.overlay.style.height = "100vh";
      this.overlay.style.backgroundColor = "rgba(15, 23, 42, 0.65)";
      this.overlay.style.backdropFilter = "blur(8px)";
      this.overlay.style.zIndex = "2147483647";
      this.overlay.style.display = "flex";
      this.overlay.style.alignItems = "center";
      this.overlay.style.justifyContent = "center";
      this.overlay.style.padding = "16px";
      this.overlay.style.opacity = "0";
      this.overlay.style.transition = "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) {
          this.triggerClose("user_closed" /* UserClosed */);
        }
      });
      const hostOrigin = typeof window !== "undefined" ? window.location.origin : "";
      const checkoutUrl = `${this.checkoutOrigin}/checkout?productId=${encodeURIComponent(
        config.productId
      )}&hostOrigin=${encodeURIComponent(hostOrigin)}`;
      this.iframe = document.createElement("iframe");
      this.iframe.src = checkoutUrl;
      this.iframe.style.width = "100%";
      this.iframe.style.maxWidth = "460px";
      this.iframe.style.height = "670px";
      this.iframe.style.maxHeight = "94vh";
      this.iframe.style.border = "none";
      this.iframe.style.borderRadius = "20px";
      this.iframe.style.boxShadow = "0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.06)";
      this.iframe.style.transform = "scale(0.96) translateY(16px)";
      this.iframe.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease";
      this.iframe.style.opacity = "0";
      this.iframe.allow = "payment";
      this.iframe.title = "Dodo Checkout";
      this.overlay.appendChild(this.iframe);
      document.body.appendChild(this.overlay);
      document.body.style.overflow = "hidden";
      void this.overlay.offsetWidth;
      this.overlay.style.opacity = "1";
      this.iframe.style.transform = "scale(1) translateY(0)";
      this.iframe.style.opacity = "1";
      window.addEventListener("message", this.handleMessage);
      document.addEventListener("keydown", this.handleKeyDown);
    }
    triggerClose(reason) {
      if (this.isClosing || !this.iframe) return;
      this.isClosing = true;
      this.iframe.contentWindow?.postMessage({ type: "CHECKOUT_CLOSING" /* Closing */, reason }, this.checkoutOrigin);
      this.unmount(reason);
    }
    unmount(reason) {
      if (!this.overlay) return;
      this.overlay.style.opacity = "0";
      if (this.iframe) {
        this.iframe.style.transform = "scale(0.95) translateY(20px)";
        this.iframe.style.opacity = "0";
      }
      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
        this.iframe = null;
        document.body.style.overflow = "";
        window.removeEventListener("message", this.handleMessage);
        document.removeEventListener("keydown", this.handleKeyDown);
        this.config?.onClose?.(reason);
        this.config = null;
        this.isClosing = false;
      }, 250);
    }
    handleMessage(event) {
      if (event.origin !== this.checkoutOrigin) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;
      switch (data.type) {
        case "CHECKOUT_SUCCESS" /* Success */:
          this.config?.onSuccess?.(data.payload);
          setTimeout(() => this.triggerClose("completed" /* Completed */), 2e3);
          break;
        case "CHECKOUT_ERROR" /* Error */:
          this.config?.onError?.(data.payload);
          break;
        case "CHECKOUT_CLOSE_REQUESTED" /* CloseRequested */:
          this.triggerClose("user_closed" /* UserClosed */);
          break;
      }
    }
    handleKeyDown(event) {
      if (event.key === "Escape") {
        this.triggerClose("escape" /* Escape */);
      }
    }
  };
  window.DodoCheckout = DodoCheckout;
})();
