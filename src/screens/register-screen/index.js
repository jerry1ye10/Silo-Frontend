import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import minotaur from '../../api/minotaur';
import CustomText from '../../components/custom-text';
import CustomTextInput from '../../components/custom-text-input';
import Button from '../../components/button';
import { isEmailValid } from '../../utilities/strings';
import { brown, darkGreen, eggshell, lightGreen } from '../../utilities/colors';

const RegisterScreen = ({ route }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);

  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState(' ');
  const [password, setPassword] = React.useState('');
  const [refferalCode, setRefferalCode] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const secondTextInput = React.useRef();
  const thirdTextInput = React.useRef();

  if (user.token) {
    navigation.navigate('MainDrawer');
  }

  React.useEffect(() => {
    if (route.params && route.params.id) {
      setRefferalCode(route.params.id);
    }
  }, [route.params]);

  const proceed = async () => {
    if (!isEmailValid(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    let refferalId = null;
    try {
      await minotaur.get(`/check_availability?email=${email}`);
      if (refferalCode) {
        const response = await minotaur.get(`/refferal?code=${refferalCode}`);
        if (!response.data.id) {
          setSubmitting(false);
          setError('The referral code you entered is invalid.');
          return;
        }
        refferalId = response.data.id;
      }
      setSubmitting(false);
      setError(' ');
      navigation.navigate('PhoneNumberScreen', { email, password, refferalId });
    } catch (err) {
      setSubmitting(false);
      if (err.response.status === 404) {
        setError('An account with the email you entered already exists.');
      } else {
        setError('Sorry something went wrong, please try again later.');
      }
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.textInputView}>
        <CustomText style={styles.fieldTitle}>Email</CustomText>
        <View style={styles.textInputWrapper}>
          <CustomTextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            blurOnSubmit={false}
            enablesReturnKeyAutomatically
            keyboardType="email-address"
            onChangeText={setEmail}
            onSubmitEditing={() => {
              secondTextInput.current.focus();
            }}
            placeholderTextColor="white"
            selectionColor="white"
            style={styles.input}
            value={email}
          />
        </View>
      </View>
      <View style={styles.textInputView}>
        <CustomText style={styles.fieldTitle}>Password</CustomText>
        <View style={styles.textInputWrapper}>
          <CustomTextInput
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            enablesReturnKeyAutomatically
            keyboardType="default"
            onChangeText={setPassword}
            onSubmitEditing={() => {
              thirdTextInput.current.focus();
            }}
            placeholderTextColor="white"
            ref={secondTextInput}
            secureTextEntry
            selectionColor="white"
            style={styles.input}
            value={password}
          />
        </View>
      </View>
      <View style={styles.textInputView}>
        <CustomText style={styles.fieldTitle}>Refferal Code (optional)</CustomText>
        <View style={styles.textInputWrapper}>
          <CustomTextInput
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            enablesReturnKeyAutomatically
            keyboardType="default"
            onChangeText={setRefferalCode}
            onSubmitEditing={proceed}
            placeholderTextColor="white"
            ref={thirdTextInput}
            selectionColor="white"
            style={styles.input}
            value={refferalCode}
          />
        </View>
      </View>
      <CustomText style={styles.errorMessage}>{error}</CustomText>
      <Button
        text="Register"
        color={darkGreen}
        backgroundColor={lightGreen}
        onPress={proceed}
        showActivityIndicator={submitting}
        disabled={submitting || !email || !password}
      />
      <CustomText style={styles.disclaimerText}>
        By tapping Register, you acknowledge that you have read the{' '}
        <CustomText
          style={styles.hyperlinkText}
          onPress={() => {
            Linking.openURL('https://silo.co/privacy-policy');
          }}>
          Privacy Policy
        </CustomText>{' '}
        and agree to the{' '}
        <CustomText
          style={styles.hyperlinkText}
          onPress={() => {
            Linking.openURL('https://silo.co/terms-conditions');
          }}>
          Terms of Use
        </CustomText>
        .
      </CustomText>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brown,
    paddingBottom: 10,
    paddingHorizontal: 30,
  },
  textInputView: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'black',
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
    paddingVertical: 10,
    paddingHorizontal: 0,
    color: eggshell,
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
    marginBottom: 20,
    marginTop: 10,
  },
  hyperlinkText: {
    color: lightGreen,
  },
});

export default RegisterScreen;
