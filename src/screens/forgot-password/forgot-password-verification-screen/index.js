import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import minotaur from '../../../api/minotaur';
import Button from '../../../components/button';
import CustomText from '../../../components/custom-text';
import CustomTextInput from '../../../components/custom-text-input';
import { brown, cream } from '../../../utilities/colors';
import { formatPhoneNumber } from '../../../utilities/strings';

const ForgotPasswordVerificationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { phoneNumber } = route.params;

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(' ');
  const [verificationField, setVerificationField] = React.useState('');

  const proceed = async () => {
    setSubmitting(true);
    try {
      const response = await minotaur.post('/request_token', {
        phone_number: phoneNumber,
        code: verificationField,
      });
      setSubmitting(false);
      setError(' ');
      navigation.navigate('ChangePasswordScreen', { phoneNumber, token: response.data.token });
    } catch (err) {
      setSubmitting(false);
      if (err.response.status === 400) {
        setError(err.response.data);
      } else {
        setError('Sorry something went wrong, please try again later.');
      }
    }
  };

  // Automatically triggers submit after sixth field is set and all fields
  // have values.
  React.useEffect(() => {
    if (verificationField.length === 6) {
      proceed();
    }
  }, [verificationField]);

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <CustomText style={styles.headerText}>Enter Your Code</CustomText>
      <CustomText style={styles.descriptionText}>
        A 6-digit code was sent to +1 {formatPhoneNumber(phoneNumber)}
      </CustomText>
      <View style={styles.codeInputView}>
        <CustomTextInput
          autoFocus
          style={styles.digitInput}
          selectionColor={cream}
          maxLength={6}
          keyboardType="number-pad"
          value={verificationField}
          onChangeText={setVerificationField}
        />
      </View>
      <CustomText style={styles.errorMessage}>{error}</CustomText>
      <Button
        text="Verify"
        color={brown}
        backgroundColor={cream}
        onPress={proceed}
        showActivityIndicator={submitting}
        disabled={submitting}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brown,
    paddingHorizontal: 30,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 16,
    color: cream,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    textAlign: 'center',
    color: cream,
    marginBottom: 20,
  },
  codeInputView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  digitInput: {
    borderColor: cream,
    borderBottomWidth: 1,
    color: cream,
    width: 100,
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 5,
  },
  errorMessage: {
    marginVertical: 10,
    color: 'red',
    width: '100%',
    textAlign: 'center',
  },
});

export default ForgotPasswordVerificationScreen;
