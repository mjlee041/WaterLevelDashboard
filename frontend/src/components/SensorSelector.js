import React from 'react';

import { ALL_SENSORS, SERIES_COLORS } from '../regions';

const MAX_SELECTION = 3;
  
  function SensorSelector({ selectedIds, setSelectedIds }) {
    const handleToggle = (sensorId) => {
      if (selectedIds.includes(sensorId)) {
        if (selectedIds.length === 1) {
          alert("At least one sensor must be selected.");
          return;
        }
        setSelectedIds(selectedIds.filter(id => id !== sensorId));
      } else {
        if (selectedIds.length >= MAX_SELECTION) {
          alert(`You can select a maximum of ${MAX_SELECTION} sensors.`);
          return;
        }
        setSelectedIds([...selectedIds, sensorId]);
      }
    };
  
    return (
      <div style={{
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Select Sensors to Compare</h3>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            {selectedIds.length} / {MAX_SELECTION} selected
          </span>
        </div>
  
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {ALL_SENSORS.map(sensor => {
            const selectedIndex = selectedIds.indexOf(sensor.id);
            const isChecked = selectedIndex !== -1;
            const isDisabled = !isChecked && selectedIds.length >= MAX_SELECTION;
            const badgeColor = isChecked ? SERIES_COLORS[selectedIndex] : '#cbd5e1';
  
            return (
              <label
                key={sensor.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: isChecked ? `1.5px solid ${badgeColor}` : '1px solid #cbd5e1',
                  backgroundColor: isChecked ? '#ffffff' : '#f8fafc',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => handleToggle(sensor.id)}
                  style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                />
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: badgeColor,
                    display: 'inline-block'
                  }}
                />
                <span style={{ fontSize: '13px', fontWeight: isChecked ? '600' : '400', color: '#1e293b' }}>
                  {sensor.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }
  
  export default SensorSelector;