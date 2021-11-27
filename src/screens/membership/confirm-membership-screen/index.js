import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppEventsLogger } from 'react-native-fbsdk-next';

import CustomText from '../../../components/custom-text';
import { black, coral, darkGreen, eggshell, lightGreen } from '../../../utilities/colors';
import Button from '../../../components/button';

import { purchaseMembership } from '../../../redux/actions/user-actions';

const ConfirmMembershipScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { membershipInfo } = route.params;
  const { id, name, capacity: minutes, roomCapacity: roomCredits, price } = membershipInfo;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.topView}>
        <CustomText style={styles.nameText}>{name}</CustomText>
        <View style={styles.lineItem}>
          <Icon name="check-circle" size={20} color={lightGreen} />
          <CustomText style={styles.lineItemText}>{minutes / 60} hours</CustomText>
        </View>
        {roomCredits ? (
          <View style={styles.lineItem}>
            <Icon name="check-circle" size={20} color={lightGreen} />
            <CustomText style={styles.lineItemText}>
              {roomCredits} private room {roomCredits === 1 ? 'hour' : 'hours'}
            </CustomText>
          </View>
        ) : null}
        <View style={styles.divider} />
        <CustomText style={styles.descriptionText}>
          These hours are valid for 30 days after purchase. This membership will renew every 30
          days. You can opt out of renewal at any time. Hours will rollover for 3 months if you
          continue to renew. Hours will not rollover and expire if the membership is not renewed.
        </CustomText>
      </ScrollView>
      <View>
        <CustomText style={styles.errorText}>{user.membershipError}</CustomText>
        <View style={styles.buttonContainer}>
          <Button
            text="Purchase"
            color={eggshell}
            backgroundColor={coral}
            onPress={() => {
              Alert.alert('Membership Purchase', `Are you sure you want to purchase a ${name}?`, [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm',
                  onPress: () => {
                    dispatch(
                      purchaseMembership(
                        id,
                        () => {
                          navigation.navigate('PaymentsScreen');
                        },
                        () => {
                          navigation.navigate('MembershipScreen');
                          AppEventsLogger.logPurchase(price / 100, 'USD');
                        },
                      ),
                    );
                  },
                },
              ]);
            }}
            disabled={user.isAddingMembership}
            showActivityIndicator={user.isAddingMembership}
          />
        </View>
        <View style={styles.footer}>
          <CustomText style={styles.footerNameText}>{name}</CustomText>
          <CustomText style={styles.footerPriceText}>{`$${price / 100}`}</CustomText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkGreen,
    justifyContent: 'space-between',
  },
  topView: {
    padding: 20,
  },
  nameText: {
    color: eggshell,
    fontWeight: 'bold',
    fontSize: 44,
    marginBottom: 20,
  },
  lineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  lineItemText: {
    color: eggshell,
    marginLeft: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    borderColor: 'lightgray',
    borderWidth: 0.5,
    width: '20%',
    marginVertical: 20,
  },
  descriptionText: {
    color: eggshell,
  },
  errorText: {
    color: eggshell,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: eggshell,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerNameText: {
    color: black,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerPriceText: {
    color: coral,
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default ConfirmMembershipScreen;
