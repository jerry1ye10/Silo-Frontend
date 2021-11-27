import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import CustomText from '../../../components/custom-text';
import { eggshell } from '../../../utilities/colors';

const DisclaimerText = () => {
  return (
    <View>
      <View style={styles.headerContainer}>
        <View>
          <CustomText style={styles.headerText}>No Need to </CustomText>
          <CustomText style={styles.headerText}>Check In</CustomText>
        </View>
        <Image source={require('../../../../assets/check-in.png')} style={styles.image} />
      </View>
      <CustomText style={styles.text}>
        The door to the private room will automatically unlock to accommodate your reservation. The
        door will remain unlocked during your stay.
      </CustomText>
      <View style={styles.headerContainer}>
        <View>
          <CustomText style={styles.headerText}>Close the Door</CustomText>
          <CustomText style={styles.headerText}>on the Way Out</CustomText>
        </View>
        <Image source={require('../../../../assets/door-close.png')} style={styles.image} />
      </View>
      <CustomText style={styles.text}>
        Please make sure the door is completely shut on your way out. This ensures the door can be
        locked again for future use. Check out in a prompt manner to avoid additional charges.
      </CustomText>
      <View style={styles.headerContainer}>
        <View>
          <CustomText style={styles.headerText}>Manual Exit Button</CustomText>
          <CustomText style={styles.headerText}>Located by Door</CustomText>
        </View>
        <Image source={require('../../../../assets/exit-button.png')} style={styles.image} />
      </View>
      <CustomText style={styles.text}>
        In case the door is locked while you’re still in the room (i.e. you have stayed over time),
        please use the button next to the door to exit.
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    color: eggshell,
    fontWeight: 'bold',
    fontSize: 22,
  },
  text: {
    color: eggshell,
    marginBottom: 15,
  },
  image: {
    width: 70,
    height: 70,
    aspectRatio: 1,
  },
});

export default DisclaimerText;
