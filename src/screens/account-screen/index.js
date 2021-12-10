import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import CustomText from '../../components/custom-text';
import { brown, cream } from '../../utilities/colors';
import Button from '../../components/button';
import InputCard from '../../components/input-card';

import { logOut, editName, addUserError } from '../../redux/actions/user-actions';
import { formatPhoneNumber } from '../../utilities/strings';

const AccountScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(addUserError(' '));
    });
    return unsubscribe;
  }, [dispatch, navigation]);

  const data = [
    {
      title: 'Name',
      defaultValue: user.name,
      isChangeable: true,
      isChanging: user.isChangingName,
      isLast: false,
      onPress: (name, next) => {
        dispatch(editName(user.token, name, next));
      },
    },
    {
      title: 'Email',
      content: user.isAdmin ? `[ADMIN] ${user.email}` : user.email,
      isChangeable: false,
      isLast: false,
    },
    {
      title: 'Phone Number',
      content: `+1 ${formatPhoneNumber(user.phoneNumber)}`,
      isChangeable: false,
      isLast: true,
    },
  ];
  return (
    <>
      <View style={styles.container}>
        <View style={styles.topView}>
          <CustomText style={styles.titleText}>Account Info</CustomText>
          <FlatList
            data={data}
            style={styles.list}
            renderItem={({ item }) => <InputCard inputInfo={item} />}
            keyExtractor={(_, index) => index.toString()}
            keyboardShouldPersistTaps="handled"
          />
          <CustomText style={styles.errorMessage}>{user.userError}</CustomText>
          <Button
            text="Log Out"
            color={brown}
            backgroundColor={cream}
            onPress={() => {
              dispatch(logOut());
              navigation.navigate('LandingScreen');
            }}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: brown,
  },
  topView: {
    backgroundColor: cream,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    padding: 20,
  },
  list: {
    flexGrow: 0,
    borderColor: 'red',
  },
  errorMessage: {
    marginVertical: 10,
    color: 'red',
    textAlign: 'center',
  },
  titleText: {
    color: brown,
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default AccountScreen;
