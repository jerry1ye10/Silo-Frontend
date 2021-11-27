import moment from 'moment';

// Determines whether an email is in a standard format.
export const isEmailValid = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

// Determines whether a phone number is ten digits.
export const isPhoneNumberValid = (number) => {
  return /^\d{10}$/.test(number);
};

export const getDayEndMoment = (timeCreatedString) => {
  const momentInUTC = moment.utc(timeCreatedString);
  const localMoment = momentInUTC.local();
  const year = localMoment.get('year');
  const month = localMoment.get('month') + 1;
  const date = localMoment.get('date');
  return moment(`${year}-${month}-${date} 23:59:59`, 'YYYY-M-D HH:mm:ss');
};

export const getShortDateString = (timeString) => {
  const time = moment.utc(timeString).local();
  return time.format('MM/DD/YY');
};

// Turn a duration in minutes into a human readable format.
export const getReadableDuration = (durationInMinutes) => {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  if (hours === 0 && minutes === 0) {
    return '<1 min';
  } else {
    let hourString;
    let minuteString;
    if (minutes === 0) {
      minuteString = '0 min';
    } else if (minutes === 1) {
      minuteString = '1 min';
    } else {
      minuteString = `${minutes} mins`;
    }
    if (hours === 0) {
      return minuteString;
    } else if (hours === 1) {
      hourString = '1 hr';
    } else {
      hourString = `${hours} hrs`;
    }
    return `${hourString} ${minuteString}`;
  }
};

// Takes a phone number in raw form and formats it into more readable form.
export const formatPhoneNumber = (number) => {
  if (!number) {
    return null;
  }
  switch (number.length) {
    case (1, 2, 3):
      return number;
    case 4:
      return `${number.substring(0, 3)}-${number.charAt(3)}`;
    case 5:
      return `${number.substring(0, 3)}-${number.substring(3, 5)}`;
    case 6:
      return `${number.substring(0, 3)}-${number.substring(3, 6)}`;
    case 7:
      return `${number.substring(0, 3)}-${number.substring(3, 7)}`;
    case 8:
      return `(${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6, 8)}`;
    case 9:
      return `(${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6, 9)}`;
    case 10:
      return `(${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6, 10)}`;
    default:
      return number;
  }
};

// Takes a phone number in readable text and converts it to raw text.
export const cleanPhoneNumber = (number) => {
  return number.replace(' ', '').replace('-', '').replace('(', '').replace(')', '');
};

export const getShortDateFromSqlDate = (sqlDate) => {
  return moment.utc(sqlDate).local().format('MM/DD/YYYY');
};
