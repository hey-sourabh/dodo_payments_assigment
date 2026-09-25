import { Zap } from 'lucide-react';

interface DemoNavbarProps {
  sdkLoaded: boolean;
}

export function DemoNavbar({ sdkLoaded }: DemoNavbarProps) {
  return (
    <header className="demo-navbar">
      <div className="navbar-container">
        <div className="brand-group">
          <div className="brand-logo-cube">
            <Zap size={20} className="logo-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Sourabh Labs</span>
            <span className="brand-subtitle">@hey-sourabh</span>
          </div>
          <span className="badge-env">SANDBOX</span>
        </div>
        <div className="nav-badges">
          <div className={`sdk-status-pill ${sdkLoaded ? 'status-ready' : 'status-loading'}`}>
            <span className="pulse-indicator" />
            <span>{sdkLoaded ? 'SDK Active (Isolated Iframe)' : 'Initializing SDK...'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
