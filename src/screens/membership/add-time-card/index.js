import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import CustomText from '../../../components/custom-text';
import { brown, cream, eggshell } from '../../../utilities/colors';

const AddTimeCard = ({ membershipInfo, onPress, selected = false }) => {
  const { name, capacity: minutes, roomCapacity: roomCredits, price } = membershipInfo;
  const containerStyle = selected ? { ...styles.container, borderColor: 'red' } : styles.container;

  let offeringText = `${minutes / 60} hours`;
  if (roomCredits === 1) {
    offeringText += ', 1 private room hour';
  } else if (roomCredits) {
    offeringText += `, ${roomCredits} private room hours`;
  }
  const priceText = `$${price / 100}`;
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <View>
        <CustomText style={styles.headerText}>{name}</CustomText>
        <CustomText style={styles.offeringText}>{offeringText}</CustomText>
      </View>
      <View>
        <CustomText style={styles.priceText}>{priceText}</CustomText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: eggshell,
    borderWidth: 5,
    borderColor: eggshell,
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
    color: brown,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  offeringText: {
    color: brown,
  },
  priceText: {
    color: cream,
    fontWeight: 'bold',
    fontSize: 22,
  },
});

export default AddTimeCard;
