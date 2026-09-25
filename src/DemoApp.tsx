import { useState, useEffect } from 'react';
import './demo.css';

interface LogEntry {
  timestamp: string;
  type: 'success' | 'close' | 'error';
  payload?: any;
}

export default function DemoApp() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // Check if sdk is loaded from the script tag
    const checkSdk = () => {
      if ((window as any).DodoCheckout) {
        setSdkLoaded(true);
      } else {
        setTimeout(checkSdk, 100);
      }
    };
    checkSdk();
  }, []);

  const addLog = (type: LogEntry['type'], payload?: any) => {
    setLogs(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      type,
      payload
    }, ...prev]);
  };

  const handleBuy = (productId: string) => {
    if (!(window as any).DodoCheckout) {
      alert('SDK not loaded yet.');
      return;
    }

    try {
      (window as any).DodoCheckout.open({
        productId,
        onSuccess: (payload: any) => {
          addLog('success', payload);
        },
        onClose: (reason: string) => {
          addLog('close', { reason });
        },
        onError: (error: any) => {
          addLog('error', error);
        }
      });
    } catch (e: any) {
      addLog('error', { message: e.message });
    }
  };

  return (
    <div className="demo-container">
      <div className="demo-content">
        <header className="demo-header">
          <h1>Acme Store</h1>
          <p>Demo integration of DodoCheckout</p>
        </header>

        <main className="demo-main">
          <div className="product-card">
            <div className="product-image">
              <span role="img" aria-label="Rocket">🚀</span>
            </div>
            <div className="product-info">
              <h2>Premium Subscription</h2>
              <p className="price">$99.00 / month</p>
              <p className="desc">Get access to all premium features and priority support.</p>
              
              <button 
                className="buy-button" 
                onClick={() => handleBuy('prod_premium_123')}
                disabled={!sdkLoaded}
              >
                {sdkLoaded ? 'Buy Now' : 'Loading SDK...'}
              </button>
            </div>
          </div>
          
          <div className="product-card">
            <div className="product-info">
              <h2>Test: Invalid Product ID</h2>
              <p className="desc">This will trigger the SDK's error state.</p>
              <button 
                className="buy-button secondary" 
                onClick={() => handleBuy('invalid_prod_123')}
                disabled={!sdkLoaded}
              >
                Buy (Invalid ID)
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className="log-panel">
        <div className="log-header">
          <h3>SDK Event Logs</h3>
          <button className="clear-logs" onClick={() => setLogs([])}>Clear</button>
        </div>
        <div className="log-content">
          {logs.length === 0 ? (
            <p className="empty-logs">No events yet. Click "Buy Now" to start.</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className={`log-entry log-${log.type}`}>
                <div className="log-meta">
                  <span className="log-time">{log.timestamp}</span>
                  <span className={`log-badge badge-${log.type}`}>{log.type}</span>
                </div>
                {log.payload && (
                  <pre className="log-payload">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
