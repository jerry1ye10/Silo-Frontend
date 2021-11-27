import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  FlatList,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Weeks from '../weeks';
import {
  // getDay,
  format,
  addDays,
  subDays,
  isToday,
  eachDay,
  isFuture,
  isSameDay,
  endOfWeek,
  startOfWeek,
  differenceInDays,
  isBefore,
  isAfter,
} from 'date-fns';

const width = Dimensions.get('window').width;
const ITEM_LENGTH = width / 7;
const _today = new Date();
const _year = _today.getFullYear();
const _month = _today.getMonth();
const _day = _today.getDate();
const TODAY = new Date(_year, _month, _day); // FORMAT: Wed May 16 2018 00:00:00 GMT+0800 (CST)

const coral = '#db7f67';
const darkGreen = '#2e5339';
const eggshell = '#f1e9db';

class DateItem extends PureComponent {
  render() {
    const { item, highlight, onItemPress, fontFamily, disabled } = this.props;
    const solar = format(item, 'D');
    const highlightBgColor = coral;
    const normalBgColor = darkGreen;
    const hightlightTextColor = eggshell;
    const normalTextColor = eggshell;
    const disabledTextColor = 'gray';
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity style={styles.itemWrapButton} onPress={onItemPress} disabled={disabled}>
          <View
            style={{
              ...styles.itemView,
              backgroundColor: highlight ? highlightBgColor : normalBgColor,
            }}>
            <Text
              style={{
                ...styles.itemDateText,
                color: disabled
                  ? disabledTextColor
                  : highlight
                  ? hightlightTextColor
                  : normalTextColor,
                fontFamily,
              }}>
              {solar}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

class CalendarStrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: this.getInitialDates(),
      pageOfToday: 2, // page of today in calendar, start from 0
      currentPage: 2, // current page in calendar,  start from 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (isSameDay(nextProps.selectedDate, this.props.selectedDate)) return;
    const nextSelectedDate = nextProps.selectedDate;
    if (!this.currentPageDatesIncludes(nextSelectedDate)) {
      const sameDay = (d) => isSameDay(d, nextSelectedDate);
      if (this.state.datas.find(sameDay)) {
        let selectedIndex = this.state.datas.findIndex(sameDay);
        if (selectedIndex === -1) selectedIndex = this.state.pageOfToday; // in case not find
        const selectedPage = ~~(selectedIndex / 7);
        this.scrollToPage(selectedPage);
      } else {
        // not born, then spawn these dates, then scroll to it.
        // past: born [startOfThatWeek, last]
        // future: born [first, endOfThatWeek]
        // momentumEnd() handle pageOfToday and currentPage
        if (isFuture(nextSelectedDate)) {
          const head = this.state.datas[0];
          const tail = endOfWeek(nextSelectedDate);
          const days = eachDay(head, tail);
          this.setState(
            {
              datas: days,
            },
            () => {
              const page = ~~(days.length / 7 - 1);
              // to last page
              this.scrollToPage(page);
            },
          );
        } else {
          const head = startOfWeek(nextSelectedDate);
          const tail = this.state.datas[this.state.datas.length - 1];
          const days = eachDay(head, tail);
          this.setState(
            {
              datas: days,
            },
            () => {
              // to first page
              this.scrollToPage(0);
            },
          );
        }
      }
    }
  }

  scrollToPage = (page, animated = true) => {
    this._calendar.scrollToIndex({ animated, index: 7 * page });
  };

  currentPageDatesIncludes = (date) => {
    const { currentPage } = this.state;
    const currentPageDates = this.state.datas.slice(7 * currentPage, 7 * (currentPage + 1));
    // dont use currentPageDates.includes(date); because can't compare Date in it
    return !!currentPageDates.find((d) => isSameDay(d, date));
  };

  getInitialDates() {
    // const todayInWeek = getDay(TODAY);
    const last2WeekOfToday = subDays(TODAY, 7 * 2);
    const next2WeekOfToday = addDays(TODAY, 7 * 2);
    const startLast2Week = startOfWeek(last2WeekOfToday);
    const endNext2Week = endOfWeek(next2WeekOfToday);
    const eachDays = eachDay(startLast2Week, endNext2Week);
    return eachDays;
  }

  loadNextTwoWeek(originalDates) {
    const originalFirstDate = originalDates[0];
    const originalLastDate = originalDates[originalDates.length - 1];
    const lastDayOfNext2Week = addDays(originalLastDate, 7 * 2);
    const eachDays = eachDay(originalFirstDate, lastDayOfNext2Week);
    this.setState({ datas: eachDays });
  }

  loadPreviousTwoWeek(originalDates) {
    const originalFirstDate = originalDates[0];
    const originalLastDate = originalDates[originalDates.length - 1];
    const firstDayOfPrevious2Week = subDays(originalFirstDate, 7 * 2);
    const eachDays = eachDay(firstDayOfPrevious2Week, originalLastDate);
    this.setState(
      (prevState) => ({
        datas: eachDays,
        currentPage: prevState.currentPage + 2,
        pageOfToday: prevState.pageOfToday + 2,
      }),
      () => {
        this.scrollToPage(2, false);
      },
    );
  }

  _stringToDate = (dateString) => {
    // '2018-01-01' => Date
    const dateArr = dateString.split('-');
    const [y, m, d] = dateArr.map((ds) => parseInt(ds, 10));
    // CAVEAT: Jan is 0
    return new Date(y, m - 1, d);
  };

  render() {
    const { onPressDate, selectedDate, onPressGoToday, fontFamily, minDate, maxDate } = this.props;
    return (
      <View style={styles.container}>
        <Weeks fontFamily={fontFamily} />
        <FlatList
          ref={(ref) => (this._calendar = ref)}
          bounces={false}
          horizontal
          pagingEnabled
          initialScrollIndex={14}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={this.momentumEnd}
          scrollEventThrottle={500}
          getItemLayout={(data, index) => ({
            length: ITEM_LENGTH,
            offset: ITEM_LENGTH * index,
            index,
          })}
          onEndReached={() => {
            this.onEndReached();
          }}
          onEndReachedThreshold={0.01}
          data={this.state.datas}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <DateItem
                item={item}
                onItemPress={() => onPressDate && onPressDate(item)}
                highlight={isSameDay(selectedDate, item)}
                fontFamily={fontFamily}
                disabled={(isBefore(item, minDate) && !isToday(item)) || isAfter(item, maxDate)}
              />
            );
          }}
        />
        <TouchableOpacity
          style={styles.header}
          onPress={() => {
            const page = this.state.pageOfToday;
            onPressGoToday && onPressGoToday(TODAY);
            this.scrollToPage(page);
          }}>
          <Text style={{ ...styles.headerDate, fontFamily }}>
            Showing Availability For: {format(selectedDate, 'M/DD/YYYY')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  momentumEnd = (event) => {
    /**
      {
        contentInset: { bottom: 0, top: 0, left: 0, right: 0 },
        zoomScale: 1,
        contentOffset: { y: 0, x: 1875 },
        layoutMeasurement: { height: 50, width: 375 },
        contentSize: { height: 50, width: 2625 }
      }
    */
    const firstDayInCalendar = this.state.datas ? this.state.datas[0] : new Date();
    const daysBeforeToday = differenceInDays(firstDayInCalendar, new Date());
    const pageOfToday = ~~Math.abs(daysBeforeToday / 7);
    const screenWidth = event.nativeEvent.layoutMeasurement.width;
    const currentPage = event.nativeEvent.contentOffset.x / screenWidth;
    this.setState({
      pageOfToday,
      currentPage,
    });

    // swipe to head ~ load 2 weeks
    if (event.nativeEvent.contentOffset.x < width) {
      this.loadPreviousTwoWeek(this.state.datas);
    }
  };

  onEndReached() {
    this.loadNextTwoWeek(this.state.datas);
  }
}

CalendarStrip.propTypes = {
  selectedDate: PropTypes.object.isRequired,
  onPressDate: PropTypes.func,
  onPressGoToday: PropTypes.func,
  fontFamily: PropTypes.string,
  minDate: PropTypes.object.required,
  maxDate: PropTypes.object.required,
};

const styles = StyleSheet.create({
  container: {
    height: 30 + 30 + 50,
    backgroundColor: darkGreen,
  },
  header: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDate: {
    color: eggshell,
  },
  itemContainer: {
    width: width / 7,
    height: 50,
  },
  itemWrapButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  itemDateText: {
    fontSize: 15,
    lineHeight: Platform.OS === 'ios' ? 19 : 15,
  },
});

export default CalendarStrip;
