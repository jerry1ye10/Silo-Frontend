import React from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CustomText from '../../components/custom-text';
import { black, darkGreen, eggshell } from '../../utilities/colors';

const NavigationCard = ({ icon, title, screen, color }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={nStyles.container}
      onPress={() => {
        navigation.navigate(screen);
      }}>
      <View style={nStyles.iconContainer}>{icon}</View>
      <CustomText style={{ ...nStyles.title, color }}>{title}</CustomText>
    </TouchableOpacity>
  );
};

const nStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginLeft: 5,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
  },
});

const SideMenu = () => {
  const data = [
    {
      title: 'Membership',
      icon: <Icon name="badge-account-horizontal" size={30} color={black} />,
      screen: 'MembershipScreen',
      color: black,
    },
    {
      title: 'Active Desks',
      icon: <Icon name="desk-lamp" size={30} color={black} />,
      screen: 'ActiveScreen',
      color: black,
    },
    {
      title: 'Private Room',
      icon: <Icon name="sofa" size={30} color={black} />,
      screen: 'PrivateRoomScreen',
      color: black,
    },
    {
      title: 'Account',
      icon: <Icon name="account" size={30} color={black} />,
      screen: 'AccountScreen',
      color: black,
    },
    {
      title: 'Payment',
      icon: <Icon name="credit-card" size={30} color={black} />,
      screen: 'PaymentsScreen',
      color: black,
    },
    {
      title: 'Promotions',
      icon: <Icon name="wallet-giftcard" size={30} color={black} />,
      screen: 'RewardsScreen',
      color: black,
    },
    {
      title: 'History',
      icon: <Icon name="history" size={30} color={black} />,
      screen: 'HistoryScreen',
      color: black,
    },
    {
      title: 'Get a Free Visit',
      icon: <Icon name="gift" size={30} color={darkGreen} />,
      screen: 'RefferalScreen',
      color: darkGreen,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <SafeAreaView forceInset={{ top: 'always' }} />
        <Image style={styles.image} source={require('../../../assets/app-logo-transparent.png')} />
      </View>
      <FlatList
        style={styles.list}
        data={data}
        renderItem={({ item }) => {
          return (
            <NavigationCard
              title={item.title}
              icon={item.icon}
              screen={item.screen}
              color={item.color}
            />
          );
        }}
        contentContainerStyle={styles.listContentConatinerStyle}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: eggshell,
  },
  imageContainer: {
    backgroundColor: black,
  },
  image: {
    height: 120,
    aspectRatio: 1,
    marginLeft: 5,
  },
  list: {
    flex: 1,
  },
  listContentConatinerStyle: {
    paddingTop: 20,
  },
});

export default SideMenu;
