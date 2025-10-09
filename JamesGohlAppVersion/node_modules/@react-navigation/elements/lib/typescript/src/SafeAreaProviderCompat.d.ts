import * as React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type Metrics } from 'react-native-safe-area-context';
type Props = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};
export declare function SafeAreaProviderCompat({ children, style }: Props): import("react/jsx-runtime").JSX.Element;
export declare namespace SafeAreaProviderCompat {
    var initialMetrics: Metrics;
}
export {};
//# sourceMappingURL=SafeAreaProviderCompat.d.ts.map