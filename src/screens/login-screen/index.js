import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import CustomText from '../../components/custom-text';
import CustomTextInput from '../../components/custom-text-input';
import { brown, cream, eggshell } from '../../utilities/colors';
import Button from '../../components/button';
import { login, addUserError } from '../../redux/actions/user-actions';

const LoginScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(addUserError(' '));
    });
    return unsubscribe;
  }, [dispatch, navigation]);

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
              this.secondTextInput.focus();
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
              dispatch(
                login(email, password, user.deviceToken, () => {
                  navigation.navigate('MainDrawer');
                }),
              );
            }}
            placeholderTextColor="white"
            ref={(input) => {
              this.secondTextInput = input;
            }}
            secureTextEntry
            selectionColor="white"
            style={styles.input}
            value={password}
          />
        </View>
      </View>
      <CustomText style={styles.errorMessage}>{user.userError}</CustomText>
      <Button
        text="Sign In"
        color={eggshell}
        backgroundColor={cream}
        onPress={() => {
          dispatch(
            login(email, password, user.deviceToken, () => {
              navigation.navigate('MainDrawer');
            }),
          );
        }}
        showActivityIndicator={user.isSigningIn}
        disabled={user.isSigningIn}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('PromptMobileNumberScreen');
        }}>
        <CustomText style={styles.buttonText}>Forgot Password?</CustomText>
      </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: brown,
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
  errorMessage: {
    marginVertical: 10,
    color: 'red',
    width: '100%',
    textAlign: 'center',
  },
  button: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: eggshell,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
