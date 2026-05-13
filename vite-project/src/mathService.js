// ============================================================
//  mathService.js  –  API layer for the Math Table app
//  All network calls live here; components stay logic-free.
// ============================================================

const BASE_URL = 'https://math-table-api.onrender.com'

/**
 * Fetches the multiplication table for a given number.
 *
 * @param {number} number - The multiplier (1–100)
 * @returns {Promise<number[]>} Array of 10 multiples, e.g. [5, 10, 15, …, 50]
 * @throws {Error} With a kid-friendly message on network or API failure
 */
export async function fetchMathTable(number) {
  const url = `${BASE_URL}/table?number=${number}`

  let response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' },
    })
  } catch {
    // Network-level failure (offline, CORS, DNS, etc.)
    throw new Error('Oops! Could not reach the math server. Try again! 🚀')
  }

  if (!response.ok) {
    throw new Error(`Server said something went wrong (${response.status}). Try again! 😅`)
  }

  const data = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('Got a strange answer from the server. Try again! 🤔')
  }

  return data
}
