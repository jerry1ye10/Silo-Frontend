import React from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomText from '../../components/custom-text';
import { darkGreen, eggshell } from '../../utilities/colors';
import HistoryCard from '../../components/history-card';
import { getSessionHistory } from '../../redux/actions/session-actions';

const HistoryScreen = () => {
  const user = useSelector((state) => state.user);
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getSessionHistory(user.token));
  }, [dispatch, user.token]);

  let elementOnDisplay;
  if (sessions.sessionHistoryError !== ' ') {
    elementOnDisplay = (
      <CustomText style={styles.placeholderText}>{sessions.sessionHistoryError}</CustomText>
    );
  } else if (sessions.isAddingSessionHistory) {
    elementOnDisplay = (
      <ActivityIndicator style={styles.activityIndicator} size="small" color={eggshell} />
    );
  } else if (sessions.sessionHistory.length === 0) {
    elementOnDisplay = (
      <CustomText style={styles.placeholderText}>You have no history yet!</CustomText>
    );
  } else {
    elementOnDisplay = (
      <FlatList
        style={styles.list}
        data={sessions.sessionHistory}
        renderItem={({ item }) => {
          return <HistoryCard sessionInfo={item} />;
        }}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContentContainerStyle}
      />
    );
  }

  return <View style={styles.container}>{elementOnDisplay}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkGreen,
  },
  list: {
    flex: 1,
  },
  listContentContainerStyle: {
    paddingBottom: 20,
  },
  placeholderText: {
    textAlign: 'center',
    marginTop: 20,
    color: eggshell,
  },
  activityIndicator: {
    paddingTop: 20,
  },
});

export default HistoryScreen;
