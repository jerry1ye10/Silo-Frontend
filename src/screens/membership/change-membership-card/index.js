import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import CustomText from '../../../components/custom-text';
import { black, coral, eggshell } from '../../../utilities/colors';

const ChangeMembershipCard = ({ membershipInfo, onPress }) => {
  const {
    name,
    capacity: minutes,
    guestCapacity: guestMinutes,
    roomCapacity: roomCredits,
    price,
  } = membershipInfo;

  let offeringText = `${minutes / 60} hours, ${guestMinutes / 60} guest hours`;
  if (roomCredits === 1) {
    offeringText += ', 1 private room hour';
  } else if (roomCredits) {
    offeringText += `, ${roomCredits} private room hours`;
  }
  const priceText = `$${price / 100} / month`;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <CustomText style={styles.headerText}>{`Change to ${name}`}</CustomText>
      <CustomText style={styles.offeringText}>{offeringText}</CustomText>
      <CustomText style={styles.priceText}>{priceText}</CustomText>
      <CustomText style={styles.subtext}>
        This change will take effect on your next renewal.
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: eggshell,
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  headerText: {
    color: black,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 3,
  },
  offeringText: {
    color: black,
    marginBottom: 3,
  },
  priceText: {
    color: coral,
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 5,
  },
  subtext: {
    color: black,
  },
});

export default ChangeMembershipCard;
