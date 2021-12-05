import React from 'react';
import { AppState, FlatList, StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import minotaur from '../../api/minotaur';
import ActiveSpaceCard from '../../components/active-space-card';
import EndSessionModal from '../../components/end-session-modal';
import {
  getActiveSessions,
} from '../../redux/actions/session-actions';
import CustomText from '../../components/custom-text';
import { cream, brown, lightGreen } from '../../utilities/colors';

const sessionInfo1 = {
  cardId: 'card_1FrawOEuGNwXiyj3ciyJNOEK',
  id: '73608ba6a3a0f38d0b8d79285f93eaa04feef1a1',
  location: '262MET',
  lockId: 3,
  promotionRecordId: null,
  rate: 499,
  timeCreated: '2020-01-03 21:08:45',
  userId: '180efe93f1978bc3ffad43b256d5b32ddc0ecf99',
};

const ActiveScreen = () => {
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();
  const test = 1;

  const [minutes] = React.useState(0);
  const [endModalVisibility, setEndModalVisibility] = React.useState(false);
  const [selectedSession, setSelectedSession] = React.useState(null);

  const hh = (Math.abs(minutes) - (Math.abs(minutes) % 60)) / 60;
  const mm = Math.abs(minutes) % 60;

  React.useEffect(() => {
    dispatch(getActiveSessions());
  }, [dispatch]);

  React.useEffect(() => {
    // Refreshes sessions if app was moved to the background.
    const appChangeListener = AppState.addListener('appStateDidChange', (e) => {
      const { app_state: appState } = e;
      if (appState === 'active') {
        setEndModalVisibility(false);
        dispatch(getActiveSessions());
      }
    });
    return () => {
      appChangeListener.remove();
    };
  }, [dispatch]);

  return (
    <>
      <View style={styles.container}>
        {sessions.activeSessions.length === 0 ? (
          <CustomText style={styles.emptyText}>You have no active spaces.</CustomText>
        ) : (
          <View style={styles.container}> 
            <ActiveSpaceCard
              session={sessions.activeSessions} 
              setEndModalVisibility={setEndModalVisibility}
              setSelectedSession={setSelectedSession}

            />
            <View style={styles.extraContainer}>
            <CustomText style={styles.contentText}>To get wifi, show the barista your Silo app and receive a receipt with the code, good for 2 hours. If you're still using Silo in 2 hours, just show them the app to get a new code.</CustomText>
            </View>
          </View>
        )}
      </View>
      <EndSessionModal
        session={selectedSession}
        modalVisibility={endModalVisibility}
        setModalVisibility={setEndModalVisibility}
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: brown,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: cream,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  summaryView: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: cream,
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
  summaryTitle: {
    fontSize: 16,
    color: cream,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: brown,
  },
  contentText: {
    color: brown,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginVertical: 5,
  },
  extraContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: cream,
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
  }
});

export default ActiveScreen;
