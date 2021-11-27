import React from 'react';
import { Image, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';

import Button from '../../components/button';
import { black, coral, darkGreen, eggshell, lightGreen } from '../../utilities/colors';
import OccupancyIndicator from '../../components/occupancy-indicator';
import { recordDeviceToken } from '../../redux/actions/user-actions';

const LandingScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // See react-native-splash-screen.
  SplashScreen.hide();
  // If the user is logged in, redirect to the ScanScreen.
  if (user.token !== null) {
    navigation.navigate('MainDrawer');
  }

  // Continuously check since the state can be NOT_DETERMINED. Wonder if this function
  // can be thrown into an infinite loop. Empirically it seems fine so far. Should check
  // more rigorously in the future.
  React.useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      if (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        messaging.AuthorizationStatus.PROVISIONAL
      ) {
        const token = await messaging().getToken();
        dispatch(recordDeviceToken(token, Platform.OS));
      } else if (authStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
        requestUserPermission();
      }
    };
    requestUserPermission();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View>
        <OccupancyIndicator />
      </View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../../../assets/app-logo-with-text-transparent.png')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          text="Sign In"
          color={eggshell}
          backgroundColor={coral}
          onPress={() => {
            navigation.navigate('LoginScreen');
          }}
          marginBottom={10}
        />
        <Button
          text="Register"
          color={darkGreen}
          backgroundColor={lightGreen}
          onPress={() => {
            navigation.navigate('RegisterScreen');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: black,
    justifyContent: 'space-between',
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '70%',
    height: 'auto',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
});

export default LandingScreen;
