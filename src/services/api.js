/**
 * API Service for Victorian Housing Market Data
 * Target Endpoint: AWS API Gateway -> Lambda -> Athena -> S3 Gold
 */

const API_ENDPOINT = 'https://6annl8u42a.execute-api.ap-southeast-2.amazonaws.com/prod/housing';

// Fallback mock dataset matching the exact AWS Athena query payload structure
export const FALLBACK_DATA = [
  { suburb: "East Melbourne", average_price: 4525000.0, property_count: 1 },
  { suburb: "Ivanhoe East", average_price: 2555000.0, property_count: 2 },
  { suburb: "Canterbury", average_price: 2489166.67, property_count: 3 },
  { suburb: "Brighton", average_price: 2451916.67, property_count: 12 },
  { suburb: "Middle Park", average_price: 2350000.0, property_count: 1 },
  { suburb: "Aberfeldie", average_price: 2140000.0, property_count: 2 },
  { suburb: "Toorak", average_price: 2124333.33, property_count: 6 },
  { suburb: "Balwyn", average_price: 2117062.5, property_count: 16 },
  { suburb: "Malvern East", average_price: 1983055.56, property_count: 9 },
  { suburb: "Albert Park", average_price: 1956250.0, property_count: 4 }
];

export async function fetchHousingData() {
  const startTime = performance.now();
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const rawData = await response.json();
    const durationMs = Math.round(performance.now() - startTime);

    if (!Array.isArray(rawData)) {
      throw new Error("Invalid payload format received from API Gateway");
    }

    // Normalize and sort by average_price descending by default
    const normalized = rawData.map(item => ({
      suburb: String(item.suburb || 'Unknown Suburb').trim(),
      average_price: Number(item.average_price) || 0,
      property_count: Number(item.property_count) || 0
    })).sort((a, b) => b.average_price - a.average_price);

    return {
      data: normalized,
      isFallback: false,
      latency: durationMs,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.warn("AWS API Gateway fetch failed, using graceful fallback:", error.message);
    const durationMs = Math.round(performance.now() - startTime);
    return {
      data: FALLBACK_DATA,
      isFallback: true,
      error: error.message,
      latency: durationMs,
      timestamp: new Date().toISOString()
    };
  }
}
