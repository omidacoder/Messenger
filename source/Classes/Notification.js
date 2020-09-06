import PushNotification from "react-native-push-notification";

export default Notify = (smallText , largeText) => {
    console.log('before');
    PushNotification.localNotification({
        /* Android Only Properties */
        id: '0',
        autoCancel: true,
        largeIcon: "ic_launcher",
        smallIcon:"ic_notification",
        bigText:largeText,
        vibrate: true,
        vibration: 300,
        tag: 'some_tag',
        group: "group",
        ongoing: false,
        priority: "low",
        visibility: "private",
        importance: "low",
        title:smallText,
        message : 'my message',
        playSound: true,
        soundName: 'default',
    });
    console.log('after');
}
