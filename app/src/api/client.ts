import { NativeModules, Platform } from 'react-native';

/**
 * Known laptop Wi-Fi / Hotspot LAN IP address
 */
export const LAN_API_URL = 'http://10.164.242.247:8080/shifts';

/**
 * Fallback backward-compatible exports
 */
export const PRIMARY_URL = LAN_API_URL;
export const FALLBACK_URL = Platform.select({
  android: 'http://10.0.2.2:8080/shifts',
  default: 'http://localhost:8080/shifts',
});

/**
 * Returns candidate API base URLs ordered by reachability.
 *
 * Automatically handles:
 * 1. Physical Device (Metro bundle host IP, e.g. 10.164.242.247)
 * 2. Direct laptop Wi-Fi / Hotspot LAN IP (10.164.242.247)
 * 3. Android Emulator loopback alias (10.0.2.2)
 * 4. Localhost (adb reverse / iOS Simulator / Web)
 */
export function getBaseUrls(): string[] {
  const urls: string[] = [];

  // 1. Extract host IP dynamically from bundle URL
  // e.g., "http://10.164.242.247:8081/index.bundle?platform=android..."
  const scriptURL: string = NativeModules.SourceCode?.scriptURL || '';
  const match = scriptURL.match(/^https?:\/\/([^:/]+)/);
  const bundleHostIp = match ? match[1] : null;

  if (bundleHostIp && bundleHostIp !== 'localhost' && bundleHostIp !== '127.0.0.1') {
    urls.push(`http://${bundleHostIp}:8080/shifts`);
  }

  // 2. Direct laptop Wi-Fi / Hotspot LAN IP
  urls.push(LAN_API_URL);

  // 3. Android Emulator loopback alias
  if (Platform.OS === 'android') {
    urls.push('http://10.0.2.2:8080/shifts');
  }

  // 4. Localhost (adb reverse, Web, iOS Simulator)
  urls.push('http://localhost:8080/shifts');

  // Filter out any undefined or empty values
  return Array.from(new Set(urls.filter((u) => typeof u === 'string' && u.length > 0)));
}
