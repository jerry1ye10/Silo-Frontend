import React from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet, Share, Image } from 'react-native';

import CustomText from '../../components/custom-text';
import Button from '../../components/button';
import { brown, cream, darkGreen, eggshell } from '../../utilities/colors';

const RefferalScreen = () => {
  const user = useSelector((state) => state.user);
  const refferalLink = `https://silo.app.link/ref?id=${user.id.substring(0, 6)}`;

  const onPress = async () => {
    await Share.share({ message: refferalLink });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image style={styles.gift} source={require('../../../assets/gift.png')} />
        </View>
        <View style={styles.body}>
          <View>
            <CustomText style={styles.header}>Refer a Friend.</CustomText>
            <CustomText style={styles.header}>Get a Free Visit</CustomText>
            <CustomText style={styles.header}>(for you & a friend)</CustomText>
            <CustomText style={styles.description}>
              Get a free visit when someone signs up using your referral link and makes a purchase.
            </CustomText>
            <CustomText style={styles.description}>You'll both get a free visit.</CustomText>
          </View>
          <View>
            <CustomText style={styles.subheader}>SHARE YOUR LINK:</CustomText>
            <Button
              text={refferalLink}
              color={brown}
              backgroundColor={cream}
              onPress={onPress}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: darkGreen,
  },
  content: {
    flex: 1,
    backgroundColor: eggshell,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    padding: 30,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    aspectRatio: 1,
    height: '25%',
  },
  gift: {
    width: '100%',
    aspectRatio: 1,
  },
  header: {
    color: brown,
    fontWeight: 'bold',
    fontSize: 30,
  },
  description: {
    marginTop: 20,
    color: brown,
    fontSize: 20,
  },
  subheader: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    color: brown,
  },
});

export default RefferalScreen;
