import React, { useState } from 'react';
import SensorSelector from './components/SensorSelector';
import TimeRangeSelector from './components/TimeRangeSelector';
import SensorChart from './components/SensorChart';
import RegionTabs, { HOME_TAB } from './components/RegionTabs';
import { REGIONS } from './regions';

const DEFAULT_HOME_IDS = [
  '30440647-4152-4dea-94b6-c623a4c76eb4', // Burnside Island at Hunt Drive
  '9ad953f0-2259-47e4-9d16-f46fea05badc', // Country Club Creek at Marine Science Center
  '867c5ecb-6b7b-4d78-8c11-933d71704df0', // Herb River at La Roche Avenue
];

// Keep the open tab in the URL hash so a refresh stays on the same tab.
function tabFromHash() {
  const hash = window.location.hash.replace('#', '');
  return REGIONS.some(r => r.id === hash) ? hash : HOME_TAB;
}

function App() {
  const [activeTab, setActiveTabState] = useState(tabFromHash);
  const [selectedIds, setSelectedIds] = useState(DEFAULT_HOME_IDS);
  const [selectedRange, setSelectedRange] = useState('24h');

  const setActiveTab = (tab) => {
    window.location.hash = tab === HOME_TAB ? '' : tab;
    setActiveTabState(tab);
  };

  const activeRegion = REGIONS.find(r => r.id === activeTab);

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>
        {activeRegion ? `Water Level: ${activeRegion.name}` : 'Water Level Comparison'}
      </h2>
      <RegionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeRegion ? (
        <>
          <TimeRangeSelector selectedRange={selectedRange} setSelectedRange={setSelectedRange} />
          <SensorChart
            key={activeRegion.id}
            sensorIds={activeRegion.sensors.map(s => s.id)}
            selectedRange={selectedRange}
          />
        </>
      ) : (
        <>
          <SensorSelector selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
          <TimeRangeSelector selectedRange={selectedRange} setSelectedRange={setSelectedRange} />
          <SensorChart sensorIds={selectedIds} selectedRange={selectedRange} />
        </>
      )}
    </div>
  );
}

export default App;
