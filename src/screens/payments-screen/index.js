import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import CustomText from '../../components/custom-text';
import { brown, cream } from '../../utilities/colors';
import { addCardError, getCards } from '../../redux/actions/user-actions';
import CardList from '../../components/card-list';

const PaymentsScreen = ({ route }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const sessionInformation = route.params ? route.params.sessionInformation : null;

  console.log(user.token);
  React.useEffect(() => {
    dispatch(getCards(user.token));
  }, [dispatch, user.token]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(addCardError(' '));
    });
    return unsubscribe;
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <CustomText style={styles.titleText}>Payment Methods</CustomText>
        <CardList sessionInformation={sessionInformation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brown,
    padding: 20,
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
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: brown,
  },
});

export default PaymentsScreen;
