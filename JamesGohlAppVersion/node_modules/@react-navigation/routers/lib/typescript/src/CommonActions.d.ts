import type { NavigationState, PartialState, Route } from './types';
type ResetState = PartialState<NavigationState> | NavigationState | (Omit<NavigationState, 'routes'> & {
    routes: Omit<Route<string>, 'key'>[];
});
type GoBackAction = {
    type: 'GO_BACK';
    source?: string;
    target?: string;
};
type NavigateAction = {
    type: 'NAVIGATE';
    payload: {
        name: string;
        params?: object;
        path?: string;
        merge?: boolean;
        pop?: boolean;
    };
    source?: string;
    target?: string;
};
type NavigateDeprecatedAction = {
    type: 'NAVIGATE_DEPRECATED';
    payload: {
        name: string;
        params?: object;
        merge?: boolean;
    };
    source?: string;
    target?: string;
};
type ResetAction = {
    type: 'RESET';
    payload: ResetState | undefined;
    source?: string;
    target?: string;
};
type SetParamsAction = {
    type: 'SET_PARAMS';
    payload: {
        params?: object;
    };
    source?: string;
    target?: string;
};
type ReplaceParamsAction = {
    type: 'REPLACE_PARAMS';
    payload: {
        params?: object;
    };
    source?: string;
    target?: string;
};
type PreloadAction = {
    type: 'PRELOAD';
    payload: {
        name: string;
        params?: object;
    };
    source?: string;
    target?: string;
};
export type Action = GoBackAction | NavigateAction | NavigateDeprecatedAction | ResetAction | SetParamsAction | ReplaceParamsAction | PreloadAction;
export declare function goBack(): Action;
export declare function navigate(name: string, params?: object, options?: {
    merge?: boolean;
    pop?: boolean;
}): Action;
export declare function navigate(options: {
    name: string;
    params?: object;
    path?: string;
    merge?: boolean;
    pop?: boolean;
}): Action;
export declare function navigateDeprecated(...args: [name: string] | [name: string, params: object | undefined] | [options: {
    name: string;
    params?: object;
}]): Action;
export declare function reset(state: ResetState | undefined): Action;
export declare function setParams(params: object): Action;
export declare function replaceParams(params: object): Action;
export declare function preload(name: string, params?: object): Action;
export {};
//# sourceMappingURL=CommonActions.d.ts.map