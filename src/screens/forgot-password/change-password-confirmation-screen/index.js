import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { black, coral, eggshell } from '../../../utilities/colors';
import Button from '../../../components/button';
import CustomText from '../../../components/custom-text';

const ChangePasswordConfirmationScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <CustomText style={styles.headerText}>Your Password was Succesfully Changed</CustomText>
      <Button
        text="OK"
        color={eggshell}
        backgroundColor={coral}
        onPress={() => {
          navigation.navigate('LandingScreen');
          navigation.navigate('LoginScreen');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: black,
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: eggshell,
    fontWeight: 'bold',
  },
});

export default ChangePasswordConfirmationScreen;
