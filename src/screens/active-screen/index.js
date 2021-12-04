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
import { darkGreen, eggshell, lightGreen } from '../../utilities/colors';

const ActiveScreen = () => {
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();

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
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
            data={sessions.activeSessions}
            renderItem={({ item }) => {
              return (
                <ActiveSpaceCard
                  session={item}
                  setEndModalVisibility={setEndModalVisibility}
                  setSelectedSession={setSelectedSession}
                />
              );
            }}
            keyExtractor={(item) => item.id.toString()}
            testID="list"
          />
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
    backgroundColor: darkGreen,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: eggshell,
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
    backgroundColor: lightGreen,
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
    color: darkGreen,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: darkGreen,
  },
  contentText: {
    color: darkGreen,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginVertical: 5,
  },
});

export default ActiveScreen;
