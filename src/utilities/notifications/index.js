import PushNotification from 'react-native-push-notification';

export const fireBeginSessionNotification = (lockId) => {
  const notificationData = {
    id: 1,
    title: 'Session Started',
    message: `Please remember to lock your desk when you leave. Desk ${lockId} is now unlocked!`,
  };
  PushNotification.localNotification(notificationData);
};

export const fireEndSessionNotification = (lockId, weeklyPassId, membershipId, price) => {
  const notificationData = {
    id: 2,
    title: 'Session Ended',
    message:
      weeklyPassId === null && membershipId === null
        ? `Desk ${lockId} is now locked! Your total is $${price / 100}. Tap here to see details.`
        : `Desk ${lockId} is now locked! Tap here to see details.`,
  };
  PushNotification.localNotification(notificationData);
};

export const fireFirebaseCloudMessage = (message) => {
  const notificationData = {
    id: 3,
    title: message.notification.title,
    message: message.notification.body,
  };
  PushNotification.localNotification(notificationData);
};
