import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import CustomText from '../../../components/custom-text';
import { eggshell } from '../../../utilities/colors';

const CancelCard = ({ onPress, selected = false }) => {
  const containerStyle = selected ? { ...styles.container, borderColor: 'red' } : styles.container;
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <CustomText style={styles.headerText}>Cancel Membership</CustomText>
      <CustomText style={styles.subText}>
        You will keep your remaining hours until the expiration date.
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
    borderWidth: 5,
    borderColor: 'gray',
    padding: 20,
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
    color: eggshell,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  subText: {
    color: eggshell,
  },
});

export default CancelCard;
