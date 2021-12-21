import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import stripe from 'tipsi-stripe';

import CustomText from '../custom-text';
import { updatePaymentProfile } from '../../redux/actions/user-actions';
import { cream,brown } from '../../utilities/colors';
import Button from '../../components/button';
import CardCard from '../card-card';
import LoadingCardCard from '../loading-card-card';

const CardList = ({ sessionInformation }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const cards = user.cards;
  if (cards.length > 0) {
    cards[cards.length - 1].isLast = true;
  }

  return (
    <View>
      <View style={styles.cardBlock}>
        {user.isAddingCard ? (
          <LoadingCardCard isActive />
        ) : user.cards.length === 0 ? (
          <LoadingCardCard isActive={false} />
        ) : null}
        <FlatList
          data={user.cards}
          style={styles.list}
          scrollEnabled={false}
          renderItem={({ item }) => <CardCard cardInfo={item} />}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
      <CustomText style={styles.errorMessage}>{user.cardError}</CustomText>
      <Button
        text="Add Payment Method"
        color={brown}
        backgroundColor={cream}
        onPress={async () => {
          try {
            const paymentToken = await stripe.paymentRequestWithCardForm({});
            dispatch(
              updatePaymentProfile(user, paymentToken, () => {
                if (sessionInformation) {
                  navigation.navigate('ScanScreen', { sessionInformation });
                }
              }),
            );
          } catch (err) {}
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardBlock: {
    backgroundColor: cream,
  },
  list: {
    backgroundColor: cream,
  },
  errorMessage: {
    marginVertical: 10,
    color: 'red',
    textAlign: 'center',
  },
});

export default CardList;
