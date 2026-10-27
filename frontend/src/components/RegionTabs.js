import React from 'react';
import { REGIONS } from '../regions';

export const HOME_TAB = 'home';

const TABS = [{ id: HOME_TAB, name: 'Home' }, ...REGIONS];

function RegionTabs({ activeTab, setActiveTab }) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '20px',
      }}
    >
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: '-1px',
              backgroundColor: 'transparent',
              color: isActive ? '#2563eb' : '#475569',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '500',
              cursor: 'pointer',
            }}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
}

export default RegionTabs;
