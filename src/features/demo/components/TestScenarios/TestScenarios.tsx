import { Layers } from 'lucide-react';
import { PRODUCT_ID, INVALID_PRODUCT_ID } from '../../../../constants';

interface TestScenariosProps {
  sdkLoaded: boolean;
  onBuy: (productId: string) => void;
  onProgrammaticClose: () => void;
}

interface ScenarioItem {
  id: string;
  title: string;
  description: string;
  actionText: string;
  btnClass: string;
  action: () => void;
}

export function TestScenarios({ sdkLoaded, onBuy, onProgrammaticClose }: TestScenariosProps) {
  const scenarios: ScenarioItem[] = [
    {
      id: 'happy-path',
      title: '1. Standard Happy Path',
      description: 'Opens regular checkout for $99.00. Test with 4242 4242 4242 4242.',
      actionText: 'Launch Checkout',
      btnClass: 'test-primary',
      action: () => onBuy(PRODUCT_ID),
    },
    {
      id: 'invalid-product',
      title: '2. Invalid Product ID',
      description: 'Passes non-existent product ID. Verifies SDK CHECKOUT_ERROR emission.',
      actionText: 'Test Invalid Product',
      btnClass: 'test-warning',
      action: () => onBuy(INVALID_PRODUCT_ID),
    },
    {
      id: 'programmatic-close',
      title: '3. Programmatic Close',
      description: 'Tests host triggering DodoCheckout.close() during an open session.',
      actionText: 'Trigger close()',
      btnClass: 'test-neutral',
      action: onProgrammaticClose,
    },
  ];

  return (
    <div className="test-scenarios-section">
      <div className="section-header">
        <Layers size={18} className="text-indigo-600" />
        <h3>Interactive SDK Edge-Case Testing</h3>
      </div>
      <p className="section-sub">
        Test how the isolated checkout handles real-world payment edge cases and communicates events back to this
        host page:
      </p>

      <div className="scenarios-grid">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="scenario-card">
            <div className="scenario-info">
              <h4>{scenario.title}</h4>
              <p>{scenario.description}</p>
            </div>
            <button
              className={`test-btn ${scenario.btnClass}`}
              onClick={scenario.action}
              disabled={!sdkLoaded}
              type="button"
            >
              {scenario.actionText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
