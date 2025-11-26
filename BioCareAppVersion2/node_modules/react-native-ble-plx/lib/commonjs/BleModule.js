'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventEmitter = exports.BleModule = void 0;
var _reactNative = require("react-native");
var _TypeDefinition = require("./TypeDefinition");
/**
 * Native device object passed from BleModule.
 * @private
 */

/**
 * Native service object passed from BleModule.
 * @private
 */

/**
 * Native characteristic object passed from BleModule.
 * @private
 */

/**
 * Native descriptor object passed from BleModule.
 * @private
 */

/**
 * Object representing information about restored BLE state after application relaunch.
 * @private
 */

/**
 * Native BLE Module interface
 * @private
 */

/**
 * Native module provider
 *
 * @private
 */
const BleModule = exports.BleModule = _reactNative.NativeModules.BlePlx;
const EventEmitter = exports.EventEmitter = _reactNative.NativeEventEmitter;
//# sourceMappingURL=BleModule.js.map