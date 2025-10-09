'use strict';

/**
 * Descriptor object.
 */
export class Descriptor {
  /**
   * Internal BLE Manager handle
   * @private
   */

  /**
   * Descriptor unique identifier
   */

  /**
   * Descriptor UUID
   */

  /**
   * Characteristic's ID to which descriptor belongs
   */

  /**
   * Characteristic's UUID to which descriptor belongs
   */

  /**
   * Service's ID to which descriptor belongs
   */

  /**
   * Service's UUID to which descriptor belongs
   */

  /**
   * Device's ID to which descriptor belongs
   */

  /**
   * Descriptor value if present
   */

  /**
   * Private constructor used to create instance of {@link Descriptor}.
   * @param {NativeDescriptor} nativeDescriptor NativeDescriptor
   * @param {BleManager} manager BleManager
   * @private
   */
  constructor(nativeDescriptor, manager) {
    Object.assign(this, nativeDescriptor);
    Object.defineProperty(this, '_manager', {
      value: manager,
      enumerable: false
    });
  }

  /**
   * {@link #blemanagerreaddescriptorfordevice|bleManager.readDescriptorForDevice()} with partially filled arguments.
   *
   * @param {?TransactionId} transactionId optional `transactionId` which can be used in
   * {@link #blemanagercanceltransaction|cancelTransaction()} function.
   * @returns {Promise<Descriptor>} Promise which emits first {@link Descriptor} object matching specified
   * UUID paths. Latest value of {@link Descriptor} will be stored inside returned object.
   */
  async read(transactionId) {
    return this._manager._readDescriptor(this.id, transactionId);
  }

  /**
   * {@link #blemanagerwritedescriptorfordevice|bleManager.writeDescriptorForDevice()} with partially filled arguments.
   *
   * @param {Base64} valueBase64 Value to be set coded in Base64
   * @param {?TransactionId} transactionId Transaction handle used to cancel operation
   * @returns {Promise<Descriptor>} Descriptor which saved passed value.
   */
  async write(valueBase64, transactionId) {
    return this._manager._writeDescriptor(this.id, valueBase64, transactionId);
  }
}
//# sourceMappingURL=Descriptor.js.map