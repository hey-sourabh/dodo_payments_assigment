import {
  Terminal,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
import { FilterType, LogEventType } from '../../../../enums';
import { useCopyToClipboard } from '../../../../hooks';
import type { LogEntry } from '../../../../types';

interface TelemetryLogProps {
  logs: LogEntry[];
  filteredLogs: LogEntry[];
  filterType: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClear: () => void;
  countByType: (type: LogEventType) => number;
}

export function TelemetryLog({
  logs,
  filteredLogs,
  filterType,
  onFilterChange,
  onClear,
  countByType,
}: TelemetryLogProps) {
  const { copiedIndex, copy } = useCopyToClipboard();

  const filterButtons: { type: FilterType; label: string; count: number }[] = [
    { type: FilterType.All, label: 'All', count: logs.length },
    { type: FilterType.Success, label: 'Success', count: countByType(LogEventType.Success) },
    { type: FilterType.Error, label: 'Errors', count: countByType(LogEventType.Error) },
    { type: FilterType.Close, label: 'Close', count: countByType(LogEventType.Close) },
  ];

  return (
    <aside className="log-panel">
      <div className="log-header">
        <div className="log-title-group">
          <Terminal size={16} className="text-indigo-400" />
          <h3>SDK Event Telemetry</h3>
          <span className="log-count-badge">{logs.length}</span>
        </div>
        {logs.length > 0 && (
          <button className="clear-logs-btn" onClick={onClear} title="Clear telemetry events">
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="log-filters">
        {filterButtons.map((btn) => (
          <button
            key={btn.type}
            className={`filter-chip ${filterType === btn.type ? 'active' : ''}`}
            onClick={() => onFilterChange(btn.type)}
          >
            {btn.label} ({btn.count})
          </button>
        ))}
      </div>

      <div className="log-content">
        {filteredLogs.length === 0 ? (
          <div className="empty-logs">
            <div className="empty-terminal-icon">
              <Terminal size={32} />
            </div>
            <p className="empty-title">Waiting for postMessage events...</p>
            <p className="empty-subtitle">
              Click &quot;Subscribe&quot; or run a test scenario to inspect live cross-origin events.
            </p>
          </div>
        ) : (
          filteredLogs.map((log, i) => (
            <div key={i} className={`log-entry log-${log.type}`}>
              <div className="log-meta">
                <div className="log-badge-wrapper">
                  {log.type === LogEventType.Success && <CheckCircle2 size={13} className="text-emerald-600" />}
                  {log.type === LogEventType.Error && <XCircle size={13} className="text-red-600" />}
                  {log.type === LogEventType.Close && <AlertTriangle size={13} className="text-indigo-600" />}
                  <span className={`log-badge badge-${log.type}`}>{log.type.toUpperCase()}</span>
                </div>
                <span className="log-time">{log.timestamp}</span>
              </div>

              {log.payload && (
                <div className="payload-container">
                  <pre className="log-payload">{JSON.stringify(log.payload, null, 2)}</pre>
                  <button
                    className="copy-payload-btn"
                    onClick={() => copy(JSON.stringify(log.payload, null, 2), i)}
                    title="Copy event payload JSON"
                  >
                    {copiedIndex === i ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Check size={11} /> Copied
                      </span>
                    ) : (
                      <Copy size={11} />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="log-footer-bar">
        <span className="live-dot" />
        <span>Listening on window.addEventListener(&apos;message&apos;)</span>
      </div>
    </aside>
  );
}
