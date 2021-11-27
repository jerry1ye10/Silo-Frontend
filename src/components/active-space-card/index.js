import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomText from '../custom-text';

import moment from 'moment';

import Button from '../../components/button';
import { black, coral, darkGreen, eggshell } from '../../utilities/colors';
import { fireEndSessionNotification } from '../../utilities/notifications';
import { endSession, finishSession } from '../../redux/actions/session-actions';
import { socket } from '../../utilities/socket-connection';

export const ActiveSpaceCard = ({
  session,
  setEndModalVisibility,
  setRenewMonthlyVisibility,
  setRenewWeeklyVisiblity,
  setSelectedSession,
  setMonthlyOvertime,
  setWeeklyOvertime,
}) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const startMoment = moment.utc(session.timeCreated);
  const startTimeWithoutSeconds = startMoment.local().format('MMM D, h:mm A');

  React.useEffect(() => {
    const confirmListener = async (data) => {
      const { lock_id: lockId, price } = data;
      if (session.lockId === lockId) {
        dispatch(endSession(session.id));
        fireEndSessionNotification(
          session.lockId,
          session.weeklyPassId,
          session.membershipId,
          price,
        );
      }
    };
    socket.on('confirm', confirmListener);
    return () => {
      socket.off('confirm', confirmListener);
    };
  }, [dispatch, session, setEndModalVisibility]);

  const onEnd = async () => {
    // Show the ending dialogue while waiting for the user perform the lock.
    setSelectedSession(session);
    setEndModalVisibility(true);
    try {
      await dispatch(finishSession(user, session));
    } catch (err) {
      setEndModalVisibility(false);
    }
  };

  const onEndPressed = async () => {
    // If this is a membership session, make sure hour balance is positive.
    if (session.membershipId != null) {
      let totalMembershipMinutes = user.membership.minutes + user.membership.guestMinutes;
      const currentMoment = moment();
      const durationInMinutes = Math.ceil(
        moment.duration(currentMoment.diff(startMoment)).asMinutes(),
      );
      if (totalMembershipMinutes < durationInMinutes) {
        setSelectedSession(session);
        setMonthlyOvertime(Math.abs(totalMembershipMinutes - durationInMinutes));
        setRenewMonthlyVisibility(true);
        return;
      }
    }
    // If this is a membership session, make sure hour balance is positive.
    if (session.weeklyPassId != null) {
      let totalWeeklyMinutes = user.dayPass.minutes;
      const currentMoment = moment();
      const durationInMinutes = Math.ceil(
        moment.duration(currentMoment.diff(startMoment)).asMinutes(),
      );
      if (totalWeeklyMinutes < durationInMinutes) {
        setSelectedSession(session);
        setWeeklyOvertime(Math.abs(totalWeeklyMinutes - durationInMinutes));
        setRenewWeeklyVisiblity(true);
        return;
      }
    }
    Alert.alert(
      'Ending Session',
      `Are you sure you want to end your session on Desk ${session.lockId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: onEnd },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <View style={styles.leftContent}>
          <CustomText
            style={styles.topLeftText}
            testID="top-left-text">{`Desk ${session.lockId}`}</CustomText>
          <CustomText style={styles.bottomLeftText} testID="bottom-left-text">
            {`Start Time: ${startTimeWithoutSeconds}`}
          </CustomText>
          {session.weeklyPassId ? (
            <CustomText style={styles.typeText}>8 Hour Pass In Use</CustomText>
          ) : null}
          {session.membershipId && session.flags === null ? (
            <CustomText style={styles.typeText}>Membership In Use</CustomText>
          ) : null}
          {session.membershipId && session.flags === 'guest' ? (
            <CustomText style={styles.typeText}>Guest Hours In Use</CustomText>
          ) : null}
        </View>
      </View>
      <View style={styles.bottomContent}>
        <Button text="Lock Desk" color={eggshell} backgroundColor={coral} onPress={onEndPressed} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: eggshell,
    width: '90%',
    borderRadius: 2,
  },
  topContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  leftContent: {
    flex: 1,
    justifyContent: 'center',
  },
  topLeftText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: black,
    marginBottom: 5,
  },
  bottomLeftText: {
    color: black,
  },
  bottomContent: {
    height: 50,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 2,
  },
  typeText: {
    fontWeight: 'bold',
    color: darkGreen,
    marginTop: 3,
  },
});

export default ActiveSpaceCard;
