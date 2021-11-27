import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomText from '../../../components/custom-text';
import CurrentMembershipScreen from '../current-membership-screen';
import PurchaseMembershipScreen from '../purchase-membership-screen';
import { darkGreen, eggshell } from '../../../utilities/colors';

import minotaur from '../../../api/minotaur';
import { getMembership } from '../../../redux/actions/user-actions';

const MembershipScreen = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [membershipOptions, setMembershipOptions] = React.useState([]);
  const [membershipUpdated, setMembershipUpdated] = React.useState(false);

  // Get most recent membership.
  React.useEffect(() => {
    const startup = async () => {
      try {
        const options = await minotaur.get('/membership_types');
        setMembershipOptions(options.data);
        await dispatch(getMembership());
        setMembershipUpdated(true);
      } catch (err) {
        setMembershipUpdated(false);
      }
    };
    startup();
  }, [dispatch]);

  const LoadingScreen = () => (
    <View style={styles.container}>
      <CustomText style={styles.loadingText}>Fetching membership, please wait.</CustomText>
    </View>
  );

  if (!membershipUpdated) {
    return <LoadingScreen />;
  } else if (
    user.membership.status === 'NO_MEMBERSHIP' ||
    user.membership.status === 'REFUNDED' ||
    user.membership.status === 'DID_NOT_RENEW'
  ) {
    return <PurchaseMembershipScreen />;
  } else if (membershipUpdated && user.membership.status === 'FAILED_RENEWAL') {
    return (
      <PurchaseMembershipScreen
        notice={
          'Your membership failed to renew. Please update your payment method and try again. You will regain your previous hours upon renewal.'
        }
      />
    );
  } else if (user.membership.status === 'ACTIVE' || user.membership.status === 'ACTIVE_EMPTY') {
    return <CurrentMembershipScreen membershipOptions={membershipOptions} />;
  }
  return <LoadingScreen />;
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
});

export default MembershipScreen;
