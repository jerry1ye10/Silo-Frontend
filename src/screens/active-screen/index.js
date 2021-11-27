import React from 'react';
import { Alert, AppState, FlatList, StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import minotaur from '../../api/minotaur';
import ActiveSpaceCard from '../../components/active-space-card';
import EndSessionModal from '../../components/end-session-modal';
import RenewMembershipModal from '../../components/renew-membership-modal';
import RenewWeeklyPassModal from '../../components/renew-weekly-pass-modal';
import { getWeeklyPass } from '../../redux/actions/user-actions';
import {
  getActiveSessions,
  purchaseWeeklyPass,
  clearSessionError,
} from '../../redux/actions/session-actions';
import CustomText from '../../components/custom-text';
import { darkGreen, eggshell, lightGreen } from '../../utilities/colors';
import { getShortDateString } from '../../utilities/strings';
import Button from '../../components/button';

const ActiveScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const sessions = useSelector((state) => state.sessions);
  const promotions = useSelector((state) => state.promotions);
  const dispatch = useDispatch();

  const [minutes, setMinutes] = React.useState(0);
  const [endModalVisibility, setEndModalVisibility] = React.useState(false);
  const [renewMonthlyVisibility, setRenewMonthlyVisibility] = React.useState(false);
  const [renewWeeklyVisibility, setRenewWeeklyVisibility] = React.useState(false);
  const [selectedSession, setSelectedSession] = React.useState(null);
  const [monthlyOvertime, setMonthlyOvertime] = React.useState(0);
  const [weeklyOvertime, setWeeklyOvertime] = React.useState(0);

  const hh = (Math.abs(minutes) - (Math.abs(minutes) % 60)) / 60;
  const mm = Math.abs(minutes) % 60;
  const timeString =
    minutes >= 0 ? `${hh} Hours and ${mm} Minutes` : `-${hh} Hours and ${mm} Minutes`;

  React.useEffect(() => {
    dispatch(getActiveSessions());
    dispatch(getWeeklyPass());
  }, [dispatch]);

  React.useEffect(() => {
    // Refreshes sessions if app was moved to the background.
    const appChangeListener = AppState.addListener('appStateDidChange', (e) => {
      const { app_state: appState } = e;
      if (appState === 'active') {
        setEndModalVisibility(false);
        setRenewMonthlyVisibility(false);
        setRenewWeeklyVisibility(false);
        dispatch(getActiveSessions());
        dispatch(getWeeklyPass());
      }
    });
    return () => {
      appChangeListener.remove();
    };
  }, [dispatch]);

  // Check for day pass updates on focus.
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getActiveSessions());
      dispatch(getWeeklyPass());
      dispatch(clearSessionError());
    });
    return unsubscribe;
  }, [dispatch, navigation]);

  React.useEffect(() => {
    if (user.dayPass?.status === 'ACTIVE') {
      let totalMinutes = user.dayPass.minutes;
      for (const s of sessions.activeSessions) {
        if (s.weeklyPassId != null) {
          const startMoment = moment.utc(s.timeCreated);
          const currentMoment = moment();
          const durationInMinutes = Math.ceil(
            moment.duration(currentMoment.diff(startMoment)).asMinutes(),
          );
          totalMinutes -= durationInMinutes;
        }
      }
      setMinutes(totalMinutes);
    }
  }, [user.dayPass, sessions.activeSessions]);

  return (
    <>
      <View style={styles.container}>
        {user.dayPass.status === 'ACTIVE' ? (
          <View style={styles.summaryView}>
            <CustomText style={styles.summaryTitle}>8 Hour Pass</CustomText>
            <View style={styles.lineItem}>
              <CustomText style={styles.headerText}>Time Remaining: </CustomText>
              <CustomText style={styles.contentText}>{timeString}</CustomText>
            </View>
            <View style={styles.lineItem}>
              <CustomText style={styles.headerText}>Expires On: </CustomText>
              <CustomText style={styles.contentText}>
                {getShortDateString(user.dayPass.expirationDate)}
              </CustomText>
            </View>
            <CustomText style={styles.errorText}>{sessions.sessionError}</CustomText>
            <Button
              text="Add Time"
              color={eggshell}
              backgroundColor={darkGreen}
              disabled={sessions.isAddingSession}
              showActivityIndicator={sessions.isAddingSession}
              onPress={async () => {
                const response = await minotaur.get('/constants/RATES');
                let rate = JSON.parse(response.data.value).day_rate;
                let promotionId = null;
                if (promotions.activePromotions.length > 0) {
                  promotionId = promotions.activePromotions[0].id;
                  rate = ((100 - promotions.activePromotions[0].promotionValue) * rate) / 100;
                }
                Alert.alert(
                  'Purchasing 8 Hour Pass',
                  `Would you like to purchase another 8 Hour Pass for $${(rate / 100).toFixed(2)}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Confirm',
                      onPress: () => {
                        dispatch(
                          purchaseWeeklyPass(
                            promotionId,
                            () => {
                              navigation.navigate('PaymentsScreen');
                            },
                            () => {
                              dispatch(getActiveSessions());
                              dispatch(getWeeklyPass());
                            },
                          ),
                        );
                      },
                    },
                  ],
                );
              }}
            />
          </View>
        ) : null}
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
                  setRenewMonthlyVisibility={setRenewMonthlyVisibility}
                  setRenewWeeklyVisiblity={setRenewWeeklyVisibility}
                  setSelectedSession={setSelectedSession}
                  setMonthlyOvertime={setMonthlyOvertime}
                  setWeeklyOvertime={setWeeklyOvertime}
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
      <RenewMembershipModal
        session={selectedSession}
        modalVisibility={renewMonthlyVisibility}
        setModalVisibility={setRenewMonthlyVisibility}
        setEndModalVisibility={setEndModalVisibility}
        totalMinutesExceeded={monthlyOvertime}
      />
      <RenewWeeklyPassModal
        session={selectedSession}
        modalVisibility={renewWeeklyVisibility}
        setModalVisibility={setRenewWeeklyVisibility}
        setEndModalVisibility={setEndModalVisibility}
        totalMinutesExceeded={weeklyOvertime}
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
