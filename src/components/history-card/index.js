import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useSelector } from 'react-redux';

import CustomText from '../custom-text';
import { coral, black, eggshell } from '../../utilities/colors';
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

const HourlyCard = ({ sessionInfo, user }) => {
  const price = (sessionInfo.price / 100).toFixed(2);
  const salesTax = (sessionInfo.salesTax / 100).toFixed(2);
  const total = ((sessionInfo.price + sessionInfo.salesTax) / 100).toFixed(2);

  const [isRequestingReceipt, setIsRequestingReceipt] = React.useState(false);
  const [didRequestReceiptSuccessfully, setDidRequestReceiptSuccessfully] = React.useState(false);

  const receiptData = {
    item_name: 'Hourly Pass',
    item_purchase_time: `${getShortDateString(sessionInfo.timeCreated)}`,
    card_last4: sessionInfo.cardLast4,
    purchase_price: `$${price}`,
    purchase_tax: `$${salesTax}`,
    purchase_total: `$${total}`,
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.historyTitle}>Hourly Pass</CustomText>
      <CustomText style={styles.historySubtitle}>
        Purchased on: {moment.utc(sessionInfo.timeCreated).local().format('MM/DD/YY')}
      </CustomText>
      <CustomText style={styles.bold}>Your Visit</CustomText>
      <View style={styles.sessionsElContainer}>
        <View style={styles.lineItem}>
          <CustomText style={styles.text}>Desk {sessionInfo.lockId}</CustomText>
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
          color={eggshell}
          backgroundColor={coral}
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

const DayPassCard = ({ sessionInfo, user }) => {
  const price = (sessionInfo.price / 100).toFixed(2);
  const salesTax = (sessionInfo.salesTax / 100).toFixed(2);
  const total = ((sessionInfo.price + sessionInfo.salesTax) / 100).toFixed(2);
  const sessionsEl = [];
  for (let i = 0; i < sessionInfo.sessions.length; ++i) {
    sessionsEl.push(
      <View key={i.toString()} style={styles.lineItem}>
        <CustomText>Desk {sessionInfo.sessions[i].lockId}</CustomText>
        <CustomText>
          {moment.utc(sessionInfo.sessions[i].timeCreated).local().format('h:mm A')} -{' '}
          {moment.utc(sessionInfo.sessions[i].timeEnded).local().format('h:mm A')}
        </CustomText>
      </View>,
    );
  }

  const [isRequestingReceipt, setIsRequestingReceipt] = React.useState(false);
  const [didRequestReceiptSuccessfully, setDidRequestReceiptSuccessfully] = React.useState(false);

  const receiptData = {
    item_name: 'Day Pass',
    item_purchase_time: `${getShortDateString(sessionInfo.timeCreated)}`,
    card_last4: sessionInfo.cardLast4,
    purchase_price: `$${price}`,
    purchase_tax: `$${salesTax}`,
    purchase_total: `$${total}`,
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.historyTitle}>Day Pass</CustomText>
      <CustomText style={styles.historySubtitle}>
        Purchased on: {moment.utc(sessionInfo.timeCreated).local().format('MM/DD/YY')}
      </CustomText>
      {sessionsEl.length !== 0 ? (
        <>
          <CustomText style={styles.bold}>Your Visits</CustomText>
          <View style={styles.sessionsElContainer}>{sessionsEl}</View>
        </>
      ) : null}
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
          color={eggshell}
          backgroundColor={coral}
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

const MembershipCard = ({ sessionInfo, user }) => {
  const price = (sessionInfo.price / 100).toFixed(2);
  const salesTax = (sessionInfo.salesTax / 100).toFixed(2);
  const total = ((sessionInfo.price + sessionInfo.salesTax) / 100).toFixed(2);
  const sessionsEl = [];
  for (let i = 0; i < sessionInfo.sessions.length; ++i) {
    sessionsEl.push(
      <View key={i.toString()} style={styles.lineItem}>
        <CustomText style={styles.text}>Desk {sessionInfo.sessions[i].lockId}</CustomText>
        <CustomText style={styles.text}>
          {moment.utc(sessionInfo.sessions[i].timeCreated).local().format('MM/DD/YY')}{' '}
          {moment.utc(sessionInfo.sessions[i].timeCreated).local().format('h:mm A')} -{' '}
          {moment.utc(sessionInfo.sessions[i].timeEnded).local().format('h:mm A')}
        </CustomText>
      </View>,
    );
  }

  const [isRequestingReceipt, setIsRequestingReceipt] = React.useState(false);
  const [didRequestReceiptSuccessfully, setDidRequestReceiptSuccessfully] = React.useState(false);

  const receiptData = {
    item_name: 'Monthly Membership',
    item_purchase_time: `${getShortDateString(
      sessionInfo.timeCreated,
    )} (Valid Until: ${getShortDateString(sessionInfo.expiration)})`,
    card_last4: sessionInfo.cardLast4,
    purchase_price: `$${price}`,
    purchase_tax: `$${salesTax}`,
    purchase_total: `$${total}`,
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.historyTitle}>Monthly Membership</CustomText>
      <CustomText style={styles.historySubtitle}>
        Member from: {getShortDateString(sessionInfo.timeCreated)} -
        {getShortDateString(sessionInfo.expiration)}
      </CustomText>
      {sessionsEl.length !== 0 ? (
        <>
          <CustomText style={styles.bold}>Your Visits</CustomText>
          <View style={styles.sessionsElContainer}>{sessionsEl}</View>
        </>
      ) : null}
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
          color={eggshell}
          backgroundColor={coral}
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

const WeeklyPassCard = ({ sessionInfo, user }) => {
  const price = (sessionInfo.price / 100).toFixed(2);
  const salesTax = (sessionInfo.salesTax / 100).toFixed(2);
  const total = ((sessionInfo.price + sessionInfo.salesTax) / 100).toFixed(2);
  const sessionsEl = [];
  for (let i = 0; i < sessionInfo.sessions.length; ++i) {
    sessionsEl.push(
      <View key={i.toString()} style={styles.lineItem}>
        <CustomText style={styles.text}>Desk {sessionInfo.sessions[i].lockId}</CustomText>
        <CustomText style={styles.text}>
          {moment.utc(sessionInfo.sessions[i].timeCreated).local().format('MM/DD/YY')}{' '}
          {moment.utc(sessionInfo.sessions[i].timeCreated).local().format('h:mm A')} -{' '}
          {moment.utc(sessionInfo.sessions[i].timeEnded).local().format('h:mm A')}
        </CustomText>
      </View>,
    );
  }

  const [isRequestingReceipt, setIsRequestingReceipt] = React.useState(false);
  const [didRequestReceiptSuccessfully, setDidRequestReceiptSuccessfully] = React.useState(false);

  const receiptData = {
    item_name: '8 Hour Pass',
    item_purchase_time: `${getShortDateString(
      sessionInfo.timeCreated,
    )} (Valid Until: ${getShortDateString(sessionInfo.expiration)})`,
    card_last4: sessionInfo.cardLast4,
    purchase_price: `$${price}`,
    purchase_tax: `$${salesTax}`,
    purchase_total: `$${total}`,
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.historyTitle}>8 Hour Pass</CustomText>
      <CustomText style={styles.historySubtitle}>
        Pass valid from: {getShortDateString(sessionInfo.timeCreated)} -
        {getShortDateString(sessionInfo.expiration)}
      </CustomText>
      {sessionsEl.length !== 0 ? (
        <>
          <CustomText style={styles.bold}>Your Visits</CustomText>
          <View style={styles.sessionsElContainer}>{sessionsEl}</View>
        </>
      ) : null}
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
          color={eggshell}
          backgroundColor={coral}
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

const PrivateRoomCard = ({ sessionInfo, user }) => {
  const price = (sessionInfo.price / 100).toFixed(2);
  const salesTax = (sessionInfo.salesTax / 100).toFixed(2);
  const total = ((sessionInfo.price + sessionInfo.salesTax) / 100).toFixed(2);

  const [isRequestingReceipt, setIsRequestingReceipt] = React.useState(false);
  const [didRequestReceiptSuccessfully, setDidRequestReceiptSuccessfully] = React.useState(false);

  const receiptData = {
    item_name: 'Private Room',
    item_purchase_time: `${getShortDateString(sessionInfo.timeCreated)}`,
    card_last4: sessionInfo.cardLast4,
    purchase_price: `$${price}`,
    purchase_tax: `$${salesTax}`,
    purchase_total: `$${total}`,
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.historyTitle}>Private Room</CustomText>
      <CustomText style={styles.historySubtitle}>
        Purchased on: {moment.utc(sessionInfo.timeCreated).local().format('MM/DD/YY')}
      </CustomText>
      <CustomText style={styles.bold}>Your Visit</CustomText>
      <View style={styles.sessionsElContainer}>
        <View style={styles.lineItem}>
          <CustomText style={styles.text}>
            {`${moment.utc(sessionInfo.startTime).local().format('h:mm A')} - ${moment
              .utc(sessionInfo.endTime)
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
          color={eggshell}
          backgroundColor={coral}
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
    card = <HourlyCard sessionInfo={sessionInfo} user={user} />;
  } else if (sessionInfo.expiration && sessionInfo.version) {
    card = <MembershipCard sessionInfo={sessionInfo} user={user} />;
  } else if (sessionInfo.expiration) {
    card = <WeeklyPassCard sessionInfo={sessionInfo} user={user} />;
  } else if (sessionInfo.startTime) {
    card = <PrivateRoomCard sessionInfo={sessionInfo} user={user} />;
  } else {
    <DayPassCard sessionInfo={sessionInfo} user={user} />;
  }
  return card;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: eggshell,
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
    color: black,
  },
  historySubtitle: {
    marginBottom: 10,
    color: black,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bold: {
    fontWeight: 'bold',
    color: black,
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
    color: black,
  },
});

export default HistoryCard;
