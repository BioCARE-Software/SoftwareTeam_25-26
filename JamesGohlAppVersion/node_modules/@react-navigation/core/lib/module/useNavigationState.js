"use strict";

import * as React from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { useNavigation } from "./useNavigation.js";
/**
 * Hook to get a value from the current navigation state using a selector.
 *
 * @param selector Selector function to get a value from the state.
 */
export function useNavigationState(selector) {
  const navigation = useNavigation();
  const subscribe = React.useCallback(callback => {
    const unsubscribe = navigation.addListener('state', callback);
    return unsubscribe;
  }, [navigation]);
  const value = useSyncExternalStoreWithSelector(subscribe, navigation.getState, navigation.getState, selector);
  return value;
}
//# sourceMappingURL=useNavigationState.js.map