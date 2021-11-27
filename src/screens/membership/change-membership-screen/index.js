import React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import CustomText from '../../../components/custom-text';
import { changeMembershipRenewal } from '../../../redux/actions/user-actions';
import { darkGreen, eggshell } from '../../../utilities/colors';
import CancelCard from '../cancel-card';
import MembershipCard from '../membership-card';
import Button from '../../../components/button';
import minotaur from '../../../api/minotaur';

const ChangeMembershipScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [membershipOptions, setMembershipOptions] = React.useState([]);
  const [membershipUpdated, setMembershipUpdated] = React.useState(false);
  const [selected, setSelected] = React.useState(user.membership.shouldRenew);
  const [selectedName, setSelectedName] = React.useState(null);
  const [changing, setIsChanging] = React.useState(false);

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
    try {
      setIsChanging(true);
      dispatch(changeMembershipRenewal(user.membership.id, selected));
      navigation.navigate('MembershipScreen');
    } catch (err) {
      setIsChanging(false);
    }
  };

  const onPress = (name, id) => {
    Alert.alert(`${selectedName}`, `Are you sure you want to change to ${selectedName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: onConfirm },
    ]);
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.header}>Change Membership</CustomText>
      <CustomText style={styles.subText}>
        If you are selecting a new plan you will not be charged until your renewal date.
      </CustomText>
      <FlatList
        data={[...membershipOptions, 'CANCEL']}
        style={styles.list}
        renderItem={({ item }) => {
          if (item === 'CANCEL') {
            return (
              <CancelCard
                onPress={() => {
                  setSelected(0);
                  setSelectedName('Cancel Membership');
                }}
                selected={selected === 0}
              />
            );
          }
          return (
            <MembershipCard
              membershipInfo={item}
              onPress={async () => {
                setSelected(item.id);
                setSelectedName(item.name);
              }}
              selected={selected === item.id}
            />
          );
        }}
        keyExtractor={(_, index) => index.toString()}
      />
      <Button
        text="Confirm"
        color={darkGreen}
        backgroundColor={eggshell}
        onPress={onPress}
        disabled={changing || selected === user.membership.shouldRenew}
        showActivityIndicator={changing}
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
    marginBottom: 10,
  },
  subText: {
    color: eggshell,
  },
});

export default ChangeMembershipScreen;
