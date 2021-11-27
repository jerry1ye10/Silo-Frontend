import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

const width = Dimensions.get('window').width;
const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const eggshell = '#f1e9db';

const Weeks = ({ fontFamily }) => {
  return (
    <View style={styles.container}>
      {WEEK.map((day) => (
        <View style={styles.content} key={day}>
          <Text style={{ ...styles.text, fontFamily }}>{day}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: 30,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: eggshell,
    fontSize: 12,
  },
});

export default Weeks;
