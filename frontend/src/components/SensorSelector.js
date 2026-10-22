import React from 'react';

export const AVAILABLE_SENSORS = [
    {
      id: "30440647-4152-4dea-94b6-c623a4c76eb4",
      name: "Burnside Island at Hunt Drive",
    },
    {
      id: "9ad953f0-2259-47e4-9d16-f46fea05badc",
      name: "Country Club Creek at Marine Science Center",
    },
    {
      id: "867c5ecb-6b7b-4d78-8c11-933d71704df0",
      name: "Herb River at La Roche Avenue",
    },
    {
      id: "f1571f66-5b53-4767-81a1-d3f0daa6c573",
      name: "Hwy 21 at St Augustine Creek",
    },
    {
      id: "ffc52330-32a7-4996-b78d-49bb8ddc39dd",
      name: "Hwy 25 at Dundee Creek",
    },
    {
      id: "92279f85-e876-4f43-8e8b-38e36a213dd5",
      name: "Kilkenny Creek",
    },
    {
      id: "9cfeef25-f451-4e05-84a0-abf588601ac2",
      name: "Ossabaw Island at Ogeechee River",
    },
    {
      id: "6a79c2e0-62b9-4a70-acf4-80117cc3d2f3",
      name: "O’Leary Road at Black Creek",
    },
    {
      id: "d5cd5d7d-3e7e-4ce5-8742-88fa440cf1fa",
      name: "Skidaway Institute Dock",
    },
    {
      id: "05b03e11-aea9-4d74-a4fa-dd9b557a8025",
      name: "Turner Creek Boat Ramp",
    },
    {
      id: "9cb2d88e-2b29-4b97-bf51-fc786bf06762",
      name: "Tybee Island at Burton 4H Center",
    },
    {
      id: "6c891fca-c758-470e-8a81-fb82fb0b5d0c",
      name: "Walthour Road at Betz Creek",
    },
  ];

  const MAX_SELECTION = 3;
  const COMPARISON_COLORS = ["#2563eb", "#dc2626", "#16a34a"];
  
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
          {AVAILABLE_SENSORS.map(sensor => {
            const selectedIndex = selectedIds.indexOf(sensor.id);
            const isChecked = selectedIndex !== -1;
            const isDisabled = !isChecked && selectedIds.length >= MAX_SELECTION;
            const badgeColor = isChecked ? COMPARISON_COLORS[selectedIndex] : '#cbd5e1';
  
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