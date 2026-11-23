import { NativeModules, Platform } from 'react-native';

/**
 * Default fallback API URL (standard localhost)
 */
export const DEFAULT_API_URL = 'http://localhost:8080/shifts';

/**
 * Active local Wi-Fi / Hotspot LAN IP address of development machine
 */
export const CURRENT_LAN_API_URL = 'http://10.164.242.247:8080/shifts';

/**
 * Extracts the Metro bundler host IP dynamically from the loaded JavaScript bundle URL.
 * Works across local Wi-Fi, mobile hotspot, or office network.
 *
 * Example scriptURL: "http://192.168.1.15:8081/index.bundle?platform=android..."
 */
export function getDynamicHostIp(): string | null {
  const scriptURL: string = NativeModules.SourceCode?.scriptURL || '';
  const match = scriptURL.match(/^https?:\/\/([^:/]+)/);
  const host = match ? match[1] : null;

  if (host && host !== 'localhost' && host !== '127.0.0.1' && host !== '10.0.2.2') {
    return host;
  }
  return null;
}

/**
 * Returns prioritized candidate API base URLs ordered by reachability:
 * 1. Environment Variable EXPO_PUBLIC_API_URL (if specified in .env)
 * 2. Dynamically extracted Metro Host IP (Physical device on ANY network)
 * 3. Active LAN IP fallback (Physical phone on development hotspot/Wi-Fi)
 * 4. Android Emulator loopback alias (10.0.2.2 -> host machine port 8080)
 * 5. Localhost (iOS Simulator / Web browser / adb reverse)
 */
export function getBaseUrls(): string[] {
  const urls: string[] = [];

  // 1. Explicit environment variable if configured
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    urls.push(envUrl.endsWith('/shifts') ? envUrl : `${envUrl}/shifts`);
  }

  // 2. Dynamically resolved host IP from Metro bundle URL
  const dynamicHostIp = getDynamicHostIp();
  if (dynamicHostIp) {
    urls.push(`http://${dynamicHostIp}:8080/shifts`);
  }

  // 3. Known active development machine LAN/Hotspot IP
  urls.push(CURRENT_LAN_API_URL);

  // 4. Android Emulator loopback alias (maps emulator to host machine port 8080)
  if (Platform.OS === 'android') {
    urls.push('http://10.0.2.2:8080/shifts');
  }

  // 5. Localhost (standard for iOS Simulator, Web, or adb reverse)
  urls.push(DEFAULT_API_URL);

  // Return deduplicated list of valid non-empty URLs
  return Array.from(new Set(urls.filter((u): u is string => typeof u === 'string' && u.length > 0)));
}

// Backward-compatible exports
export const PRIMARY_URL = DEFAULT_API_URL;
export const FALLBACK_URL = Platform.select({
  android: 'http://10.0.2.2:8080/shifts',
  default: DEFAULT_API_URL,
});
