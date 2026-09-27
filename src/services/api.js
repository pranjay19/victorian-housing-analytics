/**
 * API Service for Victorian Housing Market Data
 * Backend: AWS API Gateway → Lambda → Amazon Athena → S3 Gold (Parquet)
 *
 * CORS NOTE:
 * The API Gateway endpoint does not return Access-Control-Allow-Origin headers.
 * In development, we route via the Vite dev proxy (/api/*) which is server-side
 * and therefore not subject to browser CORS restrictions.
 * For production deployments, you must either:
 *   (a) Enable CORS on the AWS Lambda function response headers, OR
 *   (b) Add a serverless proxy (e.g. Vercel rewrite, Netlify redirect, CloudFront)
 */

// Always use the /api/housing proxy path — NEVER call the AWS URL directly from the browser.
// The Vite dev + preview servers proxy /api/* → AWS API Gateway server-side (no CORS).
// For deployed production builds, configure a rewrite rule on your host (see vercel.json / _redirects).
const API_ENDPOINT = '/api/housing';

/**
 * Deduplicate and aggregate raw API rows by suburb.
 *
 * The Athena query currently returns multiple rows per suburb
 * (one per bedroom count breakdown). We merge them here:
 *   - average_price  → same across rows for same suburb → take the first
 *   - property_count → SUM all rows for the same suburb
 *
 * Example raw input:
 *   { suburb: "East Melbourne", average_price: 4525000, property_count: 1 }
 *   { suburb: "East Melbourne", average_price: 4525000, property_count: 2 }
 *   { suburb: "East Melbourne", average_price: 4525000, property_count: 3 }
 * Output:
 *   { suburb: "East Melbourne", average_price: 4525000, property_count: 6 }
 */
function deduplicateBySuburb(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = row.suburb.trim().toLowerCase();
    if (map.has(key)) {
      const existing = map.get(key);
      // Sum the property counts across bedroom breakdown rows
      existing.property_count += row.property_count;
      // Recalculate weighted average price if prices differ
      // (they are currently the same across rows, but future-proofing)
      existing.average_price = Math.round(
        (existing.average_price + row.average_price) / 2
      );
    } else {
      map.set(key, { ...row });
    }
  }
  return Array.from(map.values());
}

/**
 * Fallback mock dataset — reflects the CORRECTLY AGGREGATED values
 * that match what the API returns after deduplication.
 * (East Melbourne: 1+2+3=6, Ivanhoe East: 2+4+6=12, etc.)
 */
export const FALLBACK_DATA = [
  { suburb: "East Melbourne",  average_price: 4525000.00,    property_count: 6  },
  { suburb: "Ivanhoe East",    average_price: 2555000.00,    property_count: 12 },
  { suburb: "Canterbury",      average_price: 2489166.67,    property_count: 18 },
  { suburb: "Brighton",        average_price: 2451916.67,    property_count: 36 },
];

export async function fetchHousingData() {
  const startTime = performance.now();

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const rawData = await response.json();
    const durationMs = Math.round(performance.now() - startTime);

    if (!Array.isArray(rawData)) {
      throw new Error('Invalid payload format received from API Gateway');
    }

    // Normalize field types first
    const normalized = rawData.map(item => ({
      suburb:        String(item.suburb || 'Unknown').trim(),
      average_price: Number(item.average_price) || 0,
      property_count: Number(item.property_count) || 0,
    }));

    // Deduplicate bedroom-level rows into suburb-level aggregates
    const deduplicated = deduplicateBySuburb(normalized);

    // Sort by average_price descending (highest suburb first)
    deduplicated.sort((a, b) => b.average_price - a.average_price);

    return {
      data: deduplicated,
      isFallback: false,
      latency: durationMs,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.warn('[API] Fetch failed — using offline fallback data:', error.message);
    const durationMs = Math.round(performance.now() - startTime);

    return {
      data: FALLBACK_DATA,
      isFallback: true,
      error: error.message,
      latency: durationMs,
      timestamp: new Date().toISOString(),
    };
  }
}
