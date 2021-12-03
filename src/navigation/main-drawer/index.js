import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import ActiveScreen from '../../screens/active-screen';
import AccountScreen from '../../screens/account-screen';
import AddTimeScreen from '../../screens/membership/add-time-screen';
import ChangeMembershipScreen from '../../screens/membership/change-membership-screen';
import ConfirmMembershipScreen from '../../screens/membership/confirm-membership-screen';
import HistoryScreen from '../../screens/history-screen';
import MembershipDecisionScreen from '../../screens/membership/membership-decision-screen';
import ManageMembershipScreen from '../../screens/membership/manage-membership-screen';
import MembershipScreen from '../../screens/membership/membership-screen';
import NeedHelpScreen from '../../screens/private-room/need-help-screen';
import PaymentsScreen from '../../screens/payments-screen';
import PrivateRoomScreen from '../../screens/private-room/private-room-screen';
import PrivateRoomConfirmationScreen from '../../screens/private-room/private-room-confirmation-screen';
import PrivateRoomDisclaimerScreen from '../../screens/private-room/private-room-disclaimer-screen';
import RefferalScreen from '../../screens/refferal-screen';
import RewardsScreen from '../../screens/rewards-screen';
import ScanScreen from '../../screens/scan-screen';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SideMenu from '../../components/side-menu';
import { brown, eggshell } from '../../utilities/colors';

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
        headerTintColor: eggshell,
        headerTitle: null,
      }}>
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="ActiveScreen" component={ActiveScreen} />
      <Stack.Screen name="AddTimeScreen" component={AddTimeScreen} />
      <Stack.Screen name="ChangeMembershipScreen" component={ChangeMembershipScreen} />
      <Stack.Screen name="ConfirmMembershipScreen" component={ConfirmMembershipScreen} />
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="ManageMembershipScreen" component={ManageMembershipScreen} />
      <Stack.Screen name="MembershipDecisionScreen" component={MembershipDecisionScreen} />
      <Stack.Screen name="MembershipScreen" component={MembershipScreen} />
      <Stack.Screen name="NeedHelpScreen" component={NeedHelpScreen} />
      <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} />
      <Stack.Screen name="PrivateRoomScreen" component={PrivateRoomScreen} />
      <Stack.Screen
        name="PrivateRoomConfirmationScreen"
        component={PrivateRoomConfirmationScreen}
      />
      <Stack.Screen name="PrivateRoomDisclaimerScreen" component={PrivateRoomDisclaimerScreen} />
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
                color={eggshell}
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
