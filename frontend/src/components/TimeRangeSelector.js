import React from 'react';

export const TIME_RANGES = [
  { label: '1 Hour', value: '1h', seconds: 1 * 60 * 60 },
  { label: '6 Hours', value: '6h', seconds: 6 * 60 * 60 },
  { label: '12 Hours', value: '12h', seconds: 12 * 60 * 60 },
  { label: '24 Hours', value: '24h', seconds: 24 * 60 * 60 },
  { label: '2 Days', value: '2d', seconds: 2 * 24 * 60 * 60 },
  { label: '3 Days', value: '3d', seconds: 3 * 24 * 60 * 60 },
];

function TimeRangeSelector({ selectedRange, setSelectedRange }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    }}>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginRight: '4px' }}>
        Time Range:
      </span>
      {TIME_RANGES.map((range) => {
        const isActive = selectedRange === range.value;

        return (
          <button
            key={range.value}
            type="button"
            onClick={() => setSelectedRange(range.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: isActive ? '1px solid #2563eb' : '1px solid #cbd5e1',
              backgroundColor: isActive ? '#2563eb' : '#ffffff',
              color: isActive ? '#ffffff' : '#334155',
              fontSize: '13px',
              fontWeight: isActive ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: isActive ? '0 2px 4px rgba(37, 99, 235, 0.2)' : 'none',
            }}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}

export default TimeRangeSelector;