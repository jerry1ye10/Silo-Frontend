import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import CustomText from '../../components/custom-text';
import CustomTextInput from '../../components/custom-text-input';
import Button from '../../components/button';
import { black, coral, darkGreen, eggshell } from '../../utilities/colors';
import RewardCard from '../../components/reward-card';
import {
  getRelevantPromotions,
  checkPromotion,
  addPromotionError,
} from '../../redux/actions/promotion-actions';

const RewardsScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const promotions = useSelector((state) => state.promotions);
  const dispatch = useDispatch();

  const [textInput, setTextInput] = React.useState('');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(addPromotionError(' '));
    });
    return unsubscribe;
  }, [dispatch, navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(addPromotionError(' '));
    });
    return unsubscribe;
  }, [dispatch, navigation]);

  React.useEffect(() => {
    dispatch(getRelevantPromotions(user.token));
  }, [dispatch, user.token]);

  let displayElement;
  if (promotions.activePromotions.length === 0) {
    displayElement = (
      <CustomText style={styles.placeholderText}>You have no promotions at this time.</CustomText>
    );
  } else {
    displayElement = (
      <FlatList
        data={promotions.activePromotions}
        style={styles.list}
        renderItem={({ item }) => <RewardCard rewardInfo={item} active={item.active} />}
        keyExtractor={(_, index) => index.toString()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <CustomText style={styles.titleText}>Enter Code</CustomText>
        <CustomTextInput
          autoCorrect={false}
          autoFocus
          autoCapitalize="none"
          onChangeText={(e) => {
            setTextInput(e);
          }}
          style={styles.textInput}
          placeholder="Enter Your Code Here"
          placeholderTextColor="gray"
          value={textInput}
        />
        <CustomText style={styles.codeErrorMessage}>{promotions.promotionError}</CustomText>
        <Button
          text="Submit"
          color={eggshell}
          backgroundColor={coral}
          onPress={() => {
            dispatch(checkPromotion(user.token, textInput));
          }}
        />
      </View>
      <View style={styles.content}>{displayElement}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    paddingVertical: 10,
    color: black,
  },
  container: {
    flex: 1,
    backgroundColor: darkGreen,
    padding: 20,
  },
  content: {
    flex: 1,
    backgroundColor: darkGreen,
    marginTop: 20,
  },
  list: {
    paddingTop: 20,
    flex: 1,
    width: '100%',
  },
  placeholderText: {
    textAlign: 'center',
    color: eggshell,
  },
  codeErrorMessage: {
    marginVertical: 10,
    color: 'red',
    textAlign: 'center',
  },
  topView: {
    backgroundColor: eggshell,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    padding: 20,
  },
  titleText: {
    color: black,
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default RewardsScreen;
