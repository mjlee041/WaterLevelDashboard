import { useState } from 'react'
import SiteSelector from './components/SiteSelector'
import WaterLevelChart from './components/WaterLevelChart'
import './App.css'

const TIME_RANGES = [
  { label: 'Last 1 hour', hours: 1 },
  { label: 'Last 3 hours', hours: 3 },
  { label: 'Last 6 hours', hours: 6 },
  { label: 'Last 12 hours', hours: 12 },
  { label: 'Last 24 hours', hours: 24 },
  { label: 'Last 3 days', hours: 72 },
  { label: 'Last 7 days', hours: 168 },
]

function App() {
  const [selectedSiteId, setSelectedSiteId] = useState('')
  const [selectedSiteName, setSelectedSiteName] = useState('')
  const [hoursBack, setHoursBack] = useState(24)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
      <h1>Water Level Dashboard</h1>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <SiteSelector
          selectedSiteId={selectedSiteId}
          onChange={(id, name) => {
            setSelectedSiteId(id)
            setSelectedSiteName(name)
          }}
        />

        <select value={hoursBack} onChange={(e) => setHoursBack(Number(e.target.value))}>
          {TIME_RANGES.map((range) => (
            <option key={range.hours} value={range.hours}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {selectedSiteId && (
        <WaterLevelChart siteId={selectedSiteId} siteName={selectedSiteName} hoursBack={hoursBack} />
      )}
    </div>
  )
}

export default App
