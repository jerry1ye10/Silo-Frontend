import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import MembershipCard from '../membership-card';
import CustomText from '../../../components/custom-text';
import { black, darkGreen, eggshell } from '../../../utilities/colors';

import minotaur from '../../../api/minotaur';

const PurchaseMembershipScreen = ({ notice = null }) => {
  // const navigation = useNavigation();
  // const [membershipOptions, setMembershipOptions] = React.useState([]);
  // const [fetching, setFetching] = React.useState(false);

  // React.useEffect(() => {
  //   const getOptions = async () => {
  //     setFetching(true);
  //     try {
  //       const options = await minotaur.get('/membership_types');
  //       setMembershipOptions(options.data);
  //       setFetching(false);
  //     } catch (err) {
  //       setFetching(false);
  //     }
  //   };
  //   getOptions();
  // }, []);

  // return (
  //   <View style={styles.container}>
  //     {fetching ? (
  //       <CustomText style={styles.fetchingText}>Fetching membership deals. Please wait.</CustomText>
  //     ) : (
  //       <>
  //         {notice ? (
  //           <View style={styles.notice}>
  //             <CustomText style={styles.noticeText}>{notice}</CustomText>
  //           </View>
  //         ) : null}
  //         <FlatList
  //           data={membershipOptions}
  //           style={styles.list}
  //           renderItem={({ item }) => (
  //             <MembershipCard
  //               membershipInfo={item}
  //               onPress={() => {
  //                 navigation.navigate('ConfirmMembershipScreen', { membershipInfo: item });
  //               }}
  //             />
  //           )}
  //         />
  //       </>
  //     )}
  //   </View>
  // );
  return (
    <View style={styles.container}>
      <CustomText style={styles.fetchingText}>We are no longer selling new memberships.</CustomText>
      <CustomText style={styles.fetchingText}>Sorry for the inconvenience.</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkGreen,
  },
  notice: {
    backgroundColor: eggshell,
    marginTop: 20,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  noticeText: {
    color: black,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    padding: 20,
  },
  fetchingText: {
    color: eggshell,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PurchaseMembershipScreen;
