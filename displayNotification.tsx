import notifee from '@notifee/react-native';

export async function displayNotification({
  title = 'hello',
  body = 'hello',
  sound = 'default',
  color = '#4caf50',
  timeout = 5000,
}) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    vibration: true, // Vibration settings
    sound: sound, // Custom notification sound
  });

  // Display the notification
  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      smallIcon: 'ic_stat_name', // Notification icon (local resource for Android)
      color: color, // Notification icon background color
      pressAction: {
        id: 'default',
      },
      autoCancel: true, // Automatically dismiss when pressed
      timeoutAfter: timeout, // Automatically dismiss after timeout
      sound: sound, // Custom sound usage
      badgeCount: 1, // Badge count on the app icon
    },
  });
}








-------------------------------------------------------------------------------------------------


import React from 'react';
import { View, Button } from 'react-native';
import { displayNotification } from './displayNotification';

const NotificationButton = () => {
  const handlePress = async () => {
    await displayNotification({
      title: 'Notification Title',
      body: 'This is the notification body.',
      sound: 'default', // or specify a custom sound
      color: '#4caf50',
      timeout: 5000,
    });
  };

  return (
    <View>
      <Button title="Show Notification" onPress={handlePress} />
    </View>
  );
};

export default NotificationButton;


