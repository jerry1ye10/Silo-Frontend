import React from 'react';
import { StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';

import CustomText from '../custom-text';
import { deletePaymentSource, selectPaymentSource } from '../../redux/actions/user-actions';
import { getCardBrandIcon } from '../../utilities/cards';
import { eggshell } from '../../utilities/colors';

const CardCard = ({ cardInfo, onSelect }) => {
  const user = useSelector((state) => state.user);
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();

  const onDeleteButtonPressed = () => {
    Alert.alert('Delete Payment Method', 'Are you sure you want to delete your payment method?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => {
          dispatch(
            deletePaymentSource(cardInfo.id, cardInfo.isDefault, user, sessions.activeSessions),
          );
        },
      },
    ]);
  };

  const leftIcon =
    user.cardBeingSelected === cardInfo.id ? (
      <ActivityIndicator style={styles.activityIndicator} size="small" />
    ) : cardInfo.isDefault ? (
      <Icon name="check" size={25} color="green" style={styles.checkIcon} />
    ) : null;

  const containerStyle = cardInfo.isLast
    ? styles.container
    : [styles.container, styles.bottomBorder];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={() => {
        dispatch(selectPaymentSource(user, cardInfo.id));
      }}
      disabled={cardInfo.isDefault === 1 || user.cardBeingSelected !== null}>
      {leftIcon}
      {getCardBrandIcon(cardInfo.brand, styles.cardIcon)}
      <CustomText style={styles.cardText}>····{cardInfo.last4}</CustomText>
      {user.cardBeingRemoved === cardInfo.id ? (
        <ActivityIndicator color="gray" size="small" />
      ) : (
        <TouchableOpacity onPress={onDeleteButtonPressed} disabled={user.cardBeingRemoved !== null}>
          <Ionicon name="md-close" size={25} color="gray" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: eggshell,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  activityIndicator: {
    marginRight: 20,
    color: 'gray',
  },
  checkIcon: {
    marginRight: 20,
  },
  cardIcon: {
    width: 45,
    aspectRatio: 750 / 471,
  },
  cardText: {
    marginLeft: 20,
    fontSize: 18,
    color: 'black',
    flex: 1,
  },
});

export default CardCard;
