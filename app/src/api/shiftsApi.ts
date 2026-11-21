import { getBaseUrls, LAN_API_URL } from './client';
import { Shift } from '../types/shift';

/**
 * Cached working base URL to avoid fallback latency on subsequent requests
 */
let cachedBaseUrl: string | null = null;

/**
 * Executes a network request with automatic multi-endpoint fallback across:
 * - Dynamic LAN/Hotspot IP (Physical device)
 * - 10.0.2.2 (Android Emulator)
 * - localhost (adb reverse / Simulator / Web)
 */
async function fetchWithFallback(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const baseUrls = getBaseUrls();
  const validBaseUrls = baseUrls.length > 0 ? baseUrls : [LAN_API_URL];

  const urlsToTry = cachedBaseUrl && validBaseUrls.includes(cachedBaseUrl)
    ? [cachedBaseUrl, ...validBaseUrls.filter((u) => u !== cachedBaseUrl)]
    : validBaseUrls;

  let lastError: any = null;

  for (const baseUrl of urlsToTry) {
    if (!baseUrl || typeof baseUrl !== 'string') continue;
    try {
      const url = `${baseUrl}${endpoint}`;
      const res = await fetch(url, options);

      // Successfully connected to an HTTP server (200, 400, etc.)
      cachedBaseUrl = baseUrl;
      return res;
    } catch (err) {
      lastError = err;
      // Continue to next candidate URL
    }
  }

  throw lastError || new Error('Network connection failed across all endpoints');
}

export const shiftsApi = {
  /**
   * Fetch all shifts
   */
  async getShifts(): Promise<Shift[]> {
    const response = await fetchWithFallback('', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shifts: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Book a shift by ID
   */
  async bookShift(id: string): Promise<Shift> {
    const response = await fetchWithFallback(`/${id}/book`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || `Booking failed with status ${response.status}`;
      throw new Error(message);
    }

    return response.json();
  },

  /**
   * Cancel a shift by ID
   */
  async cancelShift(id: string): Promise<Shift> {
    const response = await fetchWithFallback(`/${id}/cancel`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || `Cancellation failed with status ${response.status}`;
      throw new Error(message);
    }

    return response.json();
  },
};
