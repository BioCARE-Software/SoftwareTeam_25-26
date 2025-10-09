"use strict";

import { NavigationContext, NavigationRouteContext } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Background } from "./Background.js";
import { getDefaultHeaderHeight } from "./Header/getDefaultHeaderHeight.js";
import { HeaderHeightContext } from "./Header/HeaderHeightContext.js";
import { HeaderShownContext } from "./Header/HeaderShownContext.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Screen(props) {
  const dimensions = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const parentHeaderHeight = React.useContext(HeaderHeightContext);
  const {
    focused,
    modal = false,
    header,
    headerShown = true,
    headerTransparent,
    headerStatusBarHeight = isParentHeaderShown ? 0 : insets.top,
    navigation,
    route,
    children,
    style
  } = props;
  const [headerHeight, setHeaderHeight] = React.useState(() => getDefaultHeaderHeight(dimensions, modal, headerStatusBarHeight));
  return /*#__PURE__*/_jsxs(Background, {
    "aria-hidden": !focused,
    style: [styles.container, style]
    // On Fabric we need to disable collapsing for the background to ensure
    // that we won't render unnecessary views due to the view flattening.
    ,
    collapsable: false,
    children: [headerShown ? /*#__PURE__*/_jsx(NavigationContext.Provider, {
      value: navigation,
      children: /*#__PURE__*/_jsx(NavigationRouteContext.Provider, {
        value: route,
        children: /*#__PURE__*/_jsx(View, {
          pointerEvents: "box-none",
          onLayout: e => {
            const {
              height
            } = e.nativeEvent.layout;
            setHeaderHeight(height);
          },
          style: [styles.header, headerTransparent ? styles.absolute : null],
          children: header
        })
      })
    }) : null, /*#__PURE__*/_jsx(View, {
      style: styles.content,
      children: /*#__PURE__*/_jsx(HeaderShownContext.Provider, {
        value: isParentHeaderShown || headerShown !== false,
        children: /*#__PURE__*/_jsx(HeaderHeightContext.Provider, {
          value: headerShown ? headerHeight : parentHeaderHeight ?? 0,
          children: children
        })
      })
    })]
  });
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1
  },
  header: {
    zIndex: 1
  },
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0
  }
});
//# sourceMappingURL=Screen.js.map