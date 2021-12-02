import React from 'react';
import {
  AppState,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import CustomText from '../../components/custom-text';
import { black, coral, darkGreen, eggshell } from '../../utilities/colors';
import { addCardError } from '../../redux/actions/user-actions';
import { getActiveSessions } from '../../redux/actions/session-actions';
import RectangleWithCornerBorders from '../rectangle-with-corner-borders';
import minotaur from '../../api/minotaur';

const MarchBanner = () => {
  return (
    <View style={bStyles.container}>
      <View style={bStyles.textContainer}>
        <View>
          <CustomText style={bStyles.text}>Your first hour completely free.</CustomText>
          <CustomText style={bStyles.bold}>Everyday.</CustomText>
        </View>
        <CustomText style={bStyles.subText}>This promotion is automatically applied</CustomText>
        <CustomText style={bStyles.subText}>for all sessions, including memberships.</CustomText>
      </View>
    </View>
  );
};

const bStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  textContainer: {
    paddingBottom: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
  },
  bold: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
  },
});

const ScanOverlay = ({ headerText }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();

  const [isUnlocking, setIsUnlocking] = React.useState(false);
  const [justUnlocked, setJustUnlocked] = React.useState(false);
  const [unlockModalVisibility, setUnlockModalVisibility] = React.useState(true);
  const [message, setMessage] = React.useState(0);
  const [showMarchPromo, setShowMarchPromo] = React.useState(false);

  const getPromo = async () => {
    try {
      const response = await minotaur.get('/constants/MARCH_MAYHEM');
      if (response.data.value === '1') {
        setShowMarchPromo(true);
      } else {
        setShowMarchPromo(false);
      }
    } catch (err) {
      setShowMarchPromo(false);
    }
  };

  React.useEffect(() => {
    // Refreshes sessions if app was moved to the background.
    const appChangeListener = AppState.addListener('appStateDidChange', (e) => {
      const { app_state: appState } = e;
      if (appState === 'active') {
        getPromo();
      }
    });
    return () => {
      appChangeListener.remove();
    };
  }, []);

  React.useEffect(() => {
    getPromo();
  }, []);

  React.useEffect(() => {
    dispatch(getActiveSessions());
  }, [dispatch]);

  React.useEffect(() => {
    if (justUnlocked) {
      setTimeout(() => {
        setJustUnlocked(false);
      }, 3000);
    }
  }, [justUnlocked]);

  const numSessions = sessions.activeSessions.length;
  const bannerStyle =
    numSessions !== 0
      ? { ...styles.banner, backgroundColor: darkGreen }
      : user.dayPass?.status === 'ACTIVE'
      ? { ...styles.banner, backgroundColor: coral }
      : { ...styles.banner };
  const bannerText =
    numSessions === 1
      ? 'You Have 1 Active Desk'
      : numSessions > 1
      ? `You Have ${numSessions} Active Desks`
      : user.dayPass?.status === 'ACTIVE'
      ? 'You Have a Pass Available'
      : null;
  const buttonTextColor = justUnlocked ? darkGreen : black;
  const buttonContent = justUnlocked ? (
    <CustomText style={{ ...styles.buttonSubText, color: buttonTextColor }}>Success!</CustomText>
  ) : isUnlocking ? (
    <ActivityIndicator />
  ) : (
    // <ActivityIndicator color={black} size={30} />
    <CustomText style={{ ...styles.buttonSubText, color: buttonTextColor }}>
      Unlock Front Door
    </CustomText>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ActiveScreen');
        }}
        style={bannerStyle}
        disabled={numSessions === 0 && user.dayPass?.status !== 'ACTIVE'}>
        <CustomText style={styles.bannerText}>{bannerText}</CustomText>
      </TouchableOpacity>
      <View style={styles.middleContainer}>
        <View style={styles.leftAndRightOverlay} />
        <RectangleWithCornerBorders />
        <View style={styles.leftAndRightOverlay} />
      </View>
      <View style={styles.footer}>
        <CustomText style={styles.footerText}>{headerText}</CustomText>
      </View>
      <View style={styles.bottomOverlay}>{showMarchPromo ? <MarchBanner /> : null}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
  },
  bannerText: {
    color: eggshell,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  topOverlay: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  lockButton: {
    backgroundColor: eggshell,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 50,
  },
  buttonSubText: {
    color: black,
    fontWeight: 'bold',
  },
  footer: {
    width: '100%',
    padding: 20,
    marginBottom: 20,
  },
  footerText: {
    color: eggshell,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: '100%',
  },
  middleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  leftAndRightOverlay: {
    flex: 1,
  },
  bottomOverlay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default ScanOverlay;
