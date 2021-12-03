import React from 'react';
import { StyleSheet, View, Platform, AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import semver from 'semver';

import ConfirmationModal from '../../components/confirmation-modal';
import QRScanner from '../../components/qr-scanner';
import CameraPermissionModal from '../../components/camera-permission-modal';
import ScanOverlay from '../../components/scan-overlay';
import minotaur from '../../api/minotaur';
import { beginSession } from '../../redux/actions/session-actions';
import { fireBeginSessionNotification } from '../../utilities/notifications';

const ScanScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Reference to camera that needs to be manipulated to deactivate when not
  // needed.
  const [shouldReactivate, setShouldReactivate] = React.useState(false);

  // Controls the visibility of the confirmation modal.
  const [confModalVisibility, setConfModalVisibility] = React.useState(true); //TODO set to false, true for debug

  // Determines whether the screen is currently in focus to disable QR
  // scanner from activating in the background. This state cannot be avoided
  // because of the inability to deactivate the camera on willBlur.
  const [screenFocus, setScreenFocus] = React.useState(true);

  // State to see if camera is enabled via permissions.
  const [cameraEnabled, setCameraEnabled] = React.useState(false);

  // Sets the visiblity of the camera permissions modal if camera is disabled.
  const [permissionModalVisibility, setPermissionModalVisibility] = React.useState(false);

  // Determines whether the app is out of date. Fed into the confirmation modal
  // to prompt user to update app accordingly. The check is made when a
  // successful scan is made.
  const [versionValid, setVersionValid] = React.useState(true);

  // State that contains session information.
  const [lockId, setLockId] = React.useState(null);
  const [rates, setRates] = React.useState({
    baseRate: null,
    promotion: null,
  });

  // Grabs session information if was redirected from the payments page.
  const sessionInformation = route.params ? route.params.sessionInformation : null;
  const prevLockId = sessionInformation ? sessionInformation.lockId : null;
  const prevBaseRate = sessionInformation ? sessionInformation.baseRate : null;

  const prevPromotionRecordId = sessionInformation ? sessionInformation.promotionRecordId : null;
  const prevPromotionalValue = sessionInformation ? sessionInformation.promotionalValue : null;

  // If the camera is not enabled, display a different page.
  const checkPermissions = async () => {
    try {
      let response;
      if (Platform.OS === 'ios') {
        response = await request(PERMISSIONS.IOS.CAMERA);
      } else if (Platform.OS === 'android') {
        response = await request(PERMISSIONS.ANDROID.CAMERA);
      }
      if (response === RESULTS.GRANTED) {
        setCameraEnabled(true);
      } else {
        setPermissionModalVisibility(true);
      }
    } catch (err) {
      setPermissionModalVisibility(true);
    }
  };


  React.useEffect(() => {
    // Refreshes sessions if app was moved to the background.
  }, [dispatch]);

  React.useEffect(() => {
  }, [dispatch, navigation]);

  React.useEffect(() => {
    if (screenFocus) {
      checkPermissions();
    }
  }, [screenFocus]);

  React.useEffect(() => {
    const next = () => {
      route.params.sessionInformation = null;
      setConfModalVisibility(false);
      navigation.navigate('ActiveScreen');
      fireBeginSessionNotification(lockId);
    };

    if (sessionInformation) {
      setConfModalVisibility(true);
      if (!prevDayRate) {
        dispatch(beginSession(prevLockId, prevPromotionRecordId, null, next));
      }
    }
  }, [sessionInformation]);

  // Reactivate when modal is dismissed and when current screen is the focused
  // screen.
  React.useEffect(() => {
    if (!confModalVisibility && screenFocus) {
      const millisecondsOfDelay = 1000;
      setTimeout(() => {
        setShouldReactivate(true);
      }, millisecondsOfDelay);
    }
  }, [confModalVisibility, screenFocus]);

  // Set focus state on willFocus and willBlur. Make sure that the confirmation
  // and navigation modals are disabled on these events.
  React.useEffect(() => {
    // Tries to remedy camera freezing issue when exited out of the app for a while.
    const appChangeListener = AppState.addListener('appStateDidChange', (e) => {
      const { app_state: appState } = e;
      if (appState === 'active') {
        setShouldReactivate(true);
      }
    });
    return () => {
      appChangeListener.remove();
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setScreenFocus(true);
      setConfModalVisibility(false);
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setScreenFocus(false);
      setConfModalVisibility(false);
    });
    return unsubscribe;
  }, [navigation]);

  const getRates = async () => {
    try {
      const rateResponse = await minotaur.get('/constants/RATES');
      const ratesRef = JSON.parse(rateResponse.data.value);
      const promotionsReponse = await minotaur.get('/promotion-records');
      const promotions = promotionsReponse.data;
      setRates({
        baseRate: ratesRef.base_rate,
        promotion: promotions.length === 0 ? null : promotions[0],
      });
    } catch (err) {
      return;
    }
  };

  // Function executed when QR scan is successful. Shows the confirmation modal.
  const onScanSuccess = async (e) => {
    // Screen has to be focused since the camera can be active in the background.
    if (screenFocus) {
      try {
        // First make a check to the version to make sure the app is up to date.
        if (Platform.OS === 'ios') {
          const versionResponse = await minotaur.get('/constants/MIN_VERSION_IOS');
          if (semver.lt(DeviceInfo.getVersion(), versionResponse.data.value)) {
            setVersionValid(false);
          }
        } else if (Platform.OS === 'android') {
          const versionResponse = await minotaur.get('/constants/MIN_VERSION_ANDROID');
          if (semver.lt(DeviceInfo.getVersion(), versionResponse.data.value)) {
            setVersionValid(false);
          }
        }
        const codeContents = JSON.parse(e.data);
        setLockId(codeContents.id);
        await getRates();
      } catch (err) {
        return;
      }
    }
  };

  React.useEffect(() => {
    if (
      rates.baseRate
    ) {
      setConfModalVisibility(true);
    }
  }, [rates]);

  const cameraDisabledScreen = (
    <View style={disabledStyles.container}>
      <ScanOverlay headerText="ENABLE CAMERA IN SETTINGS TO START" />
      <CameraPermissionModal
        modalVisibility={permissionModalVisibility}
        setModalVisibility={setPermissionModalVisibility}
      />
    </View>
  );

  const cameraEnabledScreen = (
    <View style={enabledStyles.container}>
      <QRScanner
        shouldReactivate={shouldReactivate}
        setShouldReactivate={setShouldReactivate}
        onScanSuccess={onScanSuccess}
      />
      <ConfirmationModal
        modalVisibility={confModalVisibility}
        setModalVisibility={setConfModalVisibility}
        versionValid={versionValid}
        sessionInformation={sessionInformation}
        lockId={prevLockId || lockId}
        promotionRecordId={prevPromotionRecordId || (rates.promotion ? rates.promotion.id : null)}
        baseRate={prevBaseRate || rates.baseRate}
        promotionValue={
          prevPromotionalValue || (rates.promotion ? rates.promotion.promotionValue : null)
        }
        resetSessionInformation={() => {
          if (sessionInformation) {
            route.params.sessionInformation = null;
          }
        }}
      />
    </View>
  );

  return cameraEnabled ? cameraEnabledScreen : cameraDisabledScreen;
};

const enabledStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
});

const disabledStyles = StyleSheet.create({
  container: {
    backgroundColor: 'brown',
    flex: 1,
  },
});

export default ScanScreen;
