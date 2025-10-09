'use strict';

import { Device } from './Device';
import { Service } from './Service';
import { Characteristic } from './Characteristic';
import { Descriptor } from './Descriptor';
import { State, LogLevel, ConnectionPriority } from './TypeDefinition';
import { BleModule, EventEmitter } from './BleModule';
import { parseBleError, BleError, BleErrorCode, BleErrorCodeMessage, BleATTErrorCode, BleAndroidErrorCode, BleIOSErrorCode } from './BleError';
import { isIOS } from './Utils';
import { Platform } from 'react-native';
const enableDisableDeprecatedMessage = 'react-native-ble-plx: The enable and disable feature is no longer supported. In Android SDK 31+ there were major changes in permissions, which may cause problems with these functions, and in SDK 33+ they were completely removed.';

/**
 *
 * BleManager is an entry point for react-native-ble-plx library. It provides all means to discover and work with
 * {@link Device} instances. It should be initialized only once with `new` keyword and method
 * {@link #blemanagerdestroy|destroy()} should be called on its instance when user wants to deallocate all resources.
 *
 * In case you want to properly support Background Mode, you should provide `restoreStateIdentifier` and
 * `restoreStateFunction` in {@link BleManagerOptions}.
 *
 * @example
 * const manager = new BleManager();
 * // ... work with BLE manager ...
 * manager.destroy();
 */
export class BleManager {
  // Scan subscriptions
  // $FlowIssue[missing-type-arg]

  // Listening to BleModule events
  // $FlowIssue[missing-type-arg]

  // Unique identifier used to create internal transactionIds

  // Map of active promises with functions to forcibly cancel them

  // Map of active subscriptions

  // Map of error codes to error messages

  static sharedInstance = null;

  /**
   * Creates an instance of {@link BleManager}.
   * It will return already created instance if it was created before.
   * If you want to create a new instance to for example use different options, you have to call {@link #blemanagerdestroy|destroy()} on the previous one.
   */
  constructor(options = {}) {
    if (BleManager.sharedInstance !== null) {
      // $FlowFixMe - Constructor returns shared instance for singleton pattern
      return BleManager.sharedInstance;
    }
    this._eventEmitter = new EventEmitter(BleModule);
    this._uniqueId = 0;
    this._activePromises = {};
    this._activeSubscriptions = {};
    const restoreStateFunction = options.restoreStateFunction;
    if (restoreStateFunction != null && options.restoreStateIdentifier != null) {
      // $FlowIssue[prop-missing]
      this._activeSubscriptions[this._nextUniqueID()] = this._eventEmitter.addListener(BleModule.RestoreStateEvent, nativeRestoredState => {
        if (nativeRestoredState == null) {
          restoreStateFunction(null);
          return;
        }
        restoreStateFunction({
          connectedPeripherals: nativeRestoredState.connectedPeripherals.map(nativeDevice => new Device(nativeDevice, this))
        });
      });
    }
    this._errorCodesToMessagesMapping = options.errorCodesToMessagesMapping ? options.errorCodesToMessagesMapping : BleErrorCodeMessage;
    BleModule.createClient(options.restoreStateIdentifier || null);
    BleManager.sharedInstance = this;
  }

  /**
   * Destroys all promises which are in progress.
   * @private
   */
  _destroyPromises() {
    const destroyedError = new BleError({
      errorCode: BleErrorCode.BluetoothManagerDestroyed,
      attErrorCode: null,
      iosErrorCode: null,
      androidErrorCode: null,
      reason: null
    }, this._errorCodesToMessagesMapping);
    for (const id in this._activePromises) {
      this._activePromises[id](destroyedError);
    }
  }

  /**
   * Destroys all subscriptions.
   * @private
   */
  _destroySubscriptions() {
    for (const id in this._activeSubscriptions) {
      this._activeSubscriptions[id].remove();
    }
  }

  /**
   * Destroys {@link BleManager} instance. A new instance needs to be created to continue working with
   * this library. All operations which were in progress completes with
   * @returns {Promise<void>} Promise may return an error when the function cannot be called.
   * {@link #bleerrorcodebluetoothmanagerdestroyed|BluetoothManagerDestroyed} error code.
   */
  async destroy() {
    const response = await this._callPromise(BleModule.destroyClient());

    // Unsubscribe from any subscriptions
    if (this._scanEventSubscription != null) {
      this._scanEventSubscription.remove();
      this._scanEventSubscription = null;
    }
    this._destroySubscriptions();
    if (BleManager.sharedInstance) {
      BleManager.sharedInstance = null;
    }

    // Destroy all promises
    this._destroyPromises();
    return response;
  }

  /**
   * Generates new unique identifier to be used internally.
   *
   * @returns {string} New identifier.
   * @private
   */
  _nextUniqueID() {
    this._uniqueId += 1;
    return this._uniqueId.toString();
  }

  /**
   * Calls promise and checks if it completed successfully
   *
   * @param {Promise<T>} promise Promise to be called
   * @returns {Promise<T>} Value of called promise.
   * @private
   */
  async _callPromise(promise) {
    const id = this._nextUniqueID();
    try {
      const destroyPromise = new Promise((resolve, reject) => {
        this._activePromises[id] = reject;
      });
      const value = await Promise.race([destroyPromise, promise]);
      delete this._activePromises[id];
      // $FlowIssue[incompatible-return]
      return value;
    } catch (error) {
      delete this._activePromises[id];
      throw parseBleError(error.message, this._errorCodesToMessagesMapping);
    }
  }

  // Mark: Common ------------------------------------------------------------------------------------------------------

  /**
   * Sets new log level for native module's logging mechanism.
   * @param {LogLevel} logLevel New log level to be set.
   * @returns {Promise<LogLevel>} Current log level.
   */
  setLogLevel(logLevel) {
    return this._callPromise(BleModule.setLogLevel(logLevel));
  }

  /**
   * Get current log level for native module's logging mechanism.
   * @returns {Promise<LogLevel>} Current log level.
   */
  logLevel() {
    return this._callPromise(BleModule.logLevel());
  }

  /**
   * Cancels pending transaction.
   *
   * Few operations such as monitoring characteristic's value changes can be cancelled by a user. Basically every API
   * entry which accepts `transactionId` allows to call `cancelTransaction` function. When cancelled operation is a
   * promise or a callback which registers errors, {@link #bleerror|BleError} with error code
   * {@link #bleerrorcodeoperationcancelled|OperationCancelled} will be emitted in that case. Cancelling transaction
   * which doesn't exist is ignored.
   *
   * @example
   * const transactionId = 'monitor_battery';
   *
   * // Monitor battery notifications
   * manager.monitorCharacteristicForDevice(
   *   device.id, '180F', '2A19',
   *   (error, characteristic) => {
   *   // Handle battery level changes...
   * }, transactionId);
   *
   * // Cancel after specified amount of time
   * setTimeout(() => manager.cancelTransaction(transactionId), 2000);
   *
   * @param {TransactionId} transactionId Id of pending transactions.
   * @returns {Promise<void>}
   */
  cancelTransaction(transactionId) {
    return this._callPromise(BleModule.cancelTransaction(transactionId));
  }

  // Mark: Monitoring state --------------------------------------------------------------------------------------------

  /**
   * Enable Bluetooth. This function blocks until BLE is in PoweredOn state. [Android only]
   *
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation
   * @returns {Promise<BleManager>} Promise completes when state transition was successful.
   */
  async enable(transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    await this._callPromise(BleModule.enable(transactionId));
    return this;
  }

  /**
   * Deprecated
   * Disable Bluetooth. This function blocks until BLE is in PoweredOff state. [Android only]
   *
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation
   * @returns {Promise<BleManager>} Promise completes when state transition was successful.
   */
  async disable(transactionId) {
    console.warn(enableDisableDeprecatedMessage);
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    await this._callPromise(BleModule.disable(transactionId));
    return this;
  }

  /**
   * Current, global {@link State} of a {@link BleManager}. All APIs are working only when active state
   * is "PoweredOn".
   *
   * @returns {Promise<State>} Promise which emits current state of BleManager.
   */
  state() {
    return this._callPromise(BleModule.state());
  }

  /**
   * Notifies about {@link State} changes of a {@link BleManager}.
   *
   * @example
   * const subscription = this.manager.onStateChange((state) => {
   *      if (state === 'PoweredOn') {
   *          this.scanAndConnect();
   *          subscription.remove();
   *      }
   *  }, true);
   *
   * @param {function(newState: State)} listener Callback which emits state changes of BLE Manager.
   * Look at {@link State} for possible values.
   * @param {boolean} [emitCurrentState=false] If true, current state will be emitted as well. Defaults to false.
   *
   * @returns {Subscription} Subscription on which `remove()` function can be called to unsubscribe.
   */
  onStateChange(listener, emitCurrentState = false) {
    const subscription = this._eventEmitter.addListener(BleModule.StateChangeEvent, listener);
    const id = this._nextUniqueID();
    var wrappedSubscription;
    if (emitCurrentState) {
      var cancelled = false;
      this._callPromise(this.state()).then(currentState => {
        if (!cancelled) {
          listener(currentState);
        }
      });
      wrappedSubscription = {
        remove: () => {
          if (this._activeSubscriptions[id] != null) {
            cancelled = true;
            delete this._activeSubscriptions[id];
            subscription.remove();
          }
        }
      };
    } else {
      wrappedSubscription = {
        remove: () => {
          if (this._activeSubscriptions[id] != null) {
            delete this._activeSubscriptions[id];
            subscription.remove();
          }
        }
      };
    }
    this._activeSubscriptions[id] = wrappedSubscription;
    return wrappedSubscription;
  }

  // Mark: Scanning ----------------------------------------------------------------------------------------------------

  /**
   * Starts device scanning. When previous scan is in progress it will be stopped before executing this command.
   *
   * @param {?Array<UUID>} UUIDs Array of strings containing {@link UUID}s of {@link Service}s which are registered in
   * scanned {@link Device}. If `null` is passed, all available {@link Device}s will be scanned.
   * @param {?ScanOptions} options Optional configuration for scanning operation.
   * @param {function(error: ?BleError, scannedDevice: ?Device)} listener Function which will be called for every scanned
   * @returns {Promise<void>} Promise may return an error when the function cannot be called.
   * {@link Device} (devices may be scanned multiple times). It's first argument is potential {@link Error} which is set
   * to non `null` value when scanning failed. You have to start scanning process again if that happens. Second argument
   * is a scanned {@link Device}.
   * @returns {Promise<void>} the promise may be rejected if the operation is impossible to perform.
   */
  async startDeviceScan(UUIDs, options, listener) {
    const scanListener = ([error, nativeDevice]) => {
      listener(error ? parseBleError(error, this._errorCodesToMessagesMapping) : null, nativeDevice ? new Device(nativeDevice, this) : null);
    };
    // $FlowFixMe: Flow cannot deduce EmitterSubscription type.
    this._scanEventSubscription = this._eventEmitter.addListener(BleModule.ScanEvent, scanListener);
    return this._callPromise(BleModule.startDeviceScan(UUIDs, options));
  }

  /**
   * Stops {@link Device} scan if in progress.
   * @returns {Promise<void>} the promise may be rejected if the operation is impossible to perform.
   */
  stopDeviceScan() {
    if (this._scanEventSubscription != null) {
      this._scanEventSubscription.remove();
      this._scanEventSubscription = null;
    }
    return this._callPromise(BleModule.stopDeviceScan());
  }

  /**
   * Request a connection parameter update. This functions may update connection parameters on Android API level 21 or
   * above.
   *
   * @param {DeviceId} deviceIdentifier Device identifier.
   * @param {ConnectionPriority} connectionPriority: Connection priority.
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation.
   * @returns {Promise<Device>} Connected device.
   */
  async requestConnectionPriorityForDevice(deviceIdentifier, connectionPriority, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeDevice = await this._callPromise(BleModule.requestConnectionPriorityForDevice(deviceIdentifier, connectionPriority, transactionId));
    return new Device(nativeDevice, this);
  }

  /**
   * Reads RSSI for connected device.
   *
   * @param {DeviceId} deviceIdentifier Device identifier.
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation
   * @returns {Promise<Device>} Connected device with updated RSSI value.
   */
  async readRSSIForDevice(deviceIdentifier, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeDevice = await this._callPromise(BleModule.readRSSIForDevice(deviceIdentifier, transactionId));
    return new Device(nativeDevice, this);
  }

  /**
   * Request new MTU value for this device. This function currently is not doing anything
   * on iOS platform as MTU exchange is done automatically. Since Android 14,
   * mtu management has been changed, more information can be found at the link:
   * https://developer.android.com/about/versions/14/behavior-changes-all#mtu-set-to-517
   * @param {DeviceId} deviceIdentifier Device identifier.
   * @param {number} mtu New MTU to negotiate.
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation
   * @returns {Promise<Device>} Device with updated MTU size. Default value is 23 (517 since Android 14)..
   */
  async requestMTUForDevice(deviceIdentifier, mtu, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeDevice = await this._callPromise(BleModule.requestMTUForDevice(deviceIdentifier, mtu, transactionId));
    return new Device(nativeDevice, this);
  }

  // Mark: Connection management ---------------------------------------------------------------------------------------

  /**
   * Returns a list of known devices by their identifiers.
   * @param {Array<DeviceId>} deviceIdentifiers List of device identifiers.
   * @returns {Promise<Array<Device>>} List of known devices by their identifiers.
   */
  async devices(deviceIdentifiers) {
    const nativeDevices = await this._callPromise(BleModule.devices(deviceIdentifiers));
    return nativeDevices.map(nativeDevice => {
      return new Device(nativeDevice, this);
    });
  }

  /**
   * Returns a list of the peripherals (containing any of the specified services) currently connected to the system
   * which have discovered services. Returned devices **may not be connected** to your application. Make sure to check
   * if that's the case with function {@link #blemanagerisdeviceconnected|isDeviceConnected}.
   * @param {Array<UUID>} serviceUUIDs List of service UUIDs. Device must contain at least one of them to be listed.
   * @returns {Promise<Array<Device>>} List of known devices with discovered services as stated in the parameter.
   */
  async connectedDevices(serviceUUIDs) {
    const nativeDevices = await this._callPromise(BleModule.connectedDevices(serviceUUIDs));
    return nativeDevices.map(nativeDevice => {
      return new Device(nativeDevice, this);
    });
  }

  // Mark: Connection management ---------------------------------------------------------------------------------------

  /**
   * Connects to {@link Device} with provided ID.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier.
   * @param {?ConnectionOptions} options Platform specific options for connection establishment.
   * @returns {Promise<Device>} Connected {@link Device} object if successful.
   */
  async connectToDevice(deviceIdentifier, options) {
    if (Platform.OS === 'android' && (await this.isDeviceConnected(deviceIdentifier))) {
      await this.cancelDeviceConnection(deviceIdentifier);
    }
    const nativeDevice = await this._callPromise(BleModule.connectToDevice(deviceIdentifier, options));
    return new Device(nativeDevice, this);
  }

  /**
   * Disconnects from {@link Device} if it's connected or cancels pending connection.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier to be closed.
   * @returns {Promise<Device>} Returns closed {@link Device} when operation is successful.
   */
  async cancelDeviceConnection(deviceIdentifier) {
    const nativeDevice = await this._callPromise(BleModule.cancelDeviceConnection(deviceIdentifier));
    return new Device(nativeDevice, this);
  }

  /**
   * Monitors if {@link Device} was disconnected due to any errors or connection problems.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier to be monitored.
   * @param {function(error: ?BleError, device: Device)} listener - callback returning error as a reason of disconnection
   * if available and {@link Device} object. If an error is null, that means the connection was terminated by
   * {@link #blemanagercanceldeviceconnection|bleManager.cancelDeviceConnection()} call.
   * @returns {Subscription} Subscription on which `remove()` function can be called to unsubscribe.
   */
  onDeviceDisconnected(deviceIdentifier, listener) {
    const disconnectionListener = ([error, nativeDevice]) => {
      if (deviceIdentifier !== nativeDevice.id) {
        return;
      }
      listener(error ? parseBleError(error, this._errorCodesToMessagesMapping) : null, new Device(nativeDevice, this));
    };
    const subscription = this._eventEmitter.addListener(BleModule.DisconnectionEvent, disconnectionListener);
    const id = this._nextUniqueID();
    const wrappedSubscription = {
      remove: () => {
        if (this._activeSubscriptions[id] != null) {
          delete this._activeSubscriptions[id];
          subscription.remove();
        }
      }
    };
    this._activeSubscriptions[id] = wrappedSubscription;
    return wrappedSubscription;
  }

  /**
   * Check connection state of a {@link Device}.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier.
   * @returns {Promise<boolean>} Promise which emits `true` if device is connected, and `false` otherwise.
   */
  isDeviceConnected(deviceIdentifier) {
    return this._callPromise(BleModule.isDeviceConnected(deviceIdentifier));
  }

  // Mark: Discovery ---------------------------------------------------------------------------------------------------

  /**
   * Discovers all {@link Service}s,  {@link Characteristic}s and {@link Descriptor}s for {@link Device}.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier.
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation
   * @returns {Promise<Device>} Promise which emits {@link Device} object if all available services and
   * characteristics have been discovered.
   */
  async discoverAllServicesAndCharacteristicsForDevice(deviceIdentifier, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeDevice = await this._callPromise(BleModule.discoverAllServicesAndCharacteristicsForDevice(deviceIdentifier, transactionId));
    const services = await this._callPromise(BleModule.servicesForDevice(deviceIdentifier));
    const serviceUUIDs = (services || []).map(service => service.uuid);

    // $FlowFixMe
    const device = {
      ...nativeDevice,
      serviceUUIDs
    };
    return new Device(device, this);
  }

  // Mark: Service and characteristic getters --------------------------------------------------------------------------

  /**
   * List of discovered {@link Service}s for {@link Device}.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier.
   * @returns {Promise<Array<Service>>} Promise which emits array of {@link Service} objects which are discovered for a
   * {@link Device}.
   */
  async servicesForDevice(deviceIdentifier) {
    const services = await this._callPromise(BleModule.servicesForDevice(deviceIdentifier));
    return services.map(nativeService => {
      return new Service(nativeService, this);
    });
  }

  /**
   * List of discovered {@link Characteristic}s for given {@link Device} and {@link Service}.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier.
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @returns {Promise<Array<Characteristic>>} Promise which emits array of {@link Characteristic} objects which are
   * discovered for a {@link Device} in specified {@link Service}.
   */
  characteristicsForDevice(deviceIdentifier, serviceUUID) {
    return this._handleCharacteristics(BleModule.characteristicsForDevice(deviceIdentifier, serviceUUID));
  }

  /**
   * List of discovered {@link Characteristic}s for unique {@link Service}.
   *
   * @param {Identifier} serviceIdentifier {@link Service} ID.
   * @returns {Promise<Array<Characteristic>>} Promise which emits array of {@link Characteristic} objects which are
   * discovered in unique {@link Service}.
   * @private
   */
  _characteristicsForService(serviceIdentifier) {
    return this._handleCharacteristics(BleModule.characteristicsForService(serviceIdentifier));
  }

  /**
   * Common code for handling NativeCharacteristic fetches.
   *
   * @param {Promise<Array<NativeCharacteristic>>} characteristicsPromise Native characteristics.
   * @returns {Promise<Array<Characteristic>>} Promise which emits array of {@link Characteristic} objects which are
   * discovered in unique {@link Service}.
   * @private
   */
  async _handleCharacteristics(characteristicsPromise) {
    const characteristics = await this._callPromise(characteristicsPromise);
    return characteristics.map(nativeCharacteristic => {
      return new Characteristic(nativeCharacteristic, this);
    });
  }

  /**
   * List of discovered {@link Descriptor}s for given {@link Device}, {@link Service} and {@link Characteristic}.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier.
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @returns {Promise<Array<Descriptor>>} Promise which emits array of {@link Descriptor} objects which are
   * discovered for a {@link Device}, {@link Service} in specified {@link Characteristic}.
   */
  descriptorsForDevice(deviceIdentifier, serviceUUID, characteristicUUID) {
    return this._handleDescriptors(BleModule.descriptorsForDevice(deviceIdentifier, serviceUUID, characteristicUUID));
  }

  /**
   * List of discovered {@link Descriptor}s for given {@link Service} and {@link Characteristic}.
   *
   * @param {Identifier} serviceIdentifier {@link Service} identifier.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @returns {Promise<Array<Descriptor>>} Promise which emits array of {@link Descriptor} objects which are
   * discovered for a {@link Service} in specified {@link Characteristic}.
   * @private
   */
  _descriptorsForService(serviceIdentifier, characteristicUUID) {
    return this._handleDescriptors(BleModule.descriptorsForService(serviceIdentifier, characteristicUUID));
  }

  /**
   * List of discovered {@link Descriptor}s for given {@link Characteristic}.
   *
   * @param {Identifier} characteristicIdentifier {@link Characteristic} identifier.
   * @returns {Promise<Array<Descriptor>>} Promise which emits array of {@link Descriptor} objects which are
   * discovered in specified {@link Characteristic}.
   * @private
   */
  _descriptorsForCharacteristic(characteristicIdentifier) {
    return this._handleDescriptors(BleModule.descriptorsForCharacteristic(characteristicIdentifier));
  }

  /**
   *  Common code for handling NativeDescriptor fetches.
   * @param {Promise<Array<NativeDescriptor>>} descriptorsPromise Native descriptors.
   * @returns {Promise<Array<Descriptor>>} Promise which emits array of {@link Descriptor} objects which are
   * discovered in unique {@link Characteristic}.
   * @private
   */
  async _handleDescriptors(descriptorsPromise) {
    const descriptors = await this._callPromise(descriptorsPromise);
    return descriptors.map(nativeDescriptor => {
      return new Descriptor(nativeDescriptor, this);
    });
  }

  // Mark: Characteristics operations ----------------------------------------------------------------------------------

  /**
   * Read {@link Characteristic} value.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier.
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Characteristic>} Promise which emits first {@link Characteristic} object matching specified
   * UUID paths. Latest value of {@link Characteristic} will be stored inside returned object.
   */
  async readCharacteristicForDevice(deviceIdentifier, serviceUUID, characteristicUUID, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeCharacteristic = await this._callPromise(BleModule.readCharacteristicForDevice(deviceIdentifier, serviceUUID, characteristicUUID, transactionId));
    return new Characteristic(nativeCharacteristic, this);
  }

  /**
   * Read {@link Characteristic} value.
   *
   * @param {Identifier} serviceIdentifier {@link Service} ID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Characteristic>} Promise which emits first {@link Characteristic} object matching specified
   * UUID paths. Latest value of {@link Characteristic} will be stored inside returned object.
   * @private
   */
  async _readCharacteristicForService(serviceIdentifier, characteristicUUID, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeCharacteristic = await this._callPromise(BleModule.readCharacteristicForService(serviceIdentifier, characteristicUUID, transactionId));
    return new Characteristic(nativeCharacteristic, this);
  }

  /**
   * Read {@link Characteristic} value.
   *
   * @param {Identifier} characteristicIdentifier {@link Characteristic} ID.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Characteristic>} Promise which emits first {@link Characteristic} object matching specified ID.
   * Latest value of {@link Characteristic} will be stored inside returned object.
   * @private
   */
  async _readCharacteristic(characteristicIdentifier, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeCharacteristic = await this._callPromise(BleModule.readCharacteristic(characteristicIdentifier, transactionId));
    return new Characteristic(nativeCharacteristic, this);
  }

  /**
   * Write {@link Characteristic} value with response.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier.
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {Base64} base64Value Value in Base64 format.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Characteristic>} Promise which emits first {@link Characteristic} object matching specified
   * UUID paths. Latest value of characteristic may not be stored inside returned object.
   */
  async writeCharacteristicWithResponseForDevice(deviceIdentifier, serviceUUID, characteristicUUID, base64Value, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeCharacteristic = await this._callPromise(BleModule.writeCharacteristicForDevice(deviceIdentifier, serviceUUID, characteristicUUID, base64Value, true, transactionId));
    return new Characteristic(nativeCharacteristic, this);
  }

  /**
   * Write {@link Characteristic} value with response.
   *
   * @param {Identifier} serviceIdentifier {@link Service} ID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {Base64} base64Value Value in Base64 format.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Characteristic>} Promise which emits first {@link Characteristic} object matching specified
   * UUID paths. Latest value of characteristic may not be stored inside returned object.
   * @private
   */
  async _writeCharacteristicWithResponseForService(serviceIdentifier, characteristicUUID, base64Value, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeCharacteristic = await this._callPromise(BleModule.writeCharacteristicForService(serviceIdentifier, characteristicUUID, base64Value, true, transactionId));
    return new Characteristic(nativeCharacteristic, this);
  }

  /**
   * Write {@link Characteristic} value with response.
   *
   * @param {Identifier} characteristicIdentifier {@link Characteristic} ID.
   * @param {Base64} base64Value Value in Base64 format.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Characteristic>} Promise which emits first {@link Characteristic} object matching specified ID.
   * Latest value of characteristic may not be stored inside returned object.
   * @private
   */
  async _writeCharacteristicWithResponse(characteristicIdentifier, base64Value, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeCharacteristic = await this._callPromise(BleModule.writeCharacteristic(characteristicIdentifier, base64Value, true, transactionId));
    return new Characteristic(nativeCharacteristic, this);
  }

  /**
   * Write {@link Characteristic} value without response.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier.
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {Base64} base64Value Value in Base64 format.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Characteristic>} Promise which emits first {@link Characteristic} object matching specified
   * UUID paths. Latest value of characteristic may not be stored inside returned object.
   */
  async writeCharacteristicWithoutResponseForDevice(deviceIdentifier, serviceUUID, characteristicUUID, base64Value, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeCharacteristic = await this._callPromise(BleModule.writeCharacteristicForDevice(deviceIdentifier, serviceUUID, characteristicUUID, base64Value, false, transactionId));
    return new Characteristic(nativeCharacteristic, this);
  }

  /**
   * Write {@link Characteristic} value without response.
   *
   * @param {Identifier} serviceIdentifier {@link Service} ID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {Base64} base64Value Value in Base64 format.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Characteristic>} Promise which emits first {@link Characteristic} object matching specified
   * UUID paths. Latest value of characteristic may not be stored inside returned object.
   * @private
   */
  async _writeCharacteristicWithoutResponseForService(serviceIdentifier, characteristicUUID, base64Value, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeCharacteristic = await this._callPromise(BleModule.writeCharacteristicForService(serviceIdentifier, characteristicUUID, base64Value, false, transactionId));
    return new Characteristic(nativeCharacteristic, this);
  }

  /**
   * Write {@link Characteristic} value without response.
   *
   * @param {Identifier} characteristicIdentifier {@link Characteristic} UUID.
   * @param {Base64} base64Value Value in Base64 format.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Characteristic>} Promise which emits first {@link Characteristic} object matching specified ID.
   * Latest value of characteristic may not be stored inside returned object.
   * @private
   */
  async _writeCharacteristicWithoutResponse(characteristicIdentifier, base64Value, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeCharacteristic = await this._callPromise(BleModule.writeCharacteristic(characteristicIdentifier, base64Value, false, transactionId));
    return new Characteristic(nativeCharacteristic, this);
  }

  /**
   * Monitor value changes of a {@link Characteristic}. If notifications are enabled they will be used
   * in favour of indications.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier.
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {function(error: ?BleError, characteristic: ?Characteristic)} listener - callback which emits
   * {@link Characteristic} objects with modified value for each notification.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Subscription} Subscription on which `remove()` function can be called to unsubscribe.
   */
  monitorCharacteristicForDevice(deviceIdentifier, serviceUUID, characteristicUUID, listener, transactionId, subscriptionType) {
    const filledTransactionId = transactionId || this._nextUniqueID();
    const commonArgs = [deviceIdentifier, serviceUUID, characteristicUUID, filledTransactionId];
    const args = isIOS ? commonArgs : [...commonArgs, subscriptionType];
    return this._handleMonitorCharacteristic(BleModule.monitorCharacteristicForDevice(...args), filledTransactionId, listener);
  }

  /**
   * Monitor value changes of a {@link Characteristic}. If notifications are enabled they will be used
   * in favour of indications.
   *
   * @param {Identifier} serviceIdentifier {@link Service} ID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {function(error: ?BleError, characteristic: ?Characteristic)} listener - callback which emits
   * {@link Characteristic} objects with modified value for each notification.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Subscription} Subscription on which `remove()` function can be called to unsubscribe.
   * @private
   */
  _monitorCharacteristicForService(serviceIdentifier, characteristicUUID, listener, transactionId, subscriptionType) {
    const filledTransactionId = transactionId || this._nextUniqueID();
    const commonArgs = [serviceIdentifier, characteristicUUID, filledTransactionId];
    const args = isIOS ? commonArgs : [...commonArgs, subscriptionType];
    return this._handleMonitorCharacteristic(BleModule.monitorCharacteristicForService(...args), filledTransactionId, listener);
  }

  /**
   * Monitor value changes of a {@link Characteristic}. If notifications are enabled they will be used
   * in favour of indications.
   *
   * @param {Identifier} characteristicIdentifier - {@link Characteristic} ID.
   * @param {function(error: ?BleError, characteristic: ?Characteristic)} listener - callback which emits
   * {@link Characteristic} objects with modified value for each notification.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * @param {?CharacteristicSubscriptionType} subscriptionType [android only] subscription type of the characteristic
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Subscription} Subscription on which `remove()` function can be called to unsubscribe.
   * @private
   */
  _monitorCharacteristic(characteristicIdentifier, listener, transactionId, subscriptionType) {
    const filledTransactionId = transactionId || this._nextUniqueID();
    const commonArgs = [characteristicIdentifier, filledTransactionId];
    const args = isIOS ? commonArgs : [...commonArgs, subscriptionType];
    return this._handleMonitorCharacteristic(BleModule.monitorCharacteristic(...args), filledTransactionId, listener);
  }

  /**
   * Common code to handle characteristic monitoring.
   *
   * @param {Promise<void>} monitorPromise Characteristic monitoring promise
   * @param {TransactionId} transactionId TransactionId of passed promise
   * @param {function(error: ?BleError, characteristic: ?Characteristic)} listener - callback which emits
   * {@link Characteristic} objects with modified value for each notification.
   * @returns {Subscription} Subscription on which `remove()` function can be called to unsubscribe.
   * @private
   */
  _handleMonitorCharacteristic(monitorPromise, transactionId, listener) {
    const monitorListener = ([error, characteristic, msgTransactionId]) => {
      if (transactionId !== msgTransactionId) {
        return;
      }
      if (error) {
        listener(parseBleError(error, this._errorCodesToMessagesMapping), null);
        return;
      }
      listener(null, new Characteristic(characteristic, this));
    };
    const subscription = this._eventEmitter.addListener(BleModule.ReadEvent, monitorListener);
    const id = this._nextUniqueID();
    const wrappedSubscription = {
      remove: () => {
        if (this._activeSubscriptions[id] != null) {
          delete this._activeSubscriptions[id];
          subscription.remove();
        }
      }
    };
    this._activeSubscriptions[id] = wrappedSubscription;
    this._callPromise(monitorPromise).then(() => {
      wrappedSubscription.remove();
    }, error => {
      listener(error, null);
      wrappedSubscription.remove();
    });
    return {
      remove: () => {
        BleModule.cancelTransaction(transactionId);
      }
    };
  }

  // Mark: Descriptors operations ----------------------------------------------------------------------------------

  /**
   * Read {@link Descriptor} value.
   *
   * @param {DeviceId} deviceIdentifier {@link Device} identifier.
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {UUID} descriptorUUID {@link Descriptor} UUID.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Descriptor>} Promise which emits first {@link Descriptor} object matching specified
   * UUID paths. Latest value of {@link Descriptor} will be stored inside returned object.
   */
  async readDescriptorForDevice(deviceIdentifier, serviceUUID, characteristicUUID, descriptorUUID, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeDescriptor = await this._callPromise(BleModule.readDescriptorForDevice(deviceIdentifier, serviceUUID, characteristicUUID, descriptorUUID, transactionId));
    return new Descriptor(nativeDescriptor, this);
  }

  /**
   * Read {@link Descriptor} value.
   *
   * @param {Identifier} serviceIdentifier {@link Service} identifier.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {UUID} descriptorUUID {@link Descriptor} UUID.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Descriptor>} Promise which emits first {@link Descriptor} object matching specified
   * UUID paths. Latest value of {@link Descriptor} will be stored inside returned object.
   * @private
   */
  async _readDescriptorForService(serviceIdentifier, characteristicUUID, descriptorUUID, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeDescriptor = await this._callPromise(BleModule.readDescriptorForService(serviceIdentifier, characteristicUUID, descriptorUUID, transactionId));
    return new Descriptor(nativeDescriptor, this);
  }

  /**
   * Read {@link Descriptor} value.
   *
   * @param {Identifier} characteristicIdentifier {@link Characteristic} identifier.
   * @param {UUID} descriptorUUID {@link Descriptor} UUID.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Descriptor>} Promise which emits first {@link Descriptor} object matching specified
   * UUID paths. Latest value of {@link Descriptor} will be stored inside returned object.
   * @private
   */
  async _readDescriptorForCharacteristic(characteristicIdentifier, descriptorUUID, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeDescriptor = await this._callPromise(BleModule.readDescriptorForCharacteristic(characteristicIdentifier, descriptorUUID, transactionId));
    return new Descriptor(nativeDescriptor, this);
  }

  /**
   * Read {@link Descriptor} value.
   *
   * @param {Identifier} descriptorIdentifier {@link Descriptor} identifier.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Descriptor>} Promise which emits first {@link Descriptor} object matching specified
   * UUID paths. Latest value of {@link Descriptor} will be stored inside returned object.
   * @private
   */
  async _readDescriptor(descriptorIdentifier, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeDescriptor = await this._callPromise(BleModule.readDescriptor(descriptorIdentifier, transactionId));
    return new Descriptor(nativeDescriptor, this);
  }

  /**
   * Write {@link Descriptor} value.
   *
   * @param {DeviceId} deviceIdentifier Connected device identifier
   * @param {UUID} serviceUUID Service UUID
   * @param {UUID} characteristicUUID Characteristic UUID
   * @param {UUID} descriptorUUID Descriptor UUID
   * @param {Base64} valueBase64 Value to be set coded in Base64
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation
   * @returns {Promise<Descriptor>} Descriptor which saved passed value
   */
  async writeDescriptorForDevice(deviceIdentifier, serviceUUID, characteristicUUID, descriptorUUID, valueBase64, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeDescriptor = await this._callPromise(BleModule.writeDescriptorForDevice(deviceIdentifier, serviceUUID, characteristicUUID, descriptorUUID, valueBase64, transactionId));
    return new Descriptor(nativeDescriptor, this);
  }

  /**
   * Write {@link Descriptor} value.
   *
   * @param {Identifier} serviceIdentifier Service identifier
   * @param {UUID} characteristicUUID Characteristic UUID
   * @param {UUID} descriptorUUID Descriptor UUID
   * @param {Base64} valueBase64 Value to be set coded in Base64
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation
   * @returns {Promise<Descriptor>} Descriptor which saved passed value
   * @private
   */
  async _writeDescriptorForService(serviceIdentifier, characteristicUUID, descriptorUUID, valueBase64, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeDescriptor = await this._callPromise(BleModule.writeDescriptorForService(serviceIdentifier, characteristicUUID, descriptorUUID, valueBase64, transactionId));
    return new Descriptor(nativeDescriptor, this);
  }

  /**
   * Write {@link Descriptor} value.
   *
   * @param {Identifier} characteristicIdentifier Characteristic identifier
   * @param {UUID} descriptorUUID Descriptor UUID
   * @param {Base64} valueBase64 Value to be set coded in Base64
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation
   * @returns {Promise<Descriptor>} Descriptor which saved passed value
   * @private
   */
  async _writeDescriptorForCharacteristic(characteristicIdentifier, descriptorUUID, valueBase64, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeDescriptor = await this._callPromise(BleModule.writeDescriptorForCharacteristic(characteristicIdentifier, descriptorUUID, valueBase64, transactionId));
    return new Descriptor(nativeDescriptor, this);
  }

  /**
   * Write {@link Descriptor} value.
   *
   * @param {Identifier} descriptorIdentifier Descriptor identifier
   * @param {Base64} valueBase64 Value to be set coded in Base64
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation
   * @returns {Promise<Descriptor>} Descriptor which saved passed value
   * @private
   */
  async _writeDescriptor(descriptorIdentifier, valueBase64, transactionId) {
    if (!transactionId) {
      transactionId = this._nextUniqueID();
    }
    const nativeDescriptor = await this._callPromise(BleModule.writeDescriptor(descriptorIdentifier, valueBase64, transactionId));
    return new Descriptor(nativeDescriptor, this);
  }
}
//# sourceMappingURL=BleManager.js.map