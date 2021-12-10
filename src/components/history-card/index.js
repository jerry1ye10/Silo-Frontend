import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useSelector } from 'react-redux';

import CustomText from '../custom-text';
import { cream, brown } from '../../utilities/colors';
import { getCardBrandIcon } from '../../utilities/cards';
import { getShortDateString } from '../../utilities/strings';

import Button from '../../components/button';
import moment from 'moment';
import minotaur from '../../api/minotaur';

const onRequestPress = (user, data, setIsRequestingReceipt, setDidRequestReceiptSuccessfully) => {
  Alert.alert(
    'Requesting Purchase Receipt',
    `A receipt of your purchase will be sent to ${user.email}`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => {
          requestReceipt(user, data, setIsRequestingReceipt, setDidRequestReceiptSuccessfully);
        },
      },
    ],
  );
};

const requestReceipt = async (
  user,
  data,
  setIsRequestingReceipt,
  setDidRequestReceiptSuccessfully,
) => {
  try {
    setIsRequestingReceipt(true);
    await minotaur.post(
      '/mail/purchase_receipt',
      { data },
      { headers: { Authorization: `Bearer ${user.token}` } },
    );
    setIsRequestingReceipt(false);
    setDidRequestReceiptSuccessfully(true);
  } catch (err) {
    setIsRequestingReceipt(false);
    setDidRequestReceiptSuccessfully(false);
  }
};

const SiloCard = ({ sessionInfo, user }) => {
  const price = (sessionInfo.price / 100).toFixed(2);
  const salesTax = (sessionInfo.salesTax / 100).toFixed(2);
  const total = ((sessionInfo.price + sessionInfo.salesTax) / 100).toFixed(2);

  const [isRequestingReceipt, setIsRequestingReceipt] = React.useState(false);
  const [didRequestReceiptSuccessfully, setDidRequestReceiptSuccessfully] = React.useState(false);

  const receiptData = {
    item_name: 'Silo Pass',
    item_purchase_time: `${getShortDateString(sessionInfo.timeCreated)}`,
    card_last4: sessionInfo.cardLast4,
    purchase_price: `$${price}`,
    purchase_tax: `$${salesTax}`,
    purchase_total: `$${total}`,
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.historyTitle}>Silo Pass</CustomText>
      <CustomText style={styles.historySubtitle}>
        Purchased on: {moment.utc(sessionInfo.timeCreated).local().format('MM/DD/YY')}
      </CustomText>
      <CustomText style={styles.bold}>Your Visit</CustomText>
      <View style={styles.sessionsElContainer}>
        <View style={styles.lineItem}>
          <CustomText style={styles.text}>Silo {sessionInfo.lockId}</CustomText>
          <CustomText style={styles.text}>
            {`${moment.utc(sessionInfo.timeCreated).local().format('h:mm A')} - ${moment
              .utc(sessionInfo.timeEnded)
              .local()
              .format('h:mm A')}`}
          </CustomText>
        </View>
      </View>
      <View style={styles.lineItem}>
        <CustomText style={styles.text}>Card used:</CustomText>
        <View style={styles.cardContainer}>
          {getCardBrandIcon(sessionInfo.cardBrand, styles.cardIcon)}
          <CustomText style={styles.text}> ····{sessionInfo.cardLast4}</CustomText>
        </View>
      </View>
      <View style={styles.lineItem}>
        <CustomText style={styles.text}>Price:</CustomText>
        <CustomText style={styles.text}>${price}</CustomText>
      </View>
      <View style={styles.lineItem}>
        <CustomText style={styles.text}>Tax:</CustomText>
        <CustomText style={styles.text}>${salesTax}</CustomText>
      </View>
      <View style={styles.lineItem}>
        <CustomText style={styles.bold}>Total:</CustomText>
        <CustomText style={styles.bold}>${total}</CustomText>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          text={didRequestReceiptSuccessfully ? 'Sent!' : 'Request Email Receipt'}
          color={brown}
          backgroundColor={cream}
          disabled={didRequestReceiptSuccessfully}
          showActivityIndicator={isRequestingReceipt}
          onPress={() => {
            onRequestPress(
              user,
              receiptData,
              setIsRequestingReceipt,
              setDidRequestReceiptSuccessfully,
            );
          }}
        />
      </View>
    </View>
  );
};






const HistoryCard = ({ sessionInfo }) => {
  const user = useSelector((state) => state.user);

  let card = null;
  if (sessionInfo.lockId) {
    card = <SiloCard sessionInfo={sessionInfo} user={user} />;
  }
  return card;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: cream,
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    width: '90%',
    borderRadius: 2,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  historyTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: brown,
  },
  historySubtitle: {
    marginBottom: 10,
    color: brown,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bold: {
    fontWeight: 'bold',
    color: brown,
  },
  sessionsElContainer: {
    marginBottom: 10,
  },
  cardIcon: {
    width: 30,
    aspectRatio: 750 / 471,
  },
  cardContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginTop: 10,
  },
  text: {
    color: brown,
  },
});

export default HistoryCard;
