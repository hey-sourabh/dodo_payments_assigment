# Dodo Checkout

An embeddable, secure checkout experience built for Dodo Payments.

## a. Live Link to Demo
[Add your Vercel deployment link here]

## b. Source Code
This repository contains the complete implementation.

## c. How to Run & Architecture
### Running Locally
```bash
npm install
npm run dev
```
The demo will be available at `http://localhost:5173`. 
The SDK logic is contained in `src/sdk.ts` and the checkout app is in `src/features/checkout/CheckoutFeature.tsx`.

### How the Pieces Talk to Each Other
```text
┌─────────────────┐         postMessage          ┌──────────────────────┐
│   Host page     │◄─────────────────────────────►│  Checkout iframe     │
│  (demo site)    │   open/close/success/error   │  (product→email→    │
│  loads sdk.js   │                              │   card→pay)          │
└─────────────────┘                              └──────────────────────┘
```
1. **The SDK (`sdk.ts`)**: A minimal script that the host page loads. When `DodoCheckout.open()` is called, it injects a full-screen iframe pointing to the hosted checkout app. It then listens for `postMessage` events from the iframe and maps them to the developer's callback functions (`onSuccess`, `onError`, `onClose`).
2. **The Checkout App (`CheckoutFeature.tsx`)**: An isolated React app running inside the iframe. It manages the entire payment state machine. It validates card details and simulates network requests. Crucially, the sensitive card data never leaves this isolated iframe context. It uses `window.parent.postMessage` to send safe, opaque state updates (like `CHECKOUT_SUCCESS` or `CHECKOUT_ERROR`) back to the host page.
3. **The Demo Site (`DemoFeature.tsx`)**: The integrator's page that loads the SDK. It renders the "Buy" buttons, launches the SDK, and visualizes the `postMessage` communication in a real-time Telemetry Log.

## d. Two Decisions I Went Back and Forth On

1. **Network Retry Logic (Auto-Retry vs. Manual Retry):** 
I debated whether to automatically retry the mocked network failure (`4000 0000 0000 0341`) silently under the hood, or to bubble the error up to the user and require them to manually click "Pay" again. I ultimately chose manual retry. In real-world payment flows, silent auto-retries on flaky networks can sometimes lead to accidental double-authorizations or confusing delays. Showing the user a localized "Network Error" and letting them control the retry is a safer, more transparent UX.

2. **Form State Management (Custom vs. External Library):**
I went back and forth on whether to manage the form state manually using React state, or to bring in a dependency like `react-hook-form` + `yup`. Given the constraint "We are not looking for a huge product," I hesitated to add dependencies. However, I ultimately chose `react-hook-form`. A trustworthy checkout *must* have bulletproof validation, immediate error feedback, and correct focus management. Writing custom regex for card lengths and expiry math is highly prone to edge-case bugs, and using an established library allowed me to focus heavily on the UI, craft, and cross-origin security rather than reinventing form validation.

## e. What I'd Explore Next

If I had more time, I would explore:
1. **Focus Trapping & Accessibility:** Currently, the checkout uses a full-screen overlay. However, I would implement strict focus-trapping inside the iframe so that screen readers and keyboard users cannot accidentally `Tab` out of the checkout overlay into the blurred host page. 
2. **Dynamic Localization & Currency Formatting:** I would pass a `locale` configuration through the SDK initialization (e.g., `dodo.open({ locale: 'de-DE' })`). The checkout app would use this to dynamically format currencies (e.g., `€99,00` instead of `$99.00`) and translate validation error messages, making it truly ready for global deployment.
3. **Responsive Mobile Keyboard Handling:** Improving the mobile experience by using padding adjustments or the `VirtualKeyboard API` to ensure the "Pay" button is always pinned above the iOS/Android software keyboard, preventing the inputs from being obscured during typing.
