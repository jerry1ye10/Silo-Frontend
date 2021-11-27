import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { AppEventsLogger } from 'react-native-fbsdk-next';

import CustomText from '../../../components/custom-text';
import Button from '../../../components/button';
import { black, coral, darkGreen, eggshell } from '../../../utilities/colors';
import { getShortDateString } from '../../../utilities/strings';

import moment from 'moment';
import { purchaseMembership } from '../../../redux/actions/user-actions';

const CurrentMembershipScreen = ({ membershipOptions }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();

  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [didPurchaseFail, setDidPurchaseFail] = React.useState(false);
  const [minutes, setMinutes] = React.useState(user.membership.minutes);
  const [guestMinutes, setGuestMinutes] = React.useState(user.membership.guestMinutes);

  const warningThreshold = 900;
  const hh = (Math.abs(minutes) - (Math.abs(minutes) % 60)) / 60;
  const mm = Math.abs(minutes) % 60;
  const guestHH = (Math.abs(guestMinutes) - (Math.abs(guestMinutes) % 60)) / 60;
  const guestMM = Math.abs(guestMinutes) % 60;
  const timeString =
    minutes >= 0 ? `${hh} Hours and ${mm} Minutes` : `-${hh} Hours and ${mm} Minutes`;
  const guestTimeString =
    guestMinutes >= 0
      ? `${guestHH} Hours and ${guestMM} Minutes`
      : `-${guestHH} Hours and ${guestMM} Minutes`;
  const roomTimeString =
    user.membership.roomCredits === 1 ? '1 Hour' : `${user.membership.roomCredits} Hours`;

  // When the user membership changes (i.e when a membership is purchased), recalculate
  // the effective balance for the user.
  React.useEffect(() => {
    let totalMinutes = user.membership.minutes;
    let totalGuestMinutes = user.membership.guestMinutes;
    for (const s of sessions.activeSessions) {
      if (s.membershipId != null) {
        const startMoment = moment.utc(s.timeCreated);
        const currentMoment = moment();
        const durationInMinutes = Math.ceil(
          moment.duration(currentMoment.diff(startMoment)).asMinutes(),
        );
        if (s.flags === 'guest') {
          totalGuestMinutes -= durationInMinutes;
        } else {
          totalMinutes -= durationInMinutes;
        }
      }
    }
    setMinutes(totalMinutes);
    setGuestMinutes(totalGuestMinutes);
  }, [user.membership, sessions.activeSessions]);

  const expirationString = getShortDateString(user.membership.expirationDate);
  const renewsToIndex = membershipOptions.findIndex((el) => el.id === user.membership.shouldRenew);
  const renewsToString =
    renewsToIndex === -1 ? 'Will Not Renew' : membershipOptions[renewsToIndex].name;

  const onRenewalPress = () => {
    Alert.alert(
      'Renewing Monthly Membership',
      'Are you sure you want to renew your monthly membership?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: onRenewalAlertConfirm },
      ],
    );
  };

  const onRenewalAlertConfirm = async () => {
    try {
      setIsPurchasing(true);
      await dispatch(
        purchaseMembership(
          user.membership.shouldRenew,
          () => {
            navigation.navigate('PaymentsScreen');
          },
          () => {
            navigation.navigate('MembershipScreen');
            AppEventsLogger.logPurchase(membershipOptions[renewsToIndex].price / 100, 'USD');
          },
        ),
      );
    } catch (err) {
      setDidPurchaseFail(true);
      setIsPurchasing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <CustomText style={styles.topText}>{user.membership.membershipName}</CustomText>
        <View style={styles.summaryView}>
          <View style={styles.lineItem}>
            <CustomText style={styles.headerText}>Hours Remaining: </CustomText>
            <CustomText style={styles.contentText}>{timeString}</CustomText>
          </View>
          {user.membership.guestMinutes !== 0 ? (
            <View style={styles.lineItem}>
              <CustomText style={styles.headerText}>Guest Hours: </CustomText>
              <CustomText style={styles.contentText}>{guestTimeString}</CustomText>
            </View>
          ) : null}
          <View style={styles.lineItem}>
            <CustomText style={styles.headerText}>Private Room Hours: </CustomText>
            <CustomText style={styles.contentText}>{roomTimeString}</CustomText>
          </View>
          <View style={styles.divider} />
          <View style={styles.lineItem}>
            <CustomText style={styles.headerText}>Expires On: </CustomText>
            <CustomText style={styles.contentText}>{expirationString}</CustomText>
          </View>
          <View style={styles.lineItem}>
            <CustomText style={styles.headerText}>Renews To: </CustomText>
            <CustomText style={styles.contentText}>{renewsToString}</CustomText>
          </View>
          <View style={styles.space} />
          <Button
            text="Manage Membership"
            color={eggshell}
            backgroundColor={darkGreen}
            onPress={() => {
              navigation.navigate('MembershipDecisionScreen');
            }}
          />
        </View>
        {!user.membership.shouldRenew ? (
          <CustomText style={styles.disclaimerText}>
            Your membership will not renew and your hours will expire after the expiration date.
          </CustomText>
        ) : null}
      </View>

      {minutes <= warningThreshold ? (
        <View style={styles.bottomView}>
          {didPurchaseFail ? (
            <CustomText style={styles.errorText}>
              Your purchased failed. Please update your payment method and try again.
            </CustomText>
          ) : (
            <>
              <CustomText style={styles.warnText}>You are running low on hours.</CustomText>
              <CustomText style={styles.renewText}>
                Renewing your membership early will immediately credit you with additional hours and
                guest hours.
              </CustomText>
            </>
          )}
          <Button
            color={eggshell}
            backgroundColor={coral}
            text={'Renew Early'}
            onPress={onRenewalPress}
            disabled={user.membership.shouldRenew === 0 || isPurchasing}
            showActivityIndicator={isPurchasing}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkGreen,
    padding: 20,
    justifyContent: 'space-between',
  },
  topText: {
    color: eggshell,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryView: {
    backgroundColor: eggshell,
    padding: 20,
    marginBottom: 10,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  divider: {
    borderColor: 'lightgray',
    borderWidth: 0.5,
    width: '30%',
    marginVertical: 10,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: black,
  },
  contentText: {
    color: darkGreen,
    fontWeight: 'bold',
  },
  disclaimerText: {
    color: eggshell,
    marginTop: 10,
  },
  bottomView: {
    marginBottom: 20,
  },
  warnText: {
    color: eggshell,
    fontWeight: 'bold',
  },
  renewText: {
    color: eggshell,
    marginBottom: 10,
  },
  errorText: {
    color: eggshell,
    marginBottom: 10,
  },
  space: {
    height: 20,
  },
});

export default CurrentMembershipScreen;
