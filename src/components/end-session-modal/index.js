import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Animated, TouchableOpacity, Image, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TallModalBase from '../tall-modal-base';
import CustomText from '../custom-text';
import { deactivateLock, removeSessionEndingCompleted } from '../../redux/actions/session-actions';
import { socket } from '../../utilities/socket-connection';
import { brown, cream } from '../../utilities/colors';

const EndSessionModal = ({ session, modalVisibility, setModalVisibility }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();

  const [closeTransition, setCloseTransition] = React.useState(false);
  const [xPos] = React.useState(new Animated.Value(0));
  const [xPosFail] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    const dismissListener = (data) => {
      const { lock_id: dismissedLockId, card_id: dismissedCardId } = data;
      if (session.lockId === dismissedLockId && session.cardId === dismissedCardId) {
        setModalVisibility(false);
      }
    };
    socket.on('dismiss', dismissListener);
    return () => {
      socket.off('dismiss', dismissListener);
    };
  });

  React.useEffect(() => {
    if (sessions.sessionError === 'CARD_DECLINED' && modalVisibility) {
      Animated.timing(xPosFail, { toValue: -300, duration: 0 }).start();
    }
  }, [sessions.sessionError]);

  React.useEffect(() => {
    if (modalVisibility && sessions.sessionEndingCompleted) {
      Animated.timing(xPos, { toValue: -300, duration: 0 }).start(() => {
        setCloseTransition(true);
      });
    }
  }, [modalVisibility, sessions.sessionEndingCompleted]);

  React.useEffect(() => {
    if (closeTransition) {
      setTimeout(() => {
        setModalVisibility(false);
        setCloseTransition(false);
        dispatch(removeSessionEndingCompleted());
      }, 1000);
    }
  }, [closeTransition]);

  const pendingView = (
    <View style={pendingStyles.container}>
      <View style={pendingStyles.topContainer}>
        <TouchableOpacity
          style={pendingStyles.dismissButton}
          onPress={async () => {
            await dispatch(deactivateLock(user, session.lockId));
            setModalVisibility(false);
          }}>
          <Icon name="close" size={30} color="gray" />
        </TouchableOpacity>
      </View>
      
    </View>
  );

  const completedView = (
    <Animated.View style={[completedStyles.container, { transform: [{ translateX: xPos }] }]}>
      <View style={completedStyles.topContainer}>
        <Icon name="close" size={30} color="transparent" style={completedStyles.icon} />
        <CustomText style={completedStyles.successText}>SUCCESS!</CustomText>
        <Icon name="close" size={30} color="transparent" style={completedStyles.icon} />
      </View>
    </Animated.View>
  );

  const failedView = (
    <Animated.View style={[failedStyles.container, { transform: [{ translateX: xPosFail }] }]}>
      <View style={failedStyles.topContainer}>
        <Icon name="close" size={30} color="transparent" style={completedStyles.icon} />
        <CustomText style={failedStyles.failureText}>Card Declined</CustomText>
        <TouchableOpacity
          style={failedStyles.closeButton}
          onPress={async () => {
            setModalVisibility(false);
            navigation.navigate('PaymentsScreen');
          }}>
          <Icon name="close" size={30} color="gray" />
        </TouchableOpacity>
      </View>
      <Icon name="credit-card-off" color="black" size={120} />
      <View style={failedStyles.content}>
        <CustomText style={failedStyles.body}>
          Please re-enter your card information to finish your session.
        </CustomText>
      </View>
      <TouchableOpacity
        style={failedStyles.dismissButton}
        onPress={() => {
          setModalVisibility(false);
          navigation.navigate('PaymentsScreen');
        }}>
        <CustomText style={failedStyles.dismissButtonText}>DISMISS</CustomText>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <TallModalBase
      modalVisibility={modalVisibility}
      onModalHide={() => {
        xPos.setValue(0);
        xPosFail.setValue(0);
      }}>
      {pendingView}
      {completedView}
      {failedView}
    </TallModalBase>
  );
};

const pendingStyles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    backgroundColor: brown,
  },
  container: {
    position: 'absolute',
    left: 10,
    top: 20,
    width: 280,
    height: 400,
    alignItems: 'center',
    backgroundColor: brown,
  },
  dismissButton: {
    alignSelf: 'flex-end',
    marginRight: 5,
    marginBottom: 5,
    padding: 5,
  },
});

const completedStyles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: brown,
  },
  icon: {
    padding: 5,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  container: {
    position: 'absolute',
    left: 310,
    top: 20,
    width: 280,
    height: 400,
    alignItems: 'center',
    backgroundColor: brown,
  },
  completedImage: {
    aspectRatio: 844 / 1045,
    height: 340,
  },
  successText: {
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const failedStyles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    backgroundColor: brown,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginRight: 5,
    marginBottom: 5,
    padding: 5,
  },
  container: {
    position: 'absolute',
    left: 310,
    top: 20,
    width: 280,
    height: 400,
    alignItems: 'center',
    backgroundColor: brown,
  },
  failureText: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  body: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,
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
});

export default EndSessionModal;
