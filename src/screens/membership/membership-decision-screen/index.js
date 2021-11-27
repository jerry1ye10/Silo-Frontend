import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomText from '../../../components/custom-text';
import Button from '../../../components/button';
import { coral, darkGreen, eggshell, lightGreen } from '../../../utilities/colors';

const MembershipDecisionScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <CustomText style={styles.header}>What would you like to do?</CustomText>
      <Button
        text="Add More Time"
        color={eggshell}
        backgroundColor={coral}
        onPress={() => {
          navigation.navigate('AddTimeScreen');
        }}
        marginBottom={10}
      />
      <Button
        text="Change Membership"
        color={darkGreen}
        backgroundColor={lightGreen}
        onPress={() => {
          navigation.navigate('ChangeMembershipScreen');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkGreen,
    padding: 20,
  },
  header: {
    color: eggshell,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default MembershipDecisionScreen;
