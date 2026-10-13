import { useEffect, useState } from 'react'

const API_BASE_URL = 'http://localhost:8000'

// Fetches the list of sites from the backend's /sites proxy (the frontend
// has no GreenStream API key of its own) and renders them as a dropdown,
// showing each site's name while reporting its id back to the parent.
export default function SiteSelector({ selectedSiteId, onChange }) {
  const [sites, setSites] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    fetch(`${API_BASE_URL}/sites`)
      .then((res) => {
        if (!res.ok) throw new Error(`Backend returned ${res.status}`)
        return res.json()
      })
      .then((siteList) => {
        setSites(siteList)
        setStatus('ready')
        if (!selectedSiteId && siteList.length > 0) {
          onChange(siteList[0].id, siteList[0].name)
        }
      })
      .catch((err) => {
        console.error('Failed to load site list:', err)
        setStatus('error')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === 'loading') return <p>Loading sites...</p>
  if (status === 'error') return <p>Failed to load site list from the backend.</p>

  return (
    <select
      value={selectedSiteId}
      onChange={(e) => {
        const site = sites.find((s) => s.id === e.target.value)
        onChange(site.id, site.name)
      }}
    >
      {sites.map((site) => (
        <option key={site.id} value={site.id}>
          {site.name}
        </option>
      ))}
    </select>
  )
}
