// Sensors grouped by location. Groups come from the site coordinates GreenStream
// returns from GET /sites (clusters of sites within roughly 10-15 km of each other).
// To move a sensor or rename a tab, edit it here; the tabs, the home page selector
// and the chart colors all read from this file.
export const REGIONS = [
  {
    id: 'brunswick',
    name: 'Brunswick',
    sensors: [
      { id: 'd02977db-887c-49f3-9d4e-7420daea6886', name: 'UGA Marine Extension at East River' },
      { id: '33035148-e0aa-4323-a325-bffbb209518b', name: 'Camp Tolochee at South Brunswick River' },
    ],
  },
  {
    id: 'ogeechee',
    name: 'Ogeechee & Ossabaw',
    sensors: [
      { id: '92279f85-e876-4f43-8e8b-38e36a213dd5', name: 'Kilkenny Creek' },
      { id: '9cfeef25-f451-4e05-84a0-abf588601ac2', name: 'Ossabaw Island at Ogeechee River' },
    ],
  },
  {
    id: 'skidaway',
    name: 'Skidaway Island',
    sensors: [
      { id: '30440647-4152-4dea-94b6-c623a4c76eb4', name: 'Burnside Island at Hunt Drive' },
      { id: 'd5cd5d7d-3e7e-4ce5-8742-88fa440cf1fa', name: 'Skidaway Institute Dock' },
      { id: '867c5ecb-6b7b-4d78-8c11-933d71704df0', name: 'Herb River at La Roche Avenue' },
      { id: '9ad953f0-2259-47e4-9d16-f46fea05badc', name: 'Country Club Creek at Marine Science Center' },
    ],
  },
  {
    id: 'wilmington-tybee',
    name: 'Wilmington & Tybee',
    sensors: [
      { id: '05b03e11-aea9-4d74-a4fa-dd9b557a8025', name: 'Turner Creek Boat Ramp' },
      { id: '6c891fca-c758-470e-8a81-fb82fb0b5d0c', name: 'Walthour Road at Betz Creek' },
      { id: '9cb2d88e-2b29-4b97-bf51-fc786bf06762', name: 'Tybee Island at Burton 4H Center' },
    ],
  },
  {
    id: 'north-chatham',
    name: 'North Chatham',
    sensors: [
      { id: 'ffc52330-32a7-4996-b78d-49bb8ddc39dd', name: 'Hwy 25 at Dundee Creek' },
      { id: 'f1571f66-5b53-4767-81a1-d3f0daa6c573', name: 'Hwy 21 at St Augustine Creek' },
      { id: '6a79c2e0-62b9-4a70-acf4-80117cc3d2f3', name: 'O’Leary Road at Black Creek' },
    ],
  },
];

export const ALL_SENSORS = REGIONS.flatMap(region => region.sensors);

// One color per series slot. The first three match the home page selector badges.
export const SERIES_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#7c3aed', '#0891b2'];
