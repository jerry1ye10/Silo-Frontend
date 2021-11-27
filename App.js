// See React Navigation v5
import 'react-native-gesture-handler';
import * as React from 'react';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import stripe from 'tipsi-stripe';
import codePush from 'react-native-code-push';

// React navigation v5 imports
import AuthStack from './src/navigation/auth-stack';
import LoadingScreen from './src/screens/loading-screen';

// Notification imports
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

// Branch imports
import branch from 'react-native-branch';

// Facebook imports
import { Settings } from 'react-native-fbsdk-next';

import { store, persistor } from './src/redux/store';
import { navigationRef, navigate } from './src/utilities/navigation-service';
import { fireFirebaseCloudMessage } from './src/utilities/notifications';
import { STRIPE_PUBLISHABLE_KEY } from './src/utilities/config';

Settings.initializeSDK();

PushNotification.configure({
  onNotification: (notification) => {
    const id = notification.id;
    if (id === '2') {
      navigate('ScanScreen');
      navigate('HistoryScreen');
    }
  },
});

messaging().onMessage((message) => {
  fireFirebaseCloudMessage(message);
});

// publishableKey: Stripe public key
stripe.setOptions({ publishableKey: STRIPE_PUBLISHABLE_KEY });

const linking = {
  prefixes: ['labyrinthe://', 'https://labyr.app.link'],

  // Custom function to get the URL which was used to open the app
  async getInitialURL() {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();
    if (url != null) {
      return url;
    }
    // Next, you would need to get the initial URL from your third-party integration
    // It depends on the third-party SDK you use
    // For example, to get to get the initial URL for branch.io:
    const params = branch.getFirstReferringParams();
    return params?.$canonical_url;
  },

  // Custom function to subscribe to incoming links
  subscribe(listener) {
    const unsubscribe = branch.subscribe(({ error, params }) => {
      if (error) {
        return;
      }
      let uri = 'labyrinthe://';
      if (params.id) {
        uri = `${uri}ref?id=${params.id}`;
      }
      listener(uri);
    });

    return unsubscribe;
  },
  config: {
    RegisterScreen: 'ref',
  },
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<LoadingScreen />} persistor={persistor}>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <AuthStack />
      </NavigationContainer>
    </PersistGate>
  </Provider>
);

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
};

export default codePush(codePushOptions)(App);
