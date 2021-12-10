import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomText from '../custom-text';

import moment from 'moment';

import Button from '../../components/button';
import { brown, cream} from '../../utilities/colors';
import { fireEndSessionNotification } from '../../utilities/notifications';
import { endSession, finishSession } from '../../redux/actions/session-actions';
import { socket } from '../../utilities/socket-connection';

export const ActiveSpaceCard = ({
  session,
  setEndModalVisibility,
  setSelectedSession,
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
    Alert.alert(
      'Ending Session',
      `Don't forget to take all belongings, trash, and clean the whiteboard before exiting. Make sure to leave the Silo before pressing lock`,
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
            testID="top-left-text">{`Silo ${session.lockId}`}</CustomText>
          <CustomText style={styles.bottomLeftText} testID="bottom-left-text">
            {`Start Time: ${startTimeWithoutSeconds}`}
          </CustomText>
        </View>
      </View>
      <View style={styles.bottomContent}>
        <Button text="Lock Silo" color={brown} backgroundColor={cream} onPress={onEndPressed} />
      </View>

      <View style={styles.bottomContent}>
        <CustomText style={styles.bottomLeftText}>
          {`Don't forget to log out when you're done or you'll continue to be charged!`}
        </CustomText>
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
    backgroundColor: cream,
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
    color: brown,
    marginBottom: 5,
  },
  bottomLeftText: {
    color: brown,
  },
  bottomContent: {
    height: 50,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 2,
  },
  typeText: {
    fontWeight: 'bold',
    color: brown,
    marginTop: 3,
  },
  bottomExtraContent: {
    
  },
});

export default ActiveSpaceCard;
