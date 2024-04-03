export const airQualityMock = {
  status: 'success',
  data: {
    city: 'Paris',
    state: 'Ile-de-France',
    country: 'France',
    location: {
      type: 'Point',
      coordinates: [2.351666, 48.859425],
    },
    current: {
      pollution: {
        ts: '2024-04-02T18:00:00.000Z',
        aqius: 25,
        mainus: 'p2',
        aqicn: 9,
        maincn: 'p2',
      },
      weather: {
        ts: '2024-04-02T18:00:00.000Z',
        tp: 11,
        pr: 1010,
        hu: 85,
        ws: 4.12,
        wd: 190,
        ic: '09d',
      },
    },
  },
};
