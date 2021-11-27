import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import ChangeMembershipCard from '../change-membership-card';
import CancelCard from '../cancel-card';
import CustomText from '../../../components/custom-text';
import { darkGreen, eggshell } from '../../../utilities/colors';

import minotaur from '../../../api/minotaur';
import { changeMembershipRenewal } from '../../../redux/actions/user-actions';

const ManageMembershipScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [membershipOptions, setMembershipOptions] = React.useState([]);
  const [membershipUpdated, setMembershipUpdated] = React.useState(false);

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
      <CustomText style={styles.loadingText}>Fetching membership, please wait.</CustomText>
    </View>
  );

  if (!membershipUpdated) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={['CANCEL', ...membershipOptions]}
        style={styles.list}
        renderItem={({ item }) => {
          if (item === 'CANCEL') {
            return (
              <CancelCard
                onPress={() => {
                  dispatch(changeMembershipRenewal(user.membership.id, 0));
                  navigation.navigate('MembershipScreen');
                }}
              />
            );
          }
          return (
            <ChangeMembershipCard
              membershipInfo={item}
              onPress={async () => {
                dispatch(changeMembershipRenewal(user.membership.id, item.id));
                navigation.navigate('MembershipScreen');
              }}
              appendText={'Change to '}
            />
          );
        }}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: darkGreen,
  },
  loadingText: {
    textAlign: 'center',
    color: eggshell,
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
});

export default ManageMembershipScreen;
