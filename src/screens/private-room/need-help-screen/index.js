import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import DisclaimerText from '../disclaimer-text';
import { darkGreen } from '../../../utilities/colors';

const NeedHelpScreen = ({ route }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.textContainer}>
        <DisclaimerText />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: darkGreen,
  },
  textContainer: {
    flex: 1,
  },
});

export default NeedHelpScreen;
