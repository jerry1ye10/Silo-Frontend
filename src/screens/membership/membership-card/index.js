import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import CustomText from '../../../components/custom-text';
import { black, coral, eggshell } from '../../../utilities/colors';

const MembershipCard = ({ membershipInfo, onPress, selected = false }) => {
  const { name, capacity: minutes, roomCapacity: roomCredits, price } = membershipInfo;
  const containerStyle = selected ? { ...styles.container, borderColor: 'red' } : styles.container;

  let offeringText = `${minutes / 60} hours`;
  if (roomCredits === 1) {
    offeringText += ', 1 private room hour';
  } else if (roomCredits) {
    offeringText += `, ${roomCredits} private room hours`;
  }
  const priceText = `$${price / 100} / month`;
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <CustomText style={styles.headerText}>{name}</CustomText>
      <CustomText style={styles.offeringText}>{offeringText}</CustomText>
      <CustomText style={styles.priceText}>{priceText}</CustomText>
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
    borderColor: eggshell,
    borderWidth: 5,
  },
  headerText: {
    color: black,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  offeringText: {
    color: black,
    marginBottom: 20,
  },
  priceText: {
    color: coral,
    fontWeight: 'bold',
    fontSize: 22,
  },
});

export default MembershipCard;
