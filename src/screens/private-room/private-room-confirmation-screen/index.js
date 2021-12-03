import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import minotaur from '../../../api/minotaur';
import CustomText from '../../../components/custom-text';
import Button from '../../../components/button';
import { cream, darkGreen, eggshell } from '../../../utilities/colors';
import { getMembership } from '../../../redux/actions/user-actions';
import { ADD_CARD_ERROR } from '../../../redux/actions/types';

const PrivateRoomConfirmationScreen = ({ route }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [booking, setBooking] = React.useState(false);
  const [error, setError] = React.useState(' ');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigation = useNavigation();

  React.useEffect(() => {
    const load = async () => {
      await dispatch(getMembership());
      setLoaded(true);
    };
    load();
  }, [dispatch]);

  const { booked, price } = route.params;

  const totalPrice = booked.length * price;
  const credits = Math.ceil(user.membership.roomCredits * 2);
  const membershipCredits =
    user.membership.status === 'ACTIVE' ? Math.min(booked.length, credits) : 0;
  const membershipDiscount = membershipCredits * price;
  const priceAfterCredits = totalPrice - membershipDiscount;
  const salesTax = Math.ceil(priceAfterCredits * 0.045);
  const total = priceAfterCredits + salesTax;

  const makeBooking = async () => {
    try {
      setBooking(true);
      await minotaur.post('/private_room', { bookings: booked });
      setBooking(false);
      navigation.navigate('ScanScreen');
      navigation.navigate('PrivateRoomScreen', { tab: 1 });
    } catch (err) {
      setBooking(false);
      if (err.response.status === 400 && err.response.data === 'NO_CARD') {
        navigation.navigate('PaymentsScreen');
        dispatch({ type: ADD_CARD_ERROR, payload: 'Please add a payment method.' });
      } else if (err.response.status === 403) {
        setError('Payment unsuccessful. Please update your card.');
      } else {
        setError('Could not complete transaction.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <CustomText style={styles.header}>Confirm Booking</CustomText>
          {!loaded && <ActivityIndicator />}
        </View>
        {loaded && (
          <View style={styles.info}>
            <FlatList
              style={styles.list}
              data={booked}
              renderItem={({ item }) => {
                const date = moment.utc(item.startTime).local().format('MMM Do, YYYY');
                const start = moment.utc(item.startTime).local().format('h:mm A');
                const end = moment.utc(item.endTime).local().format('h:mm A');
                return (
                  <View style={styles.lineItem}>
                    <View>
                      <CustomText style={styles.text}>{date}</CustomText>
                      <CustomText style={styles.textBold}>
                        {start} - {end}
                      </CustomText>
                    </View>
                    <CustomText style={styles.rightText}>${(price / 100).toFixed(2)}</CustomText>
                  </View>
                );
              }}
              keyExtractor={(_, index) => index.toString()}
            />
            <View style={styles.priceInfo}>
              <View style={styles.lineItem}>
                <CustomText style={styles.text}>Price:</CustomText>
                <CustomText style={styles.text}>${(totalPrice / 100).toFixed(2)}</CustomText>
              </View>
              {membershipCredits ? (
                <View style={styles.lineItem}>
                  <CustomText style={styles.text}>Membership Credits:</CustomText>
                  <CustomText style={styles.text}>
                    - ${(membershipDiscount / 100).toFixed(2)}
                  </CustomText>
                </View>
              ) : null}
              <View style={styles.lineItem}>
                <CustomText style={styles.text}>Sales Tax:</CustomText>
                <CustomText style={styles.text}>${(salesTax / 100).toFixed(2)}</CustomText>
              </View>
              <View style={styles.lineItem}>
                <CustomText style={styles.textBold}>Total Price:</CustomText>
                <CustomText style={styles.textBold}>${(total / 100).toFixed(2)}</CustomText>
              </View>
            </View>
            <CustomText style={styles.error}>{error}</CustomText>
            <Button
              text="Proceed"
              backgroundColor={cream}
              color={eggshell}
              showActivityIndicator={booking}
              onPress={makeBooking}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkGreen,
    padding: 20,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    color: eggshell,
    fontSize: 18,
    marginRight: 10,
  },
  headerContainer: {
    borderColor: eggshell,
    borderBottomWidth: 1,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  list: {
    paddingTop: 20,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  text: {
    color: eggshell,
  },
  textBold: {
    color: eggshell,
    fontWeight: 'bold',
  },
  rightText: {
    alignSelf: 'flex-end',
    color: eggshell,
  },
  info: {
    flex: 1,
  },
  priceInfo: {
    marginBottom: 20,
  },
  error: {
    color: eggshell,
    marginBottom: 10,
  },
});

export default PrivateRoomConfirmationScreen;
