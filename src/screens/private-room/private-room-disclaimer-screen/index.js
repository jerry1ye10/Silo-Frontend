import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import DisclaimerText from '../disclaimer-text';
import Button from '../../../components/button';
import CustomText from '../../../components/custom-text';
import { useNavigation } from '@react-navigation/native';
import { cream, darkGreen, eggshell } from '../../../utilities/colors';

const PrivateRoomDisclaimerScreen = ({ route }) => {
  const navigation = useNavigation();

  const { booked, price } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.textContainer}>
        <View style={styles.headerContainer}>
          <CustomText style={styles.header}>Please Read Before Continuing</CustomText>
        </View>
        <DisclaimerText />
      </ScrollView>
      <Button
        text="Continue"
        color={eggshell}
        backgroundColor={cream}
        onPress={() => {
          navigation.navigate('PrivateRoomConfirmationScreen', { booked, price });
        }}
      />
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
  header: {
    color: eggshell,
    fontSize: 18,
    marginRight: 10,
  },
  headerContainer: {
    borderColor: eggshell,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
});

export default PrivateRoomDisclaimerScreen;
