import React from 'react';
import { AppState, Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomText from '../custom-text';
import { coral, darkGreen, eggshell } from '../../utilities/colors';
import minotaur from '../../api/minotaur';
import { socket } from '../../utilities/socket-connection';

const OccupancyIndicator = () => {
  const navigation = useNavigation();

  const [count, setCount] = React.useState(0);
  const [occupancyLevels, setOccupancyLevels] = React.useState({
    level1: 8,
    level2: 15,
    level3: 34,
  });

  const getSessionInfo = async () => {
    const sessionCount = await minotaur.get('/all-sessions');
    const occupancyResponse = await minotaur.get('/constants/OCCUPANCIES');
    const occupancies = JSON.parse(occupancyResponse.data.value);
    return { sessionCount: sessionCount.data.count, occupancies };
  };

  const setStateIfMounted = (info = { isMounted: true }) => {
    getSessionInfo().then((data) => {
      if (info.isMounted) {
        setCount(data.sessionCount);
        setOccupancyLevels({
          level1: parseInt(data.occupancies.olevel1, 10),
          level2: parseInt(data.occupancies.olevel2, 10),
          level3: parseInt(data.occupancies.olevel3, 10),
        });
      }
    });
  };

  React.useEffect(() => {
    let info = { isMounted: true };
    setStateIfMounted(info);
    return () => {
      info.isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    const updateListener = (data) => {
      setCount(data.count);
    };
    socket.on('update_active_sessions', updateListener);
    return () => {
      socket.off('update_active_sessions', updateListener);
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setStateIfMounted();
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    // Refreshes sessions if app was moved to the background.
    const appChangeListener = AppState.addListener('appStateDidChange', (e) => {
      const { app_state: appState } = e;
      if (appState === 'active') {
        setStateIfMounted();
      }
    });
    return () => {
      appChangeListener.remove();
    };
  }, []);

  let text;
  let color;
  let image;
  if (count < occupancyLevels.level1) {
    text = 'Low';
    color = darkGreen;
    image = (
      <Image source={require('../../../assets/occupany-icons/level-1.png')} style={styles.image} />
    );
  } else if (count < occupancyLevels.level2) {
    text = 'Medium';
    color = eggshell;
    image = (
      <Image source={require('../../../assets/occupany-icons/level-2.png')} style={styles.image} />
    );
  } else if (count < occupancyLevels.level3) {
    text = 'Moderate';
    color = coral;
    image = (
      <Image source={require('../../../assets/occupany-icons/level-3.png')} style={styles.image} />
    );
  } else if (count >= occupancyLevels.level3) {
    text = 'Full';
    color = 'red';
    image = (
      <Image source={require('../../../assets/occupany-icons/level-4.png')} style={styles.image} />
    );
  } else {
    text = 'Low';
    color = darkGreen;
    image = (
      <Image source={require('../../../assets/occupany-icons/level-1.png')} style={styles.image} />
    );
  }

  const statusTextColorStyle = { ...styles.text, color };
  return (
    <View>
      {image}
      <View style={styles.textContainer}>
        <CustomText style={styles.text}>Occupancy: </CustomText>
        <CustomText style={statusTextColorStyle}>{text} </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  text: {
    fontWeight: 'bold',
    color: eggshell,
    alignSelf: 'flex-end',
  },
  image: {
    height: 16,
    alignSelf: 'flex-end',
    aspectRatio: 488 / 176,
    marginBottom: 2,
  },
});

export default OccupancyIndicator;
