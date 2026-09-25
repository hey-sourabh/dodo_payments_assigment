import { QuickFillType } from '../../../../enums';

interface QuickFillStripProps {
  onFill: (type: QuickFillType) => void;
}

const CHIPS: { type: QuickFillType; label: string; className: string; title: string }[] = [
  { type: QuickFillType.Success, label: '✓ Success', className: 'chip-success', title: 'Autofill successful card' },
  { type: QuickFillType.Declined, label: '✕ Decline', className: 'chip-decline', title: 'Autofill declining card' },
  { type: QuickFillType.Network, label: '↻ Retry', className: 'chip-network', title: 'Autofill network retry card' },
];

export function QuickFillStrip({ onFill }: QuickFillStripProps) {
  return (
    <div className="demo-quickfill-strip">
      <span className="quickfill-title">Demo Cards:</span>
      {CHIPS.map(({ type, label, className, title }) => (
        <button
          key={type}
          type="button"
          className={`quickfill-chip ${className}`}
          onClick={() => onFill(type)}
          title={title}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
