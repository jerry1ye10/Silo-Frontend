import {
  isEmailValid,
  isPhoneNumberValid,
  getReadableDuration,
  formatPhoneNumber,
  cleanPhoneNumber,
  getShortDateFromSqlDate,
} from '.';
import moment from 'moment';

describe('strings.js', () => {
  it('isEmailValid', () => {
    expect(isEmailValid('eric@labyrintheinc.com')).toEqual(true);
    expect(isEmailValid('eric@labyrintheinc.net')).toEqual(true);
    expect(isEmailValid('a@a.net')).toEqual(true);
    expect(isEmailValid('eric@gmail.com')).toEqual(true);
    expect(isEmailValid('eric123@gmail.com')).toEqual(true);
    expect(isEmailValid('eric123@eric.me')).toEqual(true);
    expect(isEmailValid('ericlabyrintheinc.com')).toEqual(false);
    expect(isEmailValid('eric@labyrintheinccom')).toEqual(false);
    expect(isEmailValid('eric@labyrintheinc.c')).toEqual(false);
    expect(isEmailValid('@labyrintheinc.com')).toEqual(false);
    expect(isEmailValid('labyrintheinc.com')).toEqual(false);
  });

  it('isPhoneNumberValid', () => {
    expect(isPhoneNumberValid('1234567890')).toEqual(true);
    expect(isPhoneNumberValid('6666666666')).toEqual(true);
    expect(isPhoneNumberValid('0000000000')).toEqual(true);
    expect(isPhoneNumberValid('9123897151')).toEqual(true);
    expect(isPhoneNumberValid('1241268012')).toEqual(true);
    expect(isPhoneNumberValid('123456789')).toEqual(false);
    expect(isPhoneNumberValid('6666u')).toEqual(false);
    expect(isPhoneNumberValid('000000000O')).toEqual(false);
    expect(isPhoneNumberValid('000 999999')).toEqual(false);
    expect(isPhoneNumberValid('11111111111')).toEqual(false);
  });

  it('getReadableDuration', () => {
    expect(getReadableDuration(0)).toEqual('<1 min');
    expect(getReadableDuration(1)).toEqual('1 min');
    expect(getReadableDuration(2)).toEqual('2 mins');
    expect(getReadableDuration(5)).toEqual('5 mins');
    expect(getReadableDuration(17)).toEqual('17 mins');
    expect(getReadableDuration(60)).toEqual('1 hr 0 min');
    expect(getReadableDuration(61)).toEqual('1 hr 1 min');
    expect(getReadableDuration(62)).toEqual('1 hr 2 mins');
    expect(getReadableDuration(65)).toEqual('1 hr 5 mins');
    expect(getReadableDuration(119)).toEqual('1 hr 59 mins');
    expect(getReadableDuration(120)).toEqual('2 hrs 0 min');
    expect(getReadableDuration(180)).toEqual('3 hrs 0 min');
    expect(getReadableDuration(240)).toEqual('4 hrs 0 min');
    expect(getReadableDuration(300)).toEqual('5 hrs 0 min');
    expect(getReadableDuration(301)).toEqual('5 hrs 1 min');
    expect(getReadableDuration(315)).toEqual('5 hrs 15 mins');
    expect(getReadableDuration(600)).toEqual('10 hrs 0 min');
    expect(getReadableDuration(821)).toEqual('13 hrs 41 mins');
    expect(getReadableDuration(1023)).toEqual('17 hrs 3 mins');
    expect(getReadableDuration(1801)).toEqual('30 hrs 1 min');
    expect(getReadableDuration(1980)).toEqual('33 hrs 0 min');
  });

  it('formatPhoneNumber', () => {
    expect(formatPhoneNumber(null)).toBeNull();
    expect(formatPhoneNumber(undefined)).toBeNull();
    expect(formatPhoneNumber('1')).toEqual('1');
    expect(formatPhoneNumber('12')).toEqual('12');
    expect(formatPhoneNumber('123')).toEqual('123');
    expect(formatPhoneNumber('1234')).toEqual('123-4');
    expect(formatPhoneNumber('12345')).toEqual('123-45');
    expect(formatPhoneNumber('123456')).toEqual('123-456');
    expect(formatPhoneNumber('1234567')).toEqual('123-4567');
    expect(formatPhoneNumber('12345678')).toEqual('(123) 456-78');
    expect(formatPhoneNumber('123456789')).toEqual('(123) 456-789');
    expect(formatPhoneNumber('1234567890')).toEqual('(123) 456-7890');
    expect(formatPhoneNumber('00000000000')).toEqual('00000000000');
  });

  it('cleanPhoneNumber', () => {
    expect(cleanPhoneNumber('1')).toEqual('1');
    expect(cleanPhoneNumber('12')).toEqual('12');
    expect(cleanPhoneNumber('123')).toEqual('123');
    expect(cleanPhoneNumber('123-4')).toEqual('1234');
    expect(cleanPhoneNumber('123-45')).toEqual('12345');
    expect(cleanPhoneNumber('123-456')).toEqual('123456');
    expect(cleanPhoneNumber('123-4567')).toEqual('1234567');
    expect(cleanPhoneNumber('(123) 456-78')).toEqual('12345678');
    expect(cleanPhoneNumber('(123) 456-789')).toEqual('123456789');
    expect(cleanPhoneNumber('(123) 456-7890')).toEqual('1234567890');
    expect(cleanPhoneNumber('00000000000')).toEqual('00000000000');
  });

  it('getShortDateFromSqlDate', () => {
    expect(getShortDateFromSqlDate('2019-12-19 23:55:52')).toEqual(
      moment()
        .utc('2019-12-19 23:55:52')
        .local()
        .format('MM/DD/YYYY'),
    );
    expect(getShortDateFromSqlDate('2020-01-12 02:43:00')).toEqual(
      moment()
        .utc('2020-01-12 02:43:00')
        .local()
        .format('MM/DD/YYYY'),
    );
    expect(getShortDateFromSqlDate('2024-01-05 00:00:52')).toEqual(
      moment()
        .utc('2024-01-05 00:00:52')
        .local()
        .format('MM/DD/YYYY'),
    );
    expect(getShortDateFromSqlDate('2021-01-30 11:03:05')).toEqual(
      moment()
        .utc('2021-01-30 11:03:05')
        .local()
        .format('MM/DD/YYYY'),
    );
    expect(getShortDateFromSqlDate('2026-06-06 06:06:06')).toEqual(
      moment()
        .utc('2026-06-06 06:06:06')
        .local()
        .format('MM/DD/YYYY'),
    );
  });
});
