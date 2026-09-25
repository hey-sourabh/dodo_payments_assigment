import { ShieldCheck } from 'lucide-react';

export function ArchitectureCallout() {
  return (
    <div className="architecture-callout">
      <div className="callout-header">
        <ShieldCheck size={20} className="text-emerald-600" />
        <h4>Why Iframe Isolation Matters</h4>
      </div>
      <p>
        This host page (Sourabh Labs) never injects raw credit card inputs into its DOM. By rendering the checkout inside
        an isolated <code>&lt;iframe&gt;</code> originating from <code>Dodo Payments</code>, card credentials never
        touch Sourabh Labs&apos;s JavaScript context. This brings PCI-DSS scope down to zero while eliminating XSS card-skimming
        vulnerabilities.
      </p>
    </div>
  );
}
