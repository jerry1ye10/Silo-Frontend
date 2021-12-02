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
import { darkGreen, eggshell,black } from '../../utilities/colors';
import { fireBeginSessionNotification } from '../../utilities/notifications';
import {
  clearSessionError,
  beginHourly,
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
  promotionValue,
  resetSessionInformation,
}) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();

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
  
  const setupMembership = () => {
    const hourlyNormal = {
      id: 'HOURLY',
      title: 'Hourly',
      subtext: 'A flat hourly rate',
      subtextColor: 'black',
      price: `$${baseRate / 100}`,
      priceColor: 'black',
      discountedPrice: promotionValue
        ? `$${Math.round((baseRate * (100 - promotionValue)) / 100) / 100}`
        : null,
      priceText: 'per hour',
      image: require('../../../assets/desk.png'),
      disabled: false,
    };
    let hourly = [hourlyNormal];

    setSelectionData(hourly);
    setSelected(hourlyNormal.id);
  };

  const afterSessionCreationSucceeded = () => {
    setModalVisibility(false);
    resetSessionInformation();
    navigation.navigate('ActiveScreen');
    fireBeginSessionNotification(lockId);
  };

  const purchaseButtonPressed = () => {
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
        color={black}
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
