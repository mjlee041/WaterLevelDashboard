import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

const API_BASE_URL = 'http://localhost:8000'

// backend/api.py's /water_level returns [stageList, eventDateList] for the
// given site, covering from `start` (epoch seconds) up to now.
export default function WaterLevelChart({ siteId, siteName, hoursBack = 24 }) {
  const [stages, setStages] = useState([])
  const [dates, setDates] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const start = Math.floor(Date.now() / 1000) - hoursBack * 60 * 60
    let cancelled = false

    fetch(`${API_BASE_URL}/water_level?id=${siteId}&start=${start}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Backend returned ${res.status}`)
        return res.json()
      })
      .then(([stageList, eventDateList]) => {
        if (cancelled) return
        setStages(stageList)
        setDates(eventDateList)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Failed to load water level data:', err)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [siteId, hoursBack])

  if (status === 'loading') return <p>Loading water level data...</p>
  if (status === 'error') return <p>Failed to load data from the backend. Is it running on port 8000?</p>

  return (
    <Plot
      data={[
        {
          x: dates,
          y: stages,
          type: 'scatter',
          mode: 'lines',
          name: 'Stage',
          line: { color: '#2563eb' },
        },
      ]}
      layout={{
        title: { text: `Water Level — ${siteName} (last ${hoursBack}h)` },
        xaxis: { title: { text: 'Time' } },
        yaxis: { title: { text: 'Stage (ft)' } },
        margin: { t: 50, b: 50 },
        autosize: true,
      }}
      style={{ width: '100%', height: '450px' }}
      useResizeHandler
      config={{ responsive: true }}
    />
  )
}
