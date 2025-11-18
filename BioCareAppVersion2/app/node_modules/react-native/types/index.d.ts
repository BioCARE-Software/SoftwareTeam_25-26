/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

// Definitions by: Eloy Durán <https://github.com/alloy>
//                 HuHuanming <https://github.com/huhuanming>
//                 Kyle Roach <https://github.com/iRoachie>
//                 Tim Wang <https://github.com/timwangdev>
//                 Kamal Mahyuddin <https://github.com/kamal>
//                 Alex Dunne <https://github.com/alexdunne>
//                 Manuel Alabor <https://github.com/swissmanu>
//                 Michele Bombardi <https://github.com/bm-software>
//                 Martin van Dam <https://github.com/mvdam>
//                 Kacper Wiszczuk <https://github.com/esemesek>
//                 Ryan Nickel <https://github.com/mrnickel>
//                 Souvik Ghosh <https://github.com/souvik-ghosh>
//                 Cheng Gibson <https://github.com/nossbigg>
//                 Saransh Kataria <https://github.com/saranshkataria>
//                 Wojciech Tyczynski <https://github.com/tykus160>
//                 Jake Bloom <https://github.com/jakebloom>
//                 Ceyhun Ozugur <https://github.com/ceyhun>
//                 Mike Martin <https://github.com/mcmar>
//                 Theo Henry de Villeneuve <https://github.com/theohdv>
//                 Romain Faust <https://github.com/romain-faust>
//                 Be Birchall <https://github.com/bebebebebe>
//                 Jesse Katsumata <https://github.com/Naturalclar>
//                 Xianming Zhong <https://github.com/chinesedfan>
//                 Valentyn Tolochko <https://github.com/vtolochk>
//                 Sergey Sychev <https://github.com/SychevSP>
//                 Kelvin Chu <https://github.com/RageBill>
//                 Daiki Ihara <https://github.com/sasurau4>
//                 Abe Dolinger <https://github.com/256hz>
//                 Dominique Richard <https://github.com/doumart>
//                 Mohamed Shaban <https://github.com/drmas>
//                 Jérémy Barbet <https://github.com/jeremybarbet>
//                 David Sheldrick <https://github.com/ds300>
//                 Natsathorn Yuthakovit <https://github.com/natsathorn>
//                 ConnectDotz <https://github.com/connectdotz>
//                 Alexey Molchan <https://github.com/alexeymolchan>
//                 Alex Brazier <https://github.com/alexbrazier>
//                 Arafat Zahan <https://github.com/kuasha420>
//                 Pedro Hernández <https://github.com/phvillegas>
//                 Sebastian Silbermann <https://github.com/eps1lon>
//                 Zihan Chen <https://github.com/ZihanChen-MSFT>
//                 Lorenzo Sciandra <https://github.com/kelset>
//                 Mateusz Wit <https://github.com/MateWW>
//                 Saad Najmi <https://github.com/saadnajmi>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Minimum TypeScript Version: 4.8

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// USING: these definitions are meant to be used with the TSC compiler target set to at least ES2015.
//
// USAGE EXAMPLES: check the RNTSExplorer project at https://github.com/bgrieder/RNTSExplorer
//
// CONTRIBUTING: please open pull requests
//
// CREDITS: This work is based on an original work made by Bernd Paradies: https://github.com/bparadie
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// <reference path="modules/BatchedBridge.d.ts" />
/// <reference path="modules/Codegen.d.ts" />
/// <reference path="modules/Devtools.d.ts" />
/// <reference path="modules/globals.d.ts" />
/// <reference path="modules/LaunchScreen.d.ts" />

export * from 'react-native/Libraries/ActionSheetIOS/ActionSheetIOS';
export * from 'react-native/Libraries/Alert/Alert';
export * from 'react-native/Libraries/Animated/Animated';
export * from 'react-native/Libraries/Animated/Easing';
export * from 'react-native/Libraries/Animated/useAnimatedValue';
export * from 'react-native/Libraries/AppState/AppState';
export * from 'react-native/Libraries/BatchedBridge/NativeModules';
export * from 'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo';
export * from 'react-native/Libraries/Components/ActivityIndicator/ActivityIndicator';
export * from 'react-native/Libraries/Components/Clipboard/Clipboard';
export * from 'react-native/Libraries/Components/DrawerAndroid/DrawerLayoutAndroid';
export * from 'react-native/Libraries/Components/Keyboard/Keyboard';
export * from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
export * from 'react-native/Libraries/Components/Pressable/Pressable';
export * from 'react-native/Libraries/Components/ProgressBarAndroid/ProgressBarAndroid';
export * from 'react-native/Libraries/Components/RefreshControl/RefreshControl';
export * from 'react-native/Libraries/Components/SafeAreaView/SafeAreaView';
export * from 'react-native/Libraries/Components/ScrollView/ScrollView';
export * from 'react-native/Libraries/Components/StatusBar/StatusBar';
export * from 'react-native/Libraries/Components/Switch/Switch';
export * from 'react-native/Libraries/Components/TextInput/InputAccessoryView';
export * from 'react-native/Libraries/Components/TextInput/TextInput';
export * from 'react-native/Libraries/Components/ToastAndroid/ToastAndroid';
export * from 'react-native/Libraries/Components/Touchable/Touchable';
export * from 'react-native/Libraries/Components/Touchable/TouchableHighlight';
export * from 'react-native/Libraries/Components/Touchable/TouchableNativeFeedback';
export * from 'react-native/Libraries/Components/Touchable/TouchableOpacity';
export * from 'react-native/Libraries/Components/Touchable/TouchableWithoutFeedback';
export * from 'react-native/Libraries/Components/View/View';
export * from 'react-native/Libraries/Components/View/ViewAccessibility';
export * from 'react-native/Libraries/Components/View/ViewPropTypes';
export * from 'react-native/Libraries/Components/Button';
export * from 'react-native/Libraries/Core/registerCallableModule';
export * from 'react-native/Libraries/DevToolsSettings/DevToolsSettingsManager';
export * from 'react-native/Libraries/EventEmitter/NativeEventEmitter';
export * from 'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter';
export * from 'react-native/Libraries/EventEmitter/RCTNativeAppEventEmitter';
export * from 'react-native/Libraries/Image/Image';
export * from 'react-native/Libraries/Image/ImageResizeMode';
export * from 'react-native/Libraries/Image/ImageSource';
export * from 'react-native/Libraries/Interaction/InteractionManager';
export * from 'react-native/Libraries/Interaction/PanResponder';
export * from 'react-native/Libraries/LayoutAnimation/LayoutAnimation';
export * from 'react-native/Libraries/Linking/Linking';
export * from 'react-native/Libraries/Lists/FlatList';
export * from 'react-native/Libraries/Lists/SectionList';
export * from '@react-native/virtualized-lists';
export * from 'react-native/Libraries/LogBox/LogBox';
export * from 'react-native/Libraries/Modal/Modal';
export * as Systrace from 'react-native/Libraries/Performance/Systrace';
export * from 'react-native/Libraries/PermissionsAndroid/PermissionsAndroid';
export * from 'react-native/Libraries/PushNotificationIOS/PushNotificationIOS';
export * from 'react-native/Libraries/ReactNative/AppRegistry';
export * from 'react-native/Libraries/ReactNative/I18nManager';
export * from 'react-native/Libraries/ReactNative/RendererProxy';
export * from 'react-native/Libraries/ReactNative/RootTag';
export * from 'react-native/Libraries/ReactNative/UIManager';
export * from 'react-native/Libraries/ReactNative/requireNativeComponent';
export * from 'react-native/Libraries/Settings/Settings';
export * from 'react-native/Libraries/Share/Share';
export * from 'react-native/Libraries/StyleSheet/PlatformColorValueTypesIOS';
export * from 'react-native/Libraries/StyleSheet/PlatformColorValueTypes';
export * from 'react-native/Libraries/StyleSheet/StyleSheet';
export * from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
export * from 'react-native/Libraries/StyleSheet/processColor';
export * from 'react-native/Libraries/Text/Text';
export * from 'react-native/Libraries/TurboModule/RCTExport';
export * as TurboModuleRegistry from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
export * from 'react-native/Libraries/Types/CoreEventTypes';
export * from 'react-native/Libraries/Utilities/Appearance';
export * from 'react-native/Libraries/Utilities/BackHandler';
export * from 'react-native/Libraries/Utilities/DevSettings';
export * from 'react-native/Libraries/Utilities/Dimensions';
export * from 'react-native/Libraries/Utilities/PixelRatio';
export * from 'react-native/Libraries/Utilities/Platform';
export * from 'react-native/Libraries/Vibration/Vibration';
export * from 'react-native/Libraries/YellowBox/YellowBoxDeprecated';
export * from 'react-native/Libraries/vendor/core/ErrorUtils';
export {
  EmitterSubscription,
  EventSubscription,
} from 'react-native/Libraries/vendor/emitter/EventEmitter';

export * from 'react-native/types/public/DeprecatedPropertiesAlias';
export * from 'react-native/types/public/Insets';
export * from 'react-native/types/public/ReactNativeRenderer';
export * from 'react-native/types/public/ReactNativeTypes';

import type {ErrorUtils} from 'react-native/Libraries/vendor/core/ErrorUtils';

declare global {
  interface NodeRequire {
    (id: string): any;
  }

  var require: NodeRequire;

  /**
   * Console polyfill
   * @see https://reactnative.dev/docs/javascript-environment#polyfills
   */
  interface Console {
    error(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    trace(message?: any, ...optionalParams: any[]): void;
    debug(message?: any, ...optionalParams: any[]): void;
    table(...data: any[]): void;
    groupCollapsed(label?: string): void;
    groupEnd(): void;
    group(label?: string): void;
    /**
     * @deprecated Use LogBox.ignoreLogs(patterns) instead
     */
    ignoredYellowBox: string[];
  }

  var console: Console;

  /**
   * This contains the non-native `XMLHttpRequest` object, which you can use if you want to route network requests
   * through DevTools (to trace them):
   *
   *   global.XMLHttpRequest = global.originalXMLHttpRequest;
   *
   * @see https://github.com/facebook/react-native/issues/934
   */
  const originalXMLHttpRequest: any;

  const __BUNDLE_START_TIME__: number;
  const ErrorUtils: ErrorUtils;

  /**
   * This variable is set to true when react-native is running in Dev mode
   * @example
   * if (__DEV__) console.log('Running in dev mode')
   */
  const __DEV__: boolean;

  const HermesInternal: null | {};
}
