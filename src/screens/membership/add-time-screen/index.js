import React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { AppEventsLogger } from 'react-native-fbsdk-next';

import CustomText from '../../../components/custom-text';
import { purchaseMembership } from '../../../redux/actions/user-actions';
import { darkGreen, eggshell } from '../../../utilities/colors';
import AddTimeCard from '../add-time-card';
import Button from '../../../components/button';
import minotaur from '../../../api/minotaur';

const AddTimeScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [membershipOptions, setMembershipOptions] = React.useState([]);
  const [membershipUpdated, setMembershipUpdated] = React.useState(false);
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [didPurchaseFail, setDidPurchaseFail] = React.useState(false);
  const [selected, setSelected] = React.useState(user.membership.membershipType);
  const [selectedName, setSelectedName] = React.useState(user.membership.membershipName);

  React.useEffect(() => {
    const getOptions = async () => {
      try {
        const options = await minotaur.get('/membership_types');
        setMembershipOptions(options.data);
        setMembershipUpdated(true);
      } catch (err) {
        setMembershipUpdated(false);
      }
    };
    getOptions();
  }, []);

  const LoadingScreen = () => (
    <View style={styles.container}>
      <CustomText style={styles.loadingText}>Fetching options, please wait.</CustomText>
    </View>
  );

  if (!membershipUpdated) {
    return <LoadingScreen />;
  }

  const onConfirm = async () => {
    const selectedIndex = membershipOptions.findIndex((el) => el.id === selected);
    try {
      setIsPurchasing(true);
      await dispatch(
        purchaseMembership(
          selected,
          () => {
            navigation.navigate('PaymentsScreen');
          },
          () => {
            navigation.navigate('MembershipScreen');
            AppEventsLogger.logPurchase(membershipOptions[selectedIndex].price / 100, 'USD');
          },
        ),
      );
    } catch (err) {
      setDidPurchaseFail(true);
      setIsPurchasing(false);
    }
  };

  const onPress = (name, id) => {
    Alert.alert(`${selectedName}`, `Are you sure you want to purchase a ${selectedName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: onConfirm },
    ]);
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.header}>Add More Time</CustomText>
      <FlatList
        data={membershipOptions}
        style={styles.list}
        renderItem={({ item }) => (
          <AddTimeCard
            membershipInfo={item}
            onPress={() => {
              setSelected(item.id);
              setSelectedName(item.name);
            }}
            selected={selected === item.id}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      {didPurchaseFail ? (
        <CustomText style={styles.errorText}>
          Your purchased failed. Please update your payment method and try again.
        </CustomText>
      ) : null}
      <Button
        text="Confirm"
        color={darkGreen}
        backgroundColor={eggshell}
        onPress={onPress}
        disabled={isPurchasing}
        showActivityIndicator={isPurchasing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkGreen,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingText: {
    textAlign: 'center',
    color: eggshell,
  },
  list: {
    marginVertical: 20,
  },
  header: {
    color: eggshell,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: eggshell,
    marginBottom: 10,
  },
});

export default AddTimeScreen;
