import { LogEventType } from '../../enums';
import { useDodoSdk, useEventLog } from '../../hooks';
import { DemoNavbar } from './components/DemoNavbar';
import { HeroSection } from './components/HeroSection';
import { TestScenarios } from './components/TestScenarios';
import { ArchitectureCallout } from './components/ArchitectureCallout';
import { TelemetryLog } from './components/TelemetryLog';

export function DemoFeature() {
  const { sdkLoaded, getSdk } = useDodoSdk();
  const {
    logs,
    filteredLogs,
    filterType,
    setFilterType,
    addLog,
    clearLogs,
    countByType,
  } = useEventLog();

  const handleBuy = (productId: string) => {
    const dodo = getSdk();
    if (!dodo) {
      alert('DodoCheckout SDK is still loading. Please try again in a moment.');
      return;
    }

    try {
      dodo.open({
        productId,
        onSuccess: (payload) => {
          addLog(LogEventType.Success, payload);
        },
        onClose: (reason) => {
          addLog(LogEventType.Close, { reason });
        },
        onError: (error) => {
          addLog(LogEventType.Error, error);
        },
      });
    } catch (e: unknown) {
      const err = e as Error;
      addLog(LogEventType.Error, { message: err.message });
    }
  };

  const handleProgrammaticClose = () => {
    const dodo = getSdk();
    if (dodo) {
      dodo.close();
      addLog(LogEventType.Close, { reason: 'programmatic_close_invoked' });
    }
  };

  return (
    <div className="demo-wrapper">
      <DemoNavbar sdkLoaded={sdkLoaded} />
      <div className="demo-container">
        <div className="demo-content">
          <HeroSection sdkLoaded={sdkLoaded} onBuy={handleBuy} />
          <TestScenarios
            sdkLoaded={sdkLoaded}
            onBuy={handleBuy}
            onProgrammaticClose={handleProgrammaticClose}
          />
          <ArchitectureCallout />
        </div>
        <TelemetryLog
          logs={logs}
          filteredLogs={filteredLogs}
          filterType={filterType}
          onFilterChange={setFilterType}
          onClear={clearLogs}
          countByType={countByType}
        />
      </div>
    </div>
  );
}
