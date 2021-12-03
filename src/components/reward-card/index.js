import React from 'react';
import { StyleSheet, View } from 'react-native';

import CustomText from '../../components/custom-text';
import { cream, eggshell } from '../../utilities/colors';
import HoursProgressTracker from '../hours-progress-tracker';
import { getShortDateFromSqlDate } from '../../utilities/strings';

const RewardCard = ({ rewardInfo }) => {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.titleView}>
          <View style={styles.promotionView}>
            <CustomText style={styles.promotionValue}>{rewardInfo.promotionValue}% </CustomText>
            <CustomText style={styles.promotionTitle}>
              off your next
              {rewardInfo.promotionCapacity === 1
                ? ' visit'
                : ` ${rewardInfo.promotionCapacity} visits`}
              !
            </CustomText>
          </View>
          <CustomText style={styles.expirationText}>
            expires on {getShortDateFromSqlDate(rewardInfo.promotionExpiration)}
          </CustomText>
        </View>
      </View>
      <HoursProgressTracker
        totalHours={rewardInfo.promotionCapacity}
        hoursUsed={rewardInfo.promotionCapacity - rewardInfo.remainingValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    backgroundColor: eggshell,
    borderRadius: 2,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  titleView: {
    padding: 20,
    alignItems: 'flex-end',
    backgroundColor: cream,
  },
  promotionView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  promotionValue: {
    fontWeight: 'bold',
    fontSize: 32,
    color: eggshell,
  },
  promotionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: eggshell,
  },
  expirationText: {
    color: eggshell,
    fontSize: 12,
  },
});

export default RewardCard;
