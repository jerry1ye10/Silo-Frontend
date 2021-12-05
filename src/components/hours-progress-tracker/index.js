import React from 'react';
import { View, StyleSheet } from 'react-native';

import CustomText from '../custom-text';
import { brown, cream, eggshell } from '../../utilities/colors';

export const MinutesProgressTracker = ({ totalMinutes, minutesUsed, type }) => {
  const bars = [];
  const usedBarStyle = { ...styles.singleBar, backgroundColor: cream };
  const unusedBarStyle = { ...styles.singleBar, backgroundColor: eggshell };
  for (let i = 0; i < totalMinutes; i++) {
    if (i < minutesUsed) {
      bars.push(<View style={usedBarStyle} key={i} testID="bar" />);
    } else {
      bars.push(<View style={unusedBarStyle} key={i} testID="bar" />);
    }
  }
  return (
    type === 'minutes' ?
     <View style={styles.container}>
      <CustomText style={styles.title}>Minutes Remaining:</CustomText>
      <View style={styles.progressBarContainer} testID="bars-container">
        {bars}
      </View>
      <View style={styles.numberContainer} testID="digits-container">
      <CustomText style={styles.title}>{minutesUsed}</CustomText>
      </View>
     </View> :
    <View style={styles.container}>
      <CustomText style={styles.title}>Visits Remaining:</CustomText>
      <View style={styles.progressBarContainer} testID="bars-container">
        {bars}
      </View>
      <View style={styles.numberContainer} testID="digits-container">
      <CustomText style={styles.title}>{minutesUsed}</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: brown,
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  title: {
    color: eggshell,
    fontWeight: 'bold',
    fontSize: 12,
    marginHorizontal: 3,
  },
  progressBarContainer: {
    height: 5,
    marginTop: 8,
    marginBottom: 2,
    marginHorizontal: 6,
    flexDirection: 'row',
  },
  singleBar: {
    flex: 1,
    borderWidth: 1,
    borderColor: brown,
  },
  numberContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 3,
  },
  digit: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MinutesProgressTracker;
