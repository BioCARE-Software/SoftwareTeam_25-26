"use strict";

import * as React from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { initialWindowMetrics, SafeAreaFrameContext, SafeAreaInsetsContext, SafeAreaProvider } from 'react-native-safe-area-context';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const {
  width = 0,
  height = 0
} = Dimensions.get('window');

// To support SSR on web, we need to have empty insets for initial values
// Otherwise there can be mismatch between SSR and client output
// We also need to specify empty values to support tests environments
const initialMetrics = Platform.OS === 'web' || initialWindowMetrics == null ? {
  frame: {
    x: 0,
    y: 0,
    width,
    height
  },
  insets: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
} : initialWindowMetrics;
export function SafeAreaProviderCompat({
  children,
  style
}) {
  const insets = React.useContext(SafeAreaInsetsContext);
  if (insets) {
    // If we already have insets, don't wrap the stack in another safe area provider
    // This avoids an issue with updates at the cost of potentially incorrect values
    // https://github.com/react-navigation/react-navigation/issues/174
    return /*#__PURE__*/_jsx(View, {
      style: [styles.container, style],
      children: children
    });
  }
  if (Platform.OS === 'web') {
    children = /*#__PURE__*/_jsx(SafeAreaFrameProvider, {
      initialMetrics: initialMetrics,
      children: children
    });
  }
  return /*#__PURE__*/_jsx(SafeAreaProvider, {
    initialMetrics: initialMetrics,
    style: style,
    children: children
  });
}

// FIXME: On the Web, the safe area frame value doesn't update on resize
// So we workaround this by measuring the frame on resize
const SafeAreaFrameProvider = ({
  initialMetrics,
  children
}) => {
  const element = React.useRef(null);
  const [frame, setFrame] = React.useState(initialMetrics.frame);
  React.useEffect(() => {
    if (element.current == null) {
      return;
    }
    const rect = element.current.getBoundingClientRect();

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setFrame({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    });
    let timeout;
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const {
          x,
          y,
          width,
          height
        } = entry.contentRect;

        // Debounce the frame updates to avoid too many updates in a short time
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setFrame({
            x,
            y,
            width,
            height
          });
        }, 100);
      }
    });
    observer.observe(element.current);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);
  return /*#__PURE__*/_jsxs(SafeAreaFrameContext.Provider, {
    value: frame,
    children: [/*#__PURE__*/_jsx("div", {
      ref: element,
      style: {
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'none',
        visibility: 'hidden'
      }
    }), children]
  });
};
SafeAreaProviderCompat.initialMetrics = initialMetrics;
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=SafeAreaProviderCompat.js.map