"use strict";

import { useEffect, useLayoutEffect } from 'react';

/**
 * Use `useEffect` during SSR and `useLayoutEffect` in the browser to avoid warnings.
 */
export const useIsomorphicLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect;
//# sourceMappingURL=useIsomorphicLayoutEffect.js.map