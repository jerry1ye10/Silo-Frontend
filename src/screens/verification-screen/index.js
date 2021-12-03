import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppEventsLogger } from 'react-native-fbsdk-next';

import minotaur from '../../api/minotaur';
import Button from '../../components/button';
import CustomText from '../../components/custom-text';
import CustomTextInput from '../../components/custom-text-input';
import { brown, darkGreen, eggshell, lightGreen } from '../../utilities/colors';
import { addUser } from '../../redux/actions/user-actions';
import { formatPhoneNumber } from '../../utilities/strings';

const VerificationScreen = ({ route }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { email, password, phoneNumber, refferalId } = route.params;

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(' ');
  const [verificationField, setVerificationField] = React.useState('');

  const register = async () => {
    setSubmitting(true);
    try {
      await minotaur.post('/request_token', {
        phone_number: phoneNumber,
        code: verificationField,
      });
      const response = await minotaur.post('/users', {
        email,
        password,
        phoneNumber,
        refferalId,
      });
      // Check if there is device token information present.
      if (user.deviceToken !== null) {
        // If nothing exists, create it.
        await minotaur.post('/devices', {
          token: user.deviceToken.token,
          os: user.deviceToken.os,
          user_id: response.data.id,
        });
      }
      setSubmitting(false);
      setError(' ');
      dispatch(addUser(response.data));
      AppEventsLogger.logEvent('fb_mobile_complete_registration');
      navigation.navigate('MainDrawer');
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
      register();
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
          selectionColor={eggshell}
          maxLength={6}
          keyboardType="number-pad"
          value={verificationField}
          onChangeText={setVerificationField}
        />
      </View>
      <CustomText style={styles.errorMessage}>{error}</CustomText>
      <Button
        text="Verify"
        color={darkGreen}
        backgroundColor={lightGreen}
        onPress={register}
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
    color: eggshell,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    textAlign: 'center',
    color: eggshell,
    marginBottom: 20,
  },
  codeInputView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  digitInput: {
    borderColor: eggshell,
    borderBottomWidth: 1,
    color: eggshell,
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

export default VerificationScreen;
