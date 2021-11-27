import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import minotaur from '../../api/minotaur';
import Button from '../../components/button';
import CustomText from '../../components/custom-text';
import CustomTextInput from '../../components/custom-text-input';
import { black, darkGreen, eggshell, lightGreen } from '../../utilities/colors';
import { cleanPhoneNumber, isPhoneNumberValid, formatPhoneNumber } from '../../utilities/strings';

const PhoneNumberScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email, password, refferalId } = route.params;

  const [error, setError] = React.useState(' ');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = React.useState(null);
  const [phoneNumber, setPhoneNumber] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  const onChangeText = (number) => {
    const cleanNumber = cleanPhoneNumber(number);
    setPhoneNumber(cleanNumber);
    setFormattedPhoneNumber(formatPhoneNumber(cleanNumber));
  };

  const requestValidation = async () => {
    if (!isPhoneNumberValid(phoneNumber)) {
      setError('Please enter a valid phone number.');
      return;
    }
    setSubmitting(true);
    try {
      await minotaur.get(`/check_availability?phone_number=${phoneNumber}`);
      await minotaur.post('/initiate_validation', { phone_number: phoneNumber });
      setSubmitting(false);
      setError(' ');
      navigation.navigate('VerificationScreen', { email, password, phoneNumber, refferalId });
    } catch (err) {
      setSubmitting(false);
      if (err.response.status === 404) {
        setError('An account with the phone number you entered already exists.');
      } else {
        setError('Sorry something went wrong, please try again later.');
      }
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.phoneNumberInputView}>
          <Image
            source={require('../../../assets/american-flag.png')}
            style={styles.americanFlagIcon}
          />
          <View style={styles.numberView}>
            <CustomText style={styles.numberPrefixText}>+1</CustomText>
            <CustomTextInput
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              blurOnSubmit={false}
              enablesReturnKeyAutomatically
              keyboardType="number-pad"
              maxLength={14}
              onChangeText={onChangeText}
              onSubmitEditing={requestValidation}
              placeholderTextColor="gray"
              placeholder="(718) 123-4567"
              selectionColor={eggshell}
              style={styles.phoneNumberInput}
              value={formattedPhoneNumber}
            />
          </View>
        </View>
        <CustomText style={styles.errorMessage}>{error}</CustomText>
      </View>
      <Button
        text="Get Code"
        color={darkGreen}
        backgroundColor={lightGreen}
        onPress={requestValidation}
        showActivityIndicator={submitting}
        disabled={submitting}
      />
      <CustomText style={styles.disclaimerText}>
        Labyrinthe will send you a text message to verify your identity.
      </CustomText>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: black,
    paddingHorizontal: 30,
    paddingBottom: 10,
  },
  topView: {
    flex: 1,
    marginTop: 20,
    width: '100%',
  },
  phoneNumberInputView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    borderColor: eggshell,
    borderBottomWidth: 1,
  },
  numberPrefixText: {
    color: eggshell,
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 5,
  },
  phoneNumberInput: {
    flex: 1,
    marginLeft: 5,
    color: eggshell,
    fontSize: 18,
    paddingVertical: 5,
  },
  americanFlagIcon: {
    aspectRatio: 1,
    width: 25,
  },
  errorMessage: {
    marginVertical: 10,
    color: 'red',
    width: '100%',
    textAlign: 'center',
  },
  disclaimerText: {
    color: eggshell,
    fontSize: 12,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default PhoneNumberScreen;
