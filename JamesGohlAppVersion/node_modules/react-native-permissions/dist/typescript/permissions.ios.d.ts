import type { AndroidPermissionMap } from './permissions.android';
import type { WindowsPermissionMap } from './permissions.windows';
declare const IOS: Readonly<{
    readonly APP_TRACKING_TRANSPARENCY: "ios.permission.APP_TRACKING_TRANSPARENCY";
    readonly BLUETOOTH: "ios.permission.BLUETOOTH";
    readonly CALENDARS: "ios.permission.CALENDARS";
    readonly CALENDARS_WRITE_ONLY: "ios.permission.CALENDARS_WRITE_ONLY";
    readonly CAMERA: "ios.permission.CAMERA";
    readonly CONTACTS: "ios.permission.CONTACTS";
    readonly FACE_ID: "ios.permission.FACE_ID";
    readonly LOCATION_ALWAYS: "ios.permission.LOCATION_ALWAYS";
    readonly LOCATION_WHEN_IN_USE: "ios.permission.LOCATION_WHEN_IN_USE";
    readonly MEDIA_LIBRARY: "ios.permission.MEDIA_LIBRARY";
    readonly MICROPHONE: "ios.permission.MICROPHONE";
    readonly MOTION: "ios.permission.MOTION";
    readonly PHOTO_LIBRARY: "ios.permission.PHOTO_LIBRARY";
    readonly PHOTO_LIBRARY_ADD_ONLY: "ios.permission.PHOTO_LIBRARY_ADD_ONLY";
    readonly REMINDERS: "ios.permission.REMINDERS";
    readonly SIRI: "ios.permission.SIRI";
    readonly SPEECH_RECOGNITION: "ios.permission.SPEECH_RECOGNITION";
    readonly STOREKIT: "ios.permission.STOREKIT";
}>;
export type IOSPermissionMap = typeof IOS;
export declare const PERMISSIONS: Readonly<{
    readonly ANDROID: AndroidPermissionMap;
    readonly IOS: Readonly<{
        readonly APP_TRACKING_TRANSPARENCY: "ios.permission.APP_TRACKING_TRANSPARENCY";
        readonly BLUETOOTH: "ios.permission.BLUETOOTH";
        readonly CALENDARS: "ios.permission.CALENDARS";
        readonly CALENDARS_WRITE_ONLY: "ios.permission.CALENDARS_WRITE_ONLY";
        readonly CAMERA: "ios.permission.CAMERA";
        readonly CONTACTS: "ios.permission.CONTACTS";
        readonly FACE_ID: "ios.permission.FACE_ID";
        readonly LOCATION_ALWAYS: "ios.permission.LOCATION_ALWAYS";
        readonly LOCATION_WHEN_IN_USE: "ios.permission.LOCATION_WHEN_IN_USE";
        readonly MEDIA_LIBRARY: "ios.permission.MEDIA_LIBRARY";
        readonly MICROPHONE: "ios.permission.MICROPHONE";
        readonly MOTION: "ios.permission.MOTION";
        readonly PHOTO_LIBRARY: "ios.permission.PHOTO_LIBRARY";
        readonly PHOTO_LIBRARY_ADD_ONLY: "ios.permission.PHOTO_LIBRARY_ADD_ONLY";
        readonly REMINDERS: "ios.permission.REMINDERS";
        readonly SIRI: "ios.permission.SIRI";
        readonly SPEECH_RECOGNITION: "ios.permission.SPEECH_RECOGNITION";
        readonly STOREKIT: "ios.permission.STOREKIT";
    }>;
    readonly WINDOWS: WindowsPermissionMap;
}>;
export {};
//# sourceMappingURL=permissions.ios.d.ts.map