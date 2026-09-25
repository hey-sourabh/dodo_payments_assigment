import { ShieldCheck, Lock } from 'lucide-react';

export function SecurityStrip() {
  return (
    <div className="security-top-strip">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
        <ShieldCheck size={14} />
        <span>256-BIT SSL ENCRYPTION</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Lock size={12} />
        <span>PCI-DSS Level 1</span>
      </div>
    </div>
  );
}
