import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import SensorSelector, { AVAILABLE_SENSORS } from './components/SensorSelector';
import TimeRangeSelector, { TIME_RANGES } from './components/TimeRangeSelector';

const COMPARISON_COLORS = ["#2563eb", "#dc2626", "#16a34a"];

function App() {
  const [selectedIds, setSelectedIds] = useState([
    AVAILABLE_SENSORS[0].id,
    AVAILABLE_SENSORS[1].id,
    AVAILABLE_SENSORS[2].id,
  ]);
  const [selectedRange, setSelectedRange] = useState('24h');
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedIds.length === 0) return;

    async function fetchData() {
      const rangeConfig = TIME_RANGES.find(r => r.value === selectedRange) || TIME_RANGES[3];
      const startTimestamp = Math.floor(Date.now() / 1000) - rangeConfig.seconds;

      const queryParams = selectedIds.map(id => `idlist=${encodeURIComponent(id)}`).join('&');
      const url = `http://127.0.0.1:8000/api/three_water_level?${queryParams}&start=${startTimestamp}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Server status ${response.status}`);

        const data = await response.json();
        const { ids = [], stages = [], dates = [] } = data;

        const activeSensors = AVAILABLE_SENSORS.filter(s => selectedIds.includes(s.id));

        const apexSeries = activeSensors.map(sensor => {
          const sensorIdx = ids.indexOf(sensor.id);
          const sensorDates = dates[sensorIdx] || [];
          const sensorStages = stages[sensorIdx] || [];

          const points = sensorDates
            .map((dateStr, idx) => ({x: new Date(dateStr).getTime(), y: Number(sensorStages[idx]),}))
            .sort((a, b) => a.x - b.x);

          return {
            name: sensor.name,
            data: points,
          };
        });

        setSeries(apexSeries);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedIds, selectedRange]);

  const activeSensors = AVAILABLE_SENSORS.filter(s => selectedIds.includes(s.id));

  const chartOptions = {
    chart: {
      type: 'line',
      zoom: { enabled: true },
      toolbar: { show: true },
    },
    colors: activeSensors.map((_, idx) => COMPARISON_COLORS[idx]),
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
      title: { text: 'Stage (m)' },
      decimalsInFloat: 2,
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: 
      function ({ series, seriesIndex, dataPointIndex, w }) {
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
          const sensorMeta = activeSensors[idx];
          const sensorColor = COMPARISON_COLORS[idx];
          const sensorName = sensorMeta?.name || s.name;
          const rawVal = series[idx][dataPointIndex];

          const val = rawVal !== null && rawVal !== undefined ? rawVal.toFixed(2) : 'N/A';

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

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading sensor graph...</p>;

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Water Level Comparison</h2>
      <SensorSelector selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
      <TimeRangeSelector selectedRange={selectedRange} setSelectedRange={setSelectedRange} />
      <Chart options={chartOptions} series={series} type="line" height={400} />
    </div>
  );
}

export default App;