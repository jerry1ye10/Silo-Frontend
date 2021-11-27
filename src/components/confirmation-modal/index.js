import React from 'react';
import {
  Alert,
  AppState,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { AppEventsLogger } from 'react-native-fbsdk-next';

import CustomText from '../custom-text';
import { darkGreen, eggshell } from '../../utilities/colors';
import { fireBeginSessionNotification } from '../../utilities/notifications';
import {
  clearSessionError,
  beginHourly,
  beginMembership,
  beginWeeklyPassWithPurchase,
  beginWeeklyPassWithoutPurchase,
} from '../../redux/actions/session-actions';
import BottomModalBase from '../bottom-modal-base';
import SelectionCard from '../selection-card';
import { getShortDateString } from '../../utilities/strings';
import Button from '../button';

const { width } = Dimensions.get('window');

const ConfirmationModal = ({
  modalVisibility,
  setModalVisibility,
  versionValid,
  lockId,
  promotionRecordId,
  baseRate,
  dayRate,
  membershipRateEffective,
  membershipRateOriginal,
  membershipCapacity,
  membershipGuestCapacity,
  promotionValue,
  resetSessionInformation,
}) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();

  let membershipCapacityEffective = user.membership.minutes || 0;
  let membershipGuestCapacityEffective = user.membership.guestMinutes || 0;
  let weeklyPassCapacityEffective = user.dayPass?.minutes || 0;
  for (const s of sessions.activeSessions) {
    const startMoment = moment.utc(s.timeCreated);
    const currentMoment = moment();
    const durationInMinutes = Math.ceil(
      moment.duration(currentMoment.diff(startMoment)).asMinutes(),
    );
    if (s.membershipId != null && s.flags === 'guest') {
      membershipGuestCapacityEffective -= durationInMinutes;
    } else if (s.membershipId != null) {
      membershipCapacityEffective -= durationInMinutes;
    } else if (s.weeklyPassId != null) {
      weeklyPassCapacityEffective -= durationInMinutes;
    }
  }

  const [selected, setSelected] = React.useState(null);
  const [selectionData, setSelectionData] = React.useState([]);
  // Keep track of the height of the confirmation modal since its height is
  // determined by an absolute element to make transitions.
  const [mHeight, setMHeight] = React.useState(0);

  // Transition to the error screen. Clear navigation params. Note
  // navigation params will be cleared in the successful case through
  // a callback on ScanScreen.
  React.useEffect(() => {
    if (sessions.sessionError !== ' ' && modalVisibility) {
      resetSessionInformation();
    }
  }, [sessions.sessionError, modalVisibility, resetSessionInformation]);

  // Make sure session error is empty when appropriate or else there will be
  // undesired overlap that will throw the modal out of sync
  React.useEffect(() => {
    // Tries to remedy camera freezing issue when exited out of the app for a while.
    const appChangeListener = AppState.addListener('appStateDidChange', (e) => {
      const { app_state: appState } = e;
      if (appState === 'active') {
        dispatch(clearSessionError());
      }
    });
    return () => {
      appChangeListener.remove();
    };
  }, [dispatch]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(clearSessionError());
    });
    return unsubscribe;
  }, [dispatch, navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(clearSessionError());
    });
    return unsubscribe;
  }, [dispatch, navigation]);

  // Is the current membership valid?
  const membershipValid = user.membership.status === 'ACTIVE';

  // Does the user have membership hours left?
  const hasMembership = membershipValid && membershipCapacityEffective > 0;

  // Does the user currently have an active membership session?
  const membershipSessions = sessions.activeSessions.filter((e) => e.membershipId).length;
  const hasOneMembershipSession = membershipValid && membershipSessions === 1;
  const hasTwoOrMoreMembershipSessions = membershipValid && membershipSessions >= 2;

  // Does the user have membership guest hours left?
  const hasGuestHours = membershipValid && membershipGuestCapacityEffective > 0;

  // Does the user currently have an active guest session?
  const hasActiveGuestSession =
    membershipValid &&
    !(sessions.activeSessions.find((e) => e.membershipId && e.flags === 'guest') == null);

  // Does the user have a day pass?
  const hasDayPass = user.dayPass?.status === 'ACTIVE';

  // Does the user currently have an active day pass session?
  const hasActiveDayPassSession =
    hasDayPass && !(sessions.activeSessions.find((e) => e.weeklyPassId) == null);

  // Takes the hourly, daily, guest, and membership elements and sorts them by priority.
  const sortEls = (hourlyEl, dailyEl, guestEl, membershipEl) => {
    const els = [];
    if (hourlyEl != null) {
      els.push(hourlyEl);
    }
    if (dailyEl != null) {
      els.push(dailyEl);
    }
    if (guestEl != null) {
      els.push(guestEl);
    }
    if (membershipEl != null) {
      els.push(membershipEl);
    }
    els.sort((e1, e2) => e1.priority > e2.priority);
    return els;
  };

  const setupMembership = () => {
    const hourlyNormal = {
      id: 'HOURLY',
      title: 'Hourly',
      subtext: 'A flat hourly rate',
      subtextColor: 'black',
      price: `$${baseRate / 100}`,
      priceColor: 'black',
      priority: 3,
      discountedPrice: promotionValue
        ? `$${Math.round((baseRate * (100 - promotionValue)) / 100) / 100}`
        : null,
      priceText: 'per hour',
      image: require('../../../assets/desk.png'),
      disabled: false,
    };

    const dayPassNormal = {
      id: 'DAY_PASS',
      title: '8 Hour Pass',
      subtext: 'Valid for one week',
      subtextColor: 'black',
      price: `$${dayRate / 100}`,
      priceColor: 'black',
      priority: 4,
      discountedPrice: promotionValue
        ? `$${Math.round((dayRate * (100 - promotionValue)) / 100) / 100}`
        : null,
      priceText: 'does not renew',
      image: require('../../../assets/ticket.png'),
      disabled: false,
    };

    const dayPassDisabled = {
      id: 'DAY_PASS_DISABLED',
      title: 'Day Pass',
      subtext: `Expires on ${getShortDateString(user.dayPass?.expiration)}`,
      subtextColor: 'black',
      price: 'IN USE',
      priority: 6,
      priceColor: 'gray',
      discountedPrice: null,
      priceText: `${(weeklyPassCapacityEffective / 60).toFixed(1)} Hours Left`,
      image: require('../../../assets/ticket-gray.png'),
      disabled: true,
    };

    const dayPassActive = {
      id: 'DAY_PASS_ACTIVE',
      title: 'Day Pass',
      subtext: `Expires on ${getShortDateString(user.dayPass?.expiration)}`,
      subtextColor: 'black',
      price: 'NO CHARGE',
      priceColor: darkGreen,
      priority: 0,
      discountedPrice: null,
      priceText: `${(weeklyPassCapacityEffective / 60).toFixed(1)} Hours Left`,
      image: require('../../../assets/ticket.png'),
      disabled: false,
    };

    const membershipNormal = {
      id: 'MEMBERSHIP',
      title: 'Membership',
      subtextColor: 'black',
      subtext: '50 or 100 hour options',
      price: `from $${membershipRateOriginal / 100}`,
      priceColor: 'black',
      priority: 5,
      discountedPrice: null,
      priceText: 'per month',
      image: require('../../../assets/membership-transparent.png'),
      disabled: false,
    };

    const membershipDisabled = {
      id: 'MEMBERSHIP_DISABLED',
      title: 'Membership',
      subtext: 'Maximum desks reached',
      subtextColor: 'black',
      price: 'IN USE',
      priceColor: 'gray',
      priority: 7,
      discountedPrice: null,
      priceText: `${(membershipCapacityEffective / 60).toFixed(1)} Hours Left`,
      image: require('../../../assets/membership-gray.png'),
      disabled: true,
    };

    const membershipActive = {
      id: 'MEMBERSHIP_ACTIVE',
      title: 'Membership',
      subtext: 'Available for use',
      subtextColor: 'black',
      price: 'NO CHARGE',
      priceColor: darkGreen,
      priority: 1,
      discountedPrice: null,
      priceText: `${(membershipCapacityEffective / 60).toFixed(1)} Hours Left`,
      image: require('../../../assets/membership-transparent.png'),
      disabled: false,
    };

    const guestActive = {
      id: 'GUEST',
      title: 'Guest Hours',
      subtext: 'Available for use',
      subtextColor: 'black',
      price: 'NO CHARGE',
      priceColor: darkGreen,
      priority: 2,
      discountedPrice: null,
      priceText: `${(membershipGuestCapacityEffective / 60).toFixed(1)} Hours Left`,
      image: require('../../../assets/friends.png'),
      disabled: false,
    };

    const guestDisabledNotInUse = {
      id: 'GUEST_DISABLED_NOT_IN_USE',
      title: 'Guest Hours',
      subtext: 'Unlock a desk to use',
      subtextColor: 'black',
      price: 'NOT IN USE',
      priceColor: 'gray',
      priority: 8,
      color: 'gray',
      discountedPrice: null,
      priceText: `${(membershipGuestCapacityEffective / 60).toFixed(1)} Hours Left`,
      image: require('../../../assets/friends-gray.png'),
      disabled: true,
    };

    const guestDisabledInUse = {
      id: 'GUEST_DISABLED_IN_USE',
      title: 'Guest Hours',
      subtext: 'Already in use',
      subtextColor: 'black',
      price: 'IN USE',
      priceColor: 'gray',
      priority: 9,
      color: 'gray',
      discountedPrice: null,
      priceText: `${(membershipGuestCapacityEffective / 60).toFixed(1)} Hours Left`,
      image: require('../../../assets/friends-gray.png'),
      disabled: true,
    };
    // Configure the hourly element.
    let hourlyEl = hourlyNormal;

    // Configure the daily element.
    let dailyEl = null;
    if (hasDayPass && hasActiveDayPassSession) {
      dailyEl = dayPassDisabled;
    } else if (hasDayPass && !hasActiveDayPassSession) {
      dailyEl = dayPassActive;
    } else {
      dailyEl = dayPassNormal;
    }

    // Configure the guest hour element.
    let guestEl = null;
    if (hasGuestHours && hasActiveGuestSession) {
      guestEl = guestDisabledInUse;
    } else if (hasOneMembershipSession && hasGuestHours && !hasActiveGuestSession) {
      guestEl = guestActive;
    } else if (
      !hasOneMembershipSession &&
      !hasTwoOrMoreMembershipSessions &&
      !hasMembership &&
      hasGuestHours &&
      !hasActiveGuestSession
    ) {
      guestEl = guestActive;
    } else if (
      !hasOneMembershipSession &&
      !hasTwoOrMoreMembershipSessions &&
      hasGuestHours &&
      !hasActiveGuestSession
    ) {
      guestEl = guestDisabledNotInUse;
    }

    // Configure the membership element.
    let membershipEl = null;
    if (hasMembership && hasTwoOrMoreMembershipSessions) {
      membershipEl = membershipDisabled;
    } else if (hasMembership && !hasTwoOrMoreMembershipSessions) {
      membershipEl = membershipActive;
    } else {
      membershipEl = membershipNormal;
    }

    const els = sortEls(hourlyEl, dailyEl, guestEl, membershipEl);
    setSelectionData(els);
    setSelected(els[0].id);
  };

  const afterSessionCreationSucceeded = () => {
    setModalVisibility(false);
    resetSessionInformation();
    navigation.navigate('ActiveScreen');
    fireBeginSessionNotification(lockId);
  };

  const purchaseButtonPressed = () => {
    if (selected === 'HOURLY') {
      dispatch(
        beginHourly(
          lockId,
          promotionRecordId,
          () => {
            setModalVisibility(false);
            const sessionInformation = { lockId, baseRate, promotionRecordId, promotionValue };
            navigation.navigate('PaymentsScreen', { sessionInformation });
          },
          () => {
            afterSessionCreationSucceeded();
            AppEventsLogger.logPurchase(baseRate / 100, 'USD');
          },
        ),
      );
    } else if (selected === 'DAY_PASS') {
      dispatch(
        beginWeeklyPassWithPurchase(
          lockId,
          promotionRecordId,
          () => {
            setModalVisibility(false);
            const sessionInformation = { lockId, baseRate, dayRate, promotionRecordId };
            navigation.navigate('PaymentsScreen', { sessionInformation });
          },
          () => {
            afterSessionCreationSucceeded();
            AppEventsLogger.logPurchase(dayRate / 100, 'USD');
          },
        ),
      );
    } else if (selected === 'DAY_PASS_ACTIVE') {
      Alert.alert(
        'Pass Hours Low',
        'If you stay longer than the number of hours you have left, you agree to be charged an additional $5 for every extra hour.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: () => {
              dispatch(beginWeeklyPassWithoutPurchase(lockId, afterSessionCreationSucceeded));
            },
          },
        ],
      );
    } else if (selected === 'MEMBERSHIP') {
      navigation.navigate('MembershipScreen');
    } else if (selected === 'MEMBERSHIP_ACTIVE') {
      // Promprt alert if less than 10 hours in total.
      if (membershipCapacityEffective + membershipGuestCapacityEffective < 600) {
        Alert.alert(
          'Membership Hours Low',
          'If you stay longer than the number of hours you have left, you agree to be charged an additional $3 for every extra hour.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Confirm',
              onPress: () => {
                dispatch(beginMembership(lockId, afterSessionCreationSucceeded));
              },
            },
          ],
        );
      } else {
        dispatch(beginMembership(lockId, afterSessionCreationSucceeded));
      }
    } else if (selected === 'GUEST') {
      // Promprt alert if less than 10 hours in total.
      if (membershipCapacityEffective + membershipGuestCapacityEffective < 600) {
        Alert.alert(
          'Membership Hours Low',
          'If you stay longer than the number of hours you have left, you agree to be charged an additional $3 for every extra hour.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Confirm',
              onPress: () => {
                dispatch(beginMembership(lockId, afterSessionCreationSucceeded, 'guest'));
              },
            },
          ],
        );
      } else {
        dispatch(beginMembership(lockId, afterSessionCreationSucceeded, 'guest'));
      }
    }
  };

  const initialView = (
    <View
      style={initialStyles.container}
      onLayout={(e) => {
        setMHeight(e.nativeEvent.layout.height);
      }}>
      <FlatList
        data={selectionData}
        style={initialStyles.selectionList}
        renderItem={({ item }) => {
          return (
            <SelectionCard
              id={item.id}
              title={item.title}
              subtext={item.subtext}
              price={item.price}
              priceColor={item.priceColor}
              discountedPrice={item.discountedPrice}
              priceText={item.priceText}
              image={item.image}
              disabled={item.disabled}
              selected={selected}
              setSelected={setSelected}
              subtextColor={item.subtextColor}
            />
          );
        }}
        scrollEnabled={false}
        keyExtractor={(_, index) => index.toString()}
      />
      <CustomText style={styles.errorText}>{sessions.sessionError}</CustomText>
      <Button
        text={`Unlock Desk ${lockId}`}
        color={eggshell}
        backgroundColor={darkGreen}
        showActivityIndicator={sessions.isAddingSession && modalVisibility}
        disabled={sessions.isAddingSession && modalVisibility}
        onPress={purchaseButtonPressed}
      />
    </View>
  );

  const outOfDateView = (
    <View style={oodStyles.container}>
      <CustomText style={styles.modalHeaderText}>App Out of Date</CustomText>
      <View style={oodStyles.space} />
      <CustomText style={styles.modalDetailText}>
        The current version of your app is out of date.
      </CustomText>
      <CustomText style={styles.modalDetailText}>Please update your app to continue.</CustomText>
      <TouchableOpacity
        style={oodStyles.dismissButton}
        onPress={() => {
          setModalVisibility(false);
        }}>
        <CustomText style={oodStyles.dismissButtonText}>DISMISS</CustomText>
      </TouchableOpacity>
    </View>
  );

  return (
    <BottomModalBase
      modalVisibility={modalVisibility}
      setModalVisibility={setModalVisibility}
      position="center"
      canDismiss={!(sessions.isAddingSession && modalVisibility)}
      onModalHide={() => {
        dispatch(clearSessionError());
      }}
      onModalWillShow={() => {
        setupMembership();
      }}>
      {versionValid ? (
        <View style={{ ...styles.wrapper, height: mHeight + 40 }}>{initialView}</View>
      ) : (
        <View style={oodStyles.oodWrapper}>{outOfDateView}</View>
      )}
    </BottomModalBase>
  );
};

const styles = StyleSheet.create({
  modalHeaderText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  modalDetailText: {
    fontSize: 16,
  },
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

const initialStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionList: {
    width: '100%',
    flexGrow: 0,
    marginBottom: 20,
  },
});

const oodStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  space: {
    height: 15,
  },
  dismissButton: {
    paddingVertical: 10,
    width: '90%',
    marginTop: 15,
  },
  dismissButtonText: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
  oodWrapper: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
});
export default ConfirmationModal;
