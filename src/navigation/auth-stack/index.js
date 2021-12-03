import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ChangePasswordConfirmationScreen from '../../screens/forgot-password/change-password-confirmation-screen';
import ChangePasswordScreen from '../../screens/forgot-password/change-password-screen';
import ForgotPasswordVerificationScreen from '../../screens/forgot-password/forgot-password-verification-screen';
import LandingScreen from '../../screens/landing-screen';
import LoginScreen from '../../screens/login-screen';
import PhoneNumberScreen from '../../screens/phone-number-screen';
import PromptMobileNumberScreen from '../../screens/forgot-password/prompt-mobile-number-screen';
import RegisterScreen from '../../screens/register-screen';
import VerificationScreen from '../../screens/verification-screen';
import MainDrawer from '../main-drawer';
import { brown, eggshell } from '../../utilities/colors';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: brown,
        shadowColor: 'transparent',
      },
      headerTintColor: eggshell,
      headerTitle: null,
      headerBackTitleVisible: false,
      headerLeftContainerStyle: {
        paddingLeft: 20,
      },
    }}>
    <Stack.Screen name="LandingScreen" component={LandingScreen} options={{ headerShown: false }} />
    <Stack.Screen
      name="ChangePasswordConfirmationScreen"
      component={ChangePasswordConfirmationScreen}
      options={{ headerLeft: null, gestureEnabled: false }}
    />
    <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
    <Stack.Screen
      name="ForgotPasswordVerificationScreen"
      component={ForgotPasswordVerificationScreen}
    />
    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Log In' }} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    <Stack.Screen name="PromptMobileNumberScreen" component={PromptMobileNumberScreen} />
    <Stack.Screen
      name="PhoneNumberScreen"
      component={PhoneNumberScreen}
      options={{ title: 'Verify Phone Number' }}
    />
    <Stack.Screen
      name="VerificationScreen"
      component={VerificationScreen}
      options={{ title: 'Enter Your Code' }}
    />
    <Stack.Screen
      name="MainDrawer"
      component={MainDrawer}
      options={{
        gestureEnabled: false,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default AuthStack;
