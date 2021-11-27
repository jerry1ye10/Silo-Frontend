import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import moment from 'moment';

import minotaur from '../../../api/minotaur';
import Button from '../../../components/button';
import CustomText from '../../../components/custom-text';
import CalendarStrip from '../calendar-strip';
import { coral, darkGreen, eggshell } from '../../../utilities/colors';

const TimeSlot = ({ price, startTime, endTime, booked, setBooked, selected }) => {
  const slotStyle = selected
    ? { ...styles.slot, backgroundColor: eggshell }
    : { ...styles.slot, backgroundColor: darkGreen };
  const textStyle = selected ? { color: darkGreen, fontWeight: 'bold' } : { color: eggshell };

  const addToBookedStates = () => {
    const found = booked.find((el) => el.startTime === startTime);
    if (!found) {
      const arr = [...booked, { startTime, endTime }];
      arr.sort((a, b) => a.startTime > b.startTime);
      setBooked(arr);
    }
  };

  const removeFromBookedStates = () => {
    let arr = [...booked];
    arr = arr.filter((el) => el.startTime !== startTime);
    arr.sort((a, b) => a.startTime > b.startTime);
    setBooked(arr);
  };

  return (
    <TouchableOpacity
      style={slotStyle}
      onPress={() => {
        if (!selected) {
          addToBookedStates({ startTime, endTime });
        } else {
          removeFromBookedStates({ startTime, endTime });
        }
      }}>
      <CustomText style={textStyle}>
        {moment.utc(startTime).local().format('h:mm A')} -{' '}
        {moment.utc(endTime).local().format('h:mm A')}
      </CustomText>
      <CustomText style={textStyle}>${(price / 100).toFixed(2)}</CustomText>
    </TouchableOpacity>
  );
};

const BookingTab = ({ metadataFetched, available, dayRange }) => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = React.useState(moment());
  const [price, setPrice] = React.useState(1000);
  const [loaded, setLoaded] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [booked, setBooked] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const response = await minotaur.get('/constants/PRIVATE_ROOM_RATE');
        setPrice(response.data.value);
        setLoaded(true);
      } catch (err) {
        setLoaded(false);
      }
    };
    load();
  }, []);

  React.useEffect(() => {
    const getDates = async () => {
      try {
        const d = [];
        const start = moment(selectedDate).set({ h: 6, m: 0, s: 0, ms: 0 });
        const end = moment(selectedDate).set({ h: 22, m: 0, s: 0, ms: 0 });
        const startUtc = moment.utc(start);
        const endUtc = moment.utc(end);
        const response = await minotaur.get(
          `/all_private_room?start=${startUtc.format('YYYY-MM-DD HH:mm:ss')}&end=${endUtc.format(
            'YYYY-MM-DD HH:mm:ss',
          )}`,
        );
        const curr = moment(selectedDate).set({ h: 8, m: 0, s: 0, ms: 0 });
        const currUtc = moment.utc(curr);
        const currRef = moment.utc();
        currRef.subtract(30, 'minutes');
        for (let i = 0; i < 24; ++i) {
          const currStart = currUtc.clone();
          const alreadyBooked = response.data.find(
            (el) =>
              moment.utc(el.startTime).format('YYYY-MM-DD HH:mm:ss') ===
              currStart.format('YYYY-MM-DD HH:mm:ss'),
          );
          if (alreadyBooked) {
            currUtc.add(30, 'minutes');
            continue;
          }
          let selected = false;
          const found = booked.find(
            (el) => el.startTime === currStart.format('YYYY-MM-DD HH:mm:ss'),
          );
          if (found) {
            selected = true;
          }
          const currEnd = currUtc.clone().add(30, 'minutes');
          if (currStart > currRef) {
            d.push({
              startTime: currStart.format('YYYY-MM-DD HH:mm:ss'),
              endTime: currEnd.format('YYYY-MM-DD HH:mm:ss'),
              selected,
            });
          }
          currUtc.add(30, 'minutes');
        }
        setData(d);
      } catch (err) {
        setData([]);
      }
    };
    getDates();
  }, [selectedDate]);

  React.useEffect(() => {
    const updateBooked = async () => {
      const updatedData = [];
      for (let i = 0; i < data.length; ++i) {
        const currBooking = data[i];
        let selected = false;
        const found = booked.find((el) => el.startTime === currBooking.startTime);
        if (found) {
          selected = true;
        }
        updatedData.push({
          startTime: currBooking.startTime,
          endTime: currBooking.endTime,
          selected,
        });
      }
      setData(updatedData);
    };
    updateBooked();
  }, [booked]);

  let maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + dayRange);

  return (
    <View style={styles.tab}>
      {metadataFetched ? (
        <>
          {available ? (
            <>
              <CalendarStrip
                selectedDate={selectedDate}
                onPressDate={(date) => {
                  setSelectedDate(date);
                }}
                onPressGoToday={(today) => {
                  setSelectedDate(today);
                }}
                fontFamily="CircularStd-Book"
                minDate={new Date()}
                maxDate={maxDate}
              />
              <View style={styles.content}>
                {!loaded ? (
                  <ActivityIndicator />
                ) : (
                  <>
                    <FlatList
                      style={styles.list}
                      data={data}
                      renderItem={({ item }) => {
                        return (
                          <TimeSlot
                            price={price}
                            startTime={item.startTime}
                            endTime={item.endTime}
                            booked={booked}
                            setBooked={setBooked}
                            selected={item.selected}
                          />
                        );
                      }}
                      keyExtractor={(_, index) => index.toString()}
                    />
                    <Button
                      text="Continue"
                      color={eggshell}
                      backgroundColor={coral}
                      onPress={() => {
                        navigation.navigate('PrivateRoomDisclaimerScreen', { booked, price });
                      }}
                      disabled={booked.length === 0}
                    />
                  </>
                )}
              </View>
            </>
          ) : (
            <CustomText style={styles.placeholderText}>
              The private room is currently unavailable.
            </CustomText>
          )}
        </>
      ) : (
        <ActivityIndicator style={styles.ai} />
      )}
    </View>
  );
};

const UpcomingTab = ({ fetching, upcoming }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.tab}>
      <View style={styles.upcomingContent}>
        {fetching ? (
          <ActivityIndicator style={styles.ai} />
        ) : (
          <>
            {upcoming.length === 0 ? (
              <CustomText style={styles.placeholderText}>
                You have no upcoming reservations.
              </CustomText>
            ) : (
              <FlatList
                style={styles.list}
                data={upcoming}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.slot}>
                      <CustomText style={styles.text}>
                        {moment.utc(item.startTime).local().format('MMM Do, YYYY')}
                      </CustomText>
                      <CustomText style={styles.text}>
                        {moment.utc(item.startTime).local().format('h:mm A')} -{' '}
                        {moment.utc(item.endTime).local().format('h:mm A')}
                      </CustomText>
                    </View>
                  );
                }}
                keyExtractor={(_, index) => index.toString()}
              />
            )}
            <Button
              text="Need Help?"
              color={eggshell}
              onPress={() => {
                navigation.navigate('NeedHelpScreen');
              }}
            />
          </>
        )}
      </View>
    </View>
  );
};

const PrivateRoomScreen = ({ route }) => {
  const [tab, setTab] = React.useState(route.params && route.params.tab ? 1 : 0);
  const [fetching, setFetching] = React.useState(false);
  const [upcoming, setUpcoming] = React.useState([]);

  const [metadataFetched, setMetadataFetched] = React.useState(false);
  const [available, setAvailable] = React.useState(false);
  const [dayRange, setDayRange] = React.useState(42);

  React.useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setFetching(true);
        const response = await minotaur.get('/private_room');
        setUpcoming(response.data);
        setFetching(false);
      } catch (err) {
        setFetching(false);
        setUpcoming([]);
      }
    };
    if (tab === 1) {
      fetchUpcoming();
    }
  }, [tab]);

  React.useEffect(() => {
    const fetchMeta = async () => {
      try {
        const enabledResponse = await minotaur.get('/constants/PRIVATE_ROOM_ENABLED');
        const rangeResponse = await minotaur.get('/constants/PRIVATE_ROOM_DAY_RANGE');
        if (enabledResponse.data.value === '1') {
          setAvailable(true);
        }
        setDayRange(parseInt(rangeResponse.data.value, 10));
        setMetadataFetched(true);
      } catch (err) {
        setMetadataFetched(false);
      }
    };
    fetchMeta();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={
            tab === 0
              ? { ...styles.tabBarLeft, ...styles.selectedContainerStyle }
              : styles.tabBarLeft
          }
          onPress={() => {
            setTab(0);
          }}>
          <CustomText style={tab === 0 ? styles.text : styles.unselectedText}>Book</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            tab === 1
              ? { ...styles.tabBarRight, ...styles.selectedContainerStyle }
              : styles.tabBarRight
          }
          onPress={() => {
            setTab(1);
          }}>
          <CustomText style={tab === 1 ? styles.text : styles.unselectedText}>Upcoming</CustomText>
        </TouchableOpacity>
      </View>
      {tab ? (
        <UpcomingTab fetching={fetching} upcoming={upcoming} />
      ) : (
        <BookingTab metadataFetched={metadataFetched} available={available} dayRange={dayRange} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkGreen,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
    margin: 20,
  },
  tabBarLeft: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabBarRight: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  selectedContainerStyle: {
    borderBottomWidth: 1,
    borderColor: eggshell,
  },
  text: {
    color: eggshell,
  },
  unselectedText: {
    color: 'gray',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  list: {
    marginBottom: 20,
  },
  slot: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
  },
  upcomingContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  ai: {
    marginTop: 10,
  },
  placeholderText: {
    marginTop: 10,
    color: eggshell,
    textAlign: 'center',
  },
});

export default PrivateRoomScreen;
