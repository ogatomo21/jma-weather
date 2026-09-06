import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../src/index.ts'

const forecast = [{
  publishingOffice: '大阪管区気象台',
  reportDatetime: '2026-09-06T11:00:00+09:00',
  timeSeries: [{
    timeDefines: [
      '2026-09-06T11:00:00+09:00',
      '2026-09-07T00:00:00+09:00',
      '2026-09-08T00:00:00+09:00'
    ],
    areas: [{ weatherCodes: ['100', '200', '203'] }]
  }]
}]

test('weather supports today, tomorrow, and the day after tomorrow', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response(JSON.stringify(forecast))

  try {
    for (const [query, weatherCode, forecastDatetime] of [
      ['', 100, '2026-09-06T11:00:00+09:00'],
      ['&day=1', 200, '2026-09-07T00:00:00+09:00'],
      ['&day=2', 203, '2026-09-08T00:00:00+09:00']
    ]) {
      const response = await app.request(`/weather?code=270000${query}`)
      const body = await response.json()

      assert.equal(response.status, 200)
      assert.equal(body.weatherCode, weatherCode)
      assert.equal(body.forecastDatetime, forecastDatetime)
    }

    for (const day of ['-1', '3', '1.5', 'tomorrow']) {
      const response = await app.request(`/weather?code=270000&day=${day}`)
      assert.equal(response.status, 400)
    }
  } finally {
    globalThis.fetch = originalFetch
  }
})
