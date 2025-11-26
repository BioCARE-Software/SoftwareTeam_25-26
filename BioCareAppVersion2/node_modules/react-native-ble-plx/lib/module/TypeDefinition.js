'use strict';

import { BleErrorCode } from './BleError';

/**
 * Bluetooth device id.
 */

/**
 * Unique identifier for BLE objects.
 */

/**
 * Bluetooth UUID
 */

/**
 * Base64 value
 */

/**
 * Transaction identifier. All transaction identifiers in numeric form are reserved for internal use.
 */

/**
 * Characteritic subscription type.
 */

/**
 * [Android only] ConnectionOptions parameter to describe when to call BluetoothGatt.refresh()
 */

/**
 * Subscription
 * @interface
 */

/**
 * Type of error code mapping table
 */

/**
 * Options which can be passed to when creating BLE Manager
 */

/**
 * Object representing information about restored BLE state after application relaunch.
 */

/**
 * Scan mode for Bluetooth LE scan.
 */
export const ScanMode = {
  /**
   * A special Bluetooth LE scan mode. Applications using this scan mode will passively listen for
   * other scan results without starting BLE scans themselves.
   */
  Opportunistic: -1,
  /**
   * Perform Bluetooth LE scan in low power mode. This is the default scan mode as it consumes the
   * least power. [default value]
   */
  LowPower: 0,
  /**
   * Perform Bluetooth LE scan in balanced power mode. Scan results are returned at a rate that
   * provides a good trade-off between scan frequency and power consumption.
   */
  Balanced: 1,
  /**
   * Scan using highest duty cycle. It's recommended to only use this mode when the application is
   * running in the foreground.
   */
  LowLatency: 2
};

/**
 * Scan callback type for Bluetooth LE scan.
 * @name ScanCallbackType
 */
export const ScanCallbackType = {
  /**
   * Trigger a callback for every Bluetooth advertisement found that matches the filter criteria.
   * If no filter is active, all advertisement packets are reported. [default value]
   */
  AllMatches: 1,
  /**
   * A result callback is only triggered for the first advertisement packet received that matches
   * the filter criteria.
   */
  FirstMatch: 2,
  /**
   * Receive a callback when advertisements are no longer received from a device that has been
   * previously reported by a first match callback.
   */
  MatchLost: 4
};

/**
 * Options which can be passed to scanning function
 * @name ScanOptions
 */

/**
 * Connection specific options to be passed before connection happen. [Not used]
 */

/**
 * Device Bluetooth Low Energy state. It's keys are used to check {@link #blemanagerstate} values
 * received by {@link BleManager}
 */
export const State = {
  /**
   * The current state of the manager is unknown; an update is imminent.
   */
  Unknown: 'Unknown',
  /**
   * The connection with the system service was momentarily lost; an update is imminent.
   */
  Resetting: 'Resetting',
  /**
   * The platform does not support Bluetooth low energy.
   */
  Unsupported: 'Unsupported',
  /**
   * The app is not authorized to use Bluetooth low energy.
   */
  Unauthorized: 'Unauthorized',
  /**
   * Bluetooth is currently powered off.
   */
  PoweredOff: 'PoweredOff',
  /**
   * Bluetooth is currently powered on and available to use.
   */
  PoweredOn: 'PoweredOn'
};

/**
 * Native module logging log level. By default it is set to None.
 * @name LogLevel
 */
export const LogLevel = {
  /**
   * Logging in native module is disabled
   */
  None: 'None',
  /**
   * All logs in native module are shown
   */
  Verbose: 'Verbose',
  /**
   * Only debug logs and of higher importance are shown in native module.
   */
  Debug: 'Debug',
  /**
   * Only info logs and of higher importance are shown in native module.
   */
  Info: 'Info',
  /**
   * Only warning logs and of higher importance are shown in native module.
   */
  Warning: 'Warning',
  /**
   * Only error logs and of higher importance are shown in native module.
   */
  Error: 'Error'
};

/**
 * Connection priority of BLE link determining the balance between power consumption and data throughput.
 * @name ConnectionPriority
 */
export const ConnectionPriority = {
  /**
   * Default, recommended option balanced between power consumption and data throughput.
   */
  Balanced: 0,
  /**
   * High priority, low latency connection, which increases transfer speed at the expense of power consumption.
   */
  High: 1,
  /**
   * Low power, reduced data rate connection setup.
   */
  LowPower: 2
};
//# sourceMappingURL=TypeDefinition.js.map