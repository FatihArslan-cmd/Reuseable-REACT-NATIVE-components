import { NativeModules } from 'react-native';

const { PushNotificationModule } = NativeModules;

export const sendNotification = (title, message) => {
    return PushNotificationModule.sendNotification(title, message);
};
import { PermissionsAndroid, Platform } from 'react-native';

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // Assume permission granted for other platforms
};
