import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import minotaur from '../../../api/minotaur';
import Button from '../../../components/button';
import CustomText from '../../../components/custom-text';
import CustomTextInput from '../../../components/custom-text-input';
import { black, coral, eggshell } from '../../../utilities/colors';

const ChangePasswordScreen = ({ route }) => {
  const { token } = route.params;
  const navigation = useNavigation();

  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState(' ');
  const [newPassword, setNewPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const proceed = async () => {
    if (newPassword.length < 8) {
      setError('Your password is too short.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Your passwords much match.');
      return;
    }
    setSubmitting(true);
    try {
      await minotaur.post(
        '/change_user_password',
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigation.navigate('ChangePasswordConfirmationScreen');
      setSubmitting(false);
      setError(' ');
    } catch (err) {
      setSubmitting(false);
      setError('Something went wrong, please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.headerText}>New Password</CustomText>
      <CustomText style={styles.descriptionText}>
        Your password should be at least 8 characters
      </CustomText>
      <View style={styles.textInputView}>
        <CustomText style={styles.fieldTitle}>New Password</CustomText>
        <View style={styles.textInputWrapper}>
          <CustomTextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setNewPassword}
            placeholderTextColor={eggshell}
            secureTextEntry
            selectionColor={eggshell}
            style={styles.input}
            value={newPassword}
          />
        </View>
      </View>
      <View style={styles.textInputView}>
        <CustomText style={styles.fieldTitle}>Confirm Password</CustomText>
        <View style={styles.textInputWrapper}>
          <CustomTextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setConfirmPassword}
            placeholderTextColor={eggshell}
            secureTextEntry
            selectionColor={eggshell}
            style={styles.input}
            value={confirmPassword}
          />
        </View>
      </View>
      <CustomText style={styles.errorMessage}>{error}</CustomText>
      <Button
        text="Submit"
        color={eggshell}
        backgroundColor={coral}
        onPress={proceed}
        disabled={submitting}
        disabledColor="black"
        disabledBackgroundColor="gray"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: black,
    paddingHorizontal: 40,
  },
  headerText: {
    textAlign: 'center',
    color: eggshell,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  descriptionText: {
    textAlign: 'center',
    color: eggshell,
    marginBottom: 20,
  },
  errorMessage: {
    marginVertical: 10,
    color: 'red',
    width: '100%',
    textAlign: 'center',
  },
  textInputView: {
    width: '100%',
    borderWidth: 1,
    borderColor: black,
    borderBottomColor: eggshell,
    paddingVertical: 5,
    marginTop: 10,
  },
  fieldTitle: {
    color: eggshell,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  textInputWrapper: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 0,
    color: eggshell,
  },
});

export default ChangePasswordScreen;
