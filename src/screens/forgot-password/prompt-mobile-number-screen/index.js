import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import minotaur from '../../../api/minotaur';
import Button from '../../../components/button';
import CustomText from '../../../components/custom-text';
import CustomTextInput from '../../../components/custom-text-input';
import { brown, cream } from '../../../utilities/colors';
import { cleanPhoneNumber, formatPhoneNumber } from '../../../utilities/strings';

const PromptMobileNumberScreen = () => {
  const navigation = useNavigation();
  const [formattedPhoneNumber, setFormattedPhoneNumber] = React.useState(null);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(' ');

  const onChangeText = (number) => {
    const cleanNumber = cleanPhoneNumber(number);
    setPhoneNumber(cleanNumber);
    setFormattedPhoneNumber(formatPhoneNumber(cleanNumber));
  };

  const proceed = async () => {
    setSubmitting(true);
    try {
      await minotaur.get(`/check_availability?phone_number=${phoneNumber}`);
      setSubmitting(false);
      setError('No account with that phone number exists.');
    } catch (err) {
      if (err.response.status === 404) {
        await minotaur.post('/initiate_validation', { phone_number: phoneNumber });
        setSubmitting(false);
        setError(' ');
        navigation.navigate('ForgotPasswordVerificationScreen', { phoneNumber });
      } else {
        setSubmitting(false);
        setError('Sorry something went wrong, please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.header}>What is Your Phone Number?</CustomText>
      <View style={styles.content}>
        <View style={styles.textInputView}>
          <CustomText style={styles.fieldTitle}>Phone Number</CustomText>
          <View style={styles.textInputWrapper}>
            <CustomTextInput
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              keyboardType="number-pad"
              maxLength={14}
              onChangeText={onChangeText}
              placeholderTextColor={cream}
              selectionColor={cream}
              style={styles.input}
              value={formattedPhoneNumber}
            />
          </View>
        </View>
        <CustomText style={styles.errorMessage}>{error}</CustomText>
        <Button
          text="Continue"
          color={brown}
          backgroundColor={cream}
          onPress={proceed}
          disabled={phoneNumber.length !== 10 || submitting}
          disabledColor="black"
          disabledBackgroundColor="gray"
          showActivityIndicator={submitting}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brown,
  },
  header: {
    textAlign: 'center',
    color: cream,
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  fieldTitle: {
    color: cream,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  textInputView: {
    width: '100%',
    borderWidth: 1,
    borderColor: brown,
    borderBottomColor: cream,
    paddingVertical: 5,
    marginTop: 10,
  },
  textInputWrapper: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 0,
    color: cream,
  },
  errorMessage: {
    textAlign: 'center',
    color: 'red',
    marginVertical: 10,
  },
});

export default PromptMobileNumberScreen;
