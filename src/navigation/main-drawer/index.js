import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import ActiveScreen from '../../screens/active-screen';
import AccountScreen from '../../screens/account-screen';
import HistoryScreen from '../../screens/history-screen';
import PaymentsScreen from '../../screens/payments-screen';
import RefferalScreen from '../../screens/refferal-screen';
import RewardsScreen from '../../screens/rewards-screen';
import ScanScreen from '../../screens/scan-screen';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SideMenu from '../../components/side-menu';
import { brown, cream } from '../../utilities/colors';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainStack = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      initialRouteName="ScanScreen"
      screenOptions={{
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {
          paddingLeft: 20,
        },
        headerRightContainerStyle: {
          paddingRight: 20,
        },
        headerStyle: {
          backgroundColor: brown,
          shadowColor: 'transparent',
        },
        headerTintColor: cream,
        headerTitle: null,
      }}>
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="ActiveScreen" component={ActiveScreen} />
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} />
      <Stack.Screen name="RefferalScreen" component={RefferalScreen} />
      <Stack.Screen name="RewardsScreen" component={RewardsScreen} />
      <Stack.Screen
        name="ScanScreen"
        component={ScanScreen}
        options={{
          gestureEnabled: false,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}>
              <Icon
                name="menu"
                style={styles.button}
                size={35}
                color={cream}
                backgroundColor={brown}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const MainDrawer = () => (
  <Drawer.Navigator
    drawerContent={() => <SideMenu />}
    screenOptions={{
      swipeEnabled: false,
    }}>
    <Drawer.Screen name="MainStack" component={MainStack} />
  </Drawer.Navigator>
);

export default MainDrawer;
