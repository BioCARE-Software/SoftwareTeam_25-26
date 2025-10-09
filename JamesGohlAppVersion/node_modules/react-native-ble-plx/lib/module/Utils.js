'use strict';

import { Platform } from 'react-native';
/**
 * Converts UUID to full 128bit, lowercase format which should be used to compare UUID values.
 *
 * @param {UUID} uuid 16bit, 32bit or 128bit UUID.
 * @returns {UUID} 128bit lowercase UUID.
 */
export function fullUUID(uuid) {
  if (uuid.length === 4) {
    return '0000' + uuid.toLowerCase() + '-0000-1000-8000-00805f9b34fb';
  }
  if (uuid.length === 8) {
    return uuid.toLowerCase() + '-0000-1000-8000-00805f9b34fb';
  }
  return uuid.toLowerCase();
}
export function fillStringWithArguments(value, object) {
  return value.replace(/\{([^}]+)\}/g, function (_, arg) {
    return object[arg] || '?';
  });
}
export const isIOS = Platform.OS === 'ios';
//# sourceMappingURL=Utils.js.map