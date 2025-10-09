'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Device = void 0;
var _TypeDefinition = require("./TypeDefinition");
var _Utils = require("./Utils");
/**
 * Device instance which can be retrieved only by calling
 * {@link #blemanagerstartdevicescan|bleManager.startDeviceScan()}.
 */
class Device {
  /**
   * Internal BLE Manager handle
   * @private
   */

  /**
   * Device identifier: MAC address on Android and UUID on iOS.
   */

  /**
   * Device name if present
   */

  /**
   * Current Received Signal Strength Indication of device
   */

  /**
   * Current Maximum Transmission Unit for this device. When device is not connected
   * default value of 23 is used.
   */

  // Advertisement

  /**
   * Device's custom manufacturer data. Its format is defined by manufacturer.
   */

  /**
   * Raw device scan data. When you have specific advertiser data,
   * you can implement your own processing.
   */

  /**
   * Map of service UUIDs (as keys) with associated data (as values).
   */

  /**
   * List of available services visible during scanning.
   */

  /**
   * User friendly name of device.
   */

  /**
   * Transmission power level of device.
   */

  /**
   * List of solicited service UUIDs.
   */

  /**
   * Is device connectable. [iOS only]
   */

  /**
   * List of overflow service UUIDs. [iOS only]
   */

  /**
   * Private constructor used to create {@link Device} object.
   *
   * @param {NativeDevice} nativeDevice Native device properties
   * @param {BleManager} manager {@link BleManager} handle
   * @private
   */
  constructor(nativeDevice, manager) {
    Object.assign(this, nativeDevice);
    Object.defineProperty(this, '_manager', {
      value: manager,
      enumerable: false
    });
  }

  /**
   * {@link #blemanagerrequestconnectionpriorityfordevice|bleManager.requestConnectionPriorityForDevice()} with partially filled arguments.
   *
   * @param {ConnectionPriority} connectionPriority: Connection priority.
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation.
   * @returns {Promise<Device>} Connected device.
   */
  requestConnectionPriority(connectionPriority, transactionId) {
    return this._manager.requestConnectionPriorityForDevice(this.id, connectionPriority, transactionId);
  }

  /**
   * {@link #blemanagerreadrssifordevice|bleManager.readRSSIForDevice()} with partially filled arguments.
   *
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation.
   * @returns {Promise<Device>} This device with updated RSSI value.
   */
  readRSSI(transactionId) {
    return this._manager.readRSSIForDevice(this.id, transactionId);
  }

  /**
   * {@link #blemanagerrequestmtufordevice|bleManager.requestMTUForDevice()} with partially filled arguments.
   *
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation.
   * @returns {Promise<Device>} Device with updated MTU size. Default value is 23.
   */
  requestMTU(mtu, transactionId) {
    return this._manager.requestMTUForDevice(this.id, mtu, transactionId);
  }

  /**
   * {@link #blemanagerconnecttodevice|bleManager.connectToDevice()} with partially filled arguments.
   *
   * @param {?ConnectionOptions} options Platform specific options for connection establishment. Not used currently.
   * @returns {Promise<Device>} Connected {@link Device} object if successful.
   */
  connect(options) {
    return this._manager.connectToDevice(this.id, options);
  }

  /**
   * {@link #blemanagercanceldeviceconnection|bleManager.cancelDeviceConnection()} with partially filled arguments.
   *
   * @returns {Promise<Device>} Returns closed {@link Device} when operation is successful.
   */
  cancelConnection() {
    return this._manager.cancelDeviceConnection(this.id);
  }

  /**
   * {@link #blemanagerisdeviceconnected|bleManager.isDeviceConnected()} with partially filled arguments.
   *
   * @returns {Promise<boolean>} Promise which emits `true` if device is connected, and `false` otherwise.
   */
  isConnected() {
    return this._manager.isDeviceConnected(this.id);
  }

  /**
   * {@link #blemanagerondevicedisconnected|bleManager.onDeviceDisconnected()} with partially filled arguments.
   *
   * @param {function(error: ?BleError, device: Device)} listener callback returning error as a reason of disconnection
   * if available and {@link Device} object. If an error is null, that means the connection was terminated by
   * {@link #blemanagercanceldeviceconnection|bleManager.cancelDeviceConnection()} call.
   * @returns {Subscription} Subscription on which `remove()` function can be called to unsubscribe.
   */
  onDisconnected(listener) {
    return this._manager.onDeviceDisconnected(this.id, listener);
  }

  /**
   * {@link #blemanagerdiscoverallservicesandcharacteristicsfordevice|bleManager.discoverAllServicesAndCharacteristicsForDevice()} with partially filled arguments.
   *
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation
   * @returns {Promise<Device>} Promise which emits {@link Device} object if all available services and
   * characteristics have been discovered.
   */
  discoverAllServicesAndCharacteristics(transactionId) {
    return this._manager.discoverAllServicesAndCharacteristicsForDevice(this.id, transactionId);
  }

  /**
   * {@link #blemanagerservicesfordevice|bleManager.servicesForDevice()} with partially filled arguments.
   *
   * @returns {Promise<Service[]>} Promise which emits array of {@link Service} objects which are discovered by this
   * device.
   */
  services() {
    return this._manager.servicesForDevice(this.id);
  }

  /**
   * {@link #blemanagercharacteristicsfordevice|bleManager.characteristicsForDevice()} with partially filled arguments.
   *
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @returns {Promise<Characteristic[]>} Promise which emits array of {@link Characteristic} objects which are
   * discovered for a {@link Device} in specified {@link Service}.
   */
  characteristicsForService(serviceUUID) {
    return this._manager.characteristicsForDevice(this.id, serviceUUID);
  }

  /**
   * {@link #blemanagerdescriptorsfordevice|bleManager.descriptorsForDevice()} with partially filled arguments.
   *
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @returns {Promise<Array<Descriptor>>} Promise which emits array of {@link Descriptor} objects which are
   * discovered for this {@link Characteristic}.
   */
  descriptorsForService(serviceUUID, characteristicUUID) {
    return this._manager.descriptorsForDevice(this.id, serviceUUID, characteristicUUID);
  }

  /**
   * {@link #blemanagerreadcharacteristicfordevice|bleManager.readCharacteristicForDevice()} with partially filled arguments.
   *
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|bleManager.cancelTransaction()} function.
   * @returns {Promise<Characteristic>} Promise which emits first {@link Characteristic} object matching specified
   * UUID paths. Latest value of {@link Characteristic} will be stored inside returned object.
   */
  readCharacteristicForService(serviceUUID, characteristicUUID, transactionId) {
    return this._manager.readCharacteristicForDevice(this.id, serviceUUID, characteristicUUID, transactionId);
  }

  /**
   * {@link #blemanagerwritecharacteristicwithresponsefordevice|bleManager.writeCharacteristicWithResponseForDevice()} with partially filled arguments.
   *
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {Base64} valueBase64 Value in Base64 format.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|bleManager.cancelTransaction()} function.
   * @returns {Promise<Characteristic>} Promise which emits first {@link Characteristic} object matching specified
   * UUID paths. Latest value of characteristic may not be stored inside returned object.
   */
  writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, valueBase64, transactionId) {
    return this._manager.writeCharacteristicWithResponseForDevice(this.id, serviceUUID, characteristicUUID, valueBase64, transactionId);
  }

  /**
   * {@link #blemanagerwritecharacteristicwithoutresponsefordevice|bleManager.writeCharacteristicWithoutResponseForDevice()} with partially filled arguments.
   *
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {Base64} valueBase64 Value in Base64 format.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|bleManager.cancelTransaction()} function.
   * @returns {Promise<Characteristic>} Promise which emits first {@link Characteristic} object matching specified
   * UUID paths. Latest value of characteristic may not be stored inside returned object.
   */
  writeCharacteristicWithoutResponseForService(serviceUUID, characteristicUUID, valueBase64, transactionId) {
    return this._manager.writeCharacteristicWithoutResponseForDevice(this.id, serviceUUID, characteristicUUID, valueBase64, transactionId);
  }

  /**
   * {@link #blemanagermonitorcharacteristicfordevice|bleManager.monitorCharacteristicForDevice()} with partially filled arguments.
   *
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {function(error: ?BleError, characteristic: ?Characteristic)} listener - callback which emits
   * {@link Characteristic} objects with modified value for each notification.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * @param {?CharacteristicSubscriptionType} subscriptionType [android only] subscription type of the characteristic
   * {@link #blemanagercanceltransaction|bleManager.cancelTransaction()} function.
   * @returns {Subscription} Subscription on which `remove()` function can be called to unsubscribe.
   */
  monitorCharacteristicForService(serviceUUID, characteristicUUID, listener, transactionId, subscriptionType) {
    const commonArgs = [this.id, serviceUUID, characteristicUUID, listener, transactionId];
    const args = _Utils.isIOS ? commonArgs : [...commonArgs, subscriptionType];
    return this._manager.monitorCharacteristicForDevice(...args);
  }

  /**
   * {@link #blemanagerreaddescriptorfordevice|bleManager.readDescriptorForDevice()} with partially filled arguments.
   *
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID {@link Characteristic} UUID.
   * @param {UUID} descriptorUUID {@link Descriptor} UUID.
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Descriptor>} Promise which emits first {@link Descriptor} object matching specified
   * UUID paths. Latest value of {@link Descriptor} will be stored inside returned object.
   */
  async readDescriptorForService(serviceUUID, characteristicUUID, descriptorUUID, transactionId) {
    return this._manager.readDescriptorForDevice(this.id, serviceUUID, characteristicUUID, descriptorUUID, transactionId);
  }

  /**
   * {@link #blemanagerwritedescriptorfordevice|bleManager.writeDescriptorForDevice()} with partially filled arguments.
   *
   * @param {UUID} serviceUUID {@link Service} UUID.
   * @param {UUID} characteristicUUID Characteristic UUID
   * @param {UUID} descriptorUUID Descriptor UUID
   * @param {Base64} valueBase64 Value to be set coded in Base64
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation
   * @returns {Promise<Descriptor>} Descriptor which saved passed value.
   */
  async writeDescriptorForService(serviceUUID, characteristicUUID, descriptorUUID, valueBase64, transactionId) {
    return this._manager.writeDescriptorForDevice(this.id, serviceUUID, characteristicUUID, descriptorUUID, valueBase64, transactionId);
  }
}
exports.Device = Device;
//# sourceMappingURL=Device.js.map