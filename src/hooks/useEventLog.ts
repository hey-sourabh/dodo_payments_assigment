import { useState, useCallback } from 'react';
import { LogEventType, FilterType } from '../enums';
import type { LogEntry } from '../types';

export function useEventLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);

  const addLog = useCallback((type: LogEventType, payload?: Record<string, unknown>) => {
    setLogs((prev) => [
      { timestamp: new Date().toLocaleTimeString(), type, payload },
      ...prev,
    ]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const filteredLogs =
    filterType === FilterType.All
      ? logs
      : logs.filter((l) => (l.type as string) === (filterType as string));

  const countByType = (type: LogEventType) => logs.filter((l) => l.type === type).length;

  return {
    logs,
    filteredLogs,
    filterType,
    setFilterType,
    addLog,
    clearLogs,
    countByType,
  };
}
