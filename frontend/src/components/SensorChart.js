import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { TIME_RANGES } from './TimeRangeSelector';
import { ALL_SENSORS, SERIES_COLORS } from '../regions';

const API_URL = 'http://127.0.0.1:8000/api/three_water_level';

function SensorChart({ sensorIds, selectedRange }) {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sensors = sensorIds.map(id => ALL_SENSORS.find(s => s.id === id)).filter(Boolean);
  const idKey = sensorIds.join(',');

  useEffect(() => {
    if (!idKey) return;
    const controller = new AbortController();

    async function fetchData() {
      const ids = idKey.split(',');
      const rangeConfig = TIME_RANGES.find(r => r.value === selectedRange) || TIME_RANGES[3];
      const startTimestamp = Math.floor(Date.now() / 1000) - rangeConfig.seconds;

      const queryParams = ids.map(id => `idlist=${encodeURIComponent(id)}`).join('&');
      const url = `${API_URL}?${queryParams}&start=${startTimestamp}`;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Server status ${response.status}`);

        const data = await response.json();
        const { ids: returnedIds = [], stages = [], dates = [] } = data;

        const apexSeries = ids.map(id => {
          const sensorIdx = returnedIds.indexOf(id);
          const sensorDates = dates[sensorIdx] || [];
          const sensorStages = stages[sensorIdx] || [];

          const points = sensorDates
            .map((dateStr, idx) => ({ x: new Date(dateStr).getTime(), y: Number(sensorStages[idx]) }))
            .sort((a, b) => a.x - b.x);

          return {
            name: ALL_SENSORS.find(s => s.id === id)?.name || id,
            data: points,
          };
        });

        setSeries(apexSeries);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [idKey, selectedRange]);

  const chartOptions = {
    chart: {
      type: 'line',
      zoom: { enabled: true },
      toolbar: { show: true },
      animations: { enabled: false },
    },
    colors: sensors.map((_, idx) => SERIES_COLORS[idx % SERIES_COLORS.length]),
    stroke: {
      curve: 'smooth',
      width: 2.5,
    },
    xaxis: {
      type: 'datetime',
      title: { text: 'Time' },
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      title: { text: 'Water Level (mm)' },
      decimalsInFloat: 0,
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const currentHoverX = w.globals.seriesX[seriesIndex][dataPointIndex];
        const hoverDate = new Date(currentHoverX);

        const hoverDateStr = hoverDate.toLocaleDateString([], {
          day: '2-digit',
          month: 'short',
        }) + ', ' + hoverDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        let rowsHtml = '';

        w.globals.initialSeries.forEach((s, idx) => {
          const sensorColor = SERIES_COLORS[idx % SERIES_COLORS.length];
          const sensorName = sensors[idx]?.name || s.name;
          const rawVal = series[idx]?.[dataPointIndex];

          const val = rawVal !== null && rawVal !== undefined ? `${rawVal.toFixed(0)} mm` : 'N/A';

          rowsHtml += `
            <div style="display: flex; align-items: center; margin-top: 4px; font-size: 13px;">
              <span style="height: 10px; width: 10px; background-color: ${sensorColor}; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>
              <span style="font-weight: 500; margin-right: 12px;">${sensorName}:</span>
              <span style="font-weight: 700; margin-left: auto;">${val}</span>
            </div>
          `;
        });

        return `
          <div style="padding: 10px 14px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="font-weight: bold; color: #64748b; font-size: 12px; margin-bottom: 6px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
              ${hoverDateStr}
            </div>
            ${rowsHtml}
          </div>
        `;
      },
    },
    markers: {
      size: 0,
      hover: {
        size: 6,
      },
    },
    legend: {
      position: 'top',
    },
  };

  const hasData = series.some(s => s.data.length > 0);

  return (
    <div>
      {error && (
        <p style={{ textAlign: 'center', color: '#dc2626', fontSize: '14px' }}>
          Could not load sensor data ({error}). Is the backend running on port 8000?
        </p>
      )}
      {!error && loading && series.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading sensor graph...</p>
      )}
      {!error && !loading && !hasData && (
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
          No readings in this time range.
        </p>
      )}
      {series.length > 0 && (
        <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.15s ease' }}>
          <Chart key={idKey} options={chartOptions} series={series} type="line" height={400} />
        </div>
      )}
    </div>
  );
}

export default SensorChart;
