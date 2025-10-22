import { describe, test, expect } from 'bun:test'
import { BASE_URL } from './utils'

describe('Health Route', () => {
  test('GET / returns ok', async () => {
    const res = await fetch(`${BASE_URL}/`)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(typeof json.service).toBe('string')
  })
})