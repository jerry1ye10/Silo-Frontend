import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';

import CustomText from '../../components/custom-text';
import { coral, darkGreen, eggshell, lightGreen } from '../../utilities/colors';
import BottomModalBase from '../bottom-modal-base';
import Button from '../button';
import { finishSession } from '../../redux/actions/session-actions';

const RenewWeeklyPassModal = ({
  session,
  modalVisibility,
  setModalVisibility,
  setEndModalVisibility,
  totalMinutesExceeded,
}) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [shouldEnd, setShouldEnd] = React.useState(false);
  const minutesExceeded = totalMinutesExceeded % 60;
  const hoursExceeded = (totalMinutesExceeded - minutesExceeded) / 60;
  const timeExceededString = `${hoursExceeded} Hours and ${minutesExceeded} Minutes`;

  // Everytime the modal pops up, shouldEnd should be false. This is because the criteria
  // for whether the EndSessionModal should be present should not be dependent on actions
  // in a previous instance.
  React.useEffect(() => {
    if (modalVisibility) {
      setShouldEnd(false);
    }
  }, [modalVisibility]);

  return (
    <BottomModalBase
      modalVisibility={modalVisibility}
      onModalHide={async () => {
        try {
          if (shouldEnd) {
            setEndModalVisibility(true);
            dispatch(finishSession(user, session));
          }
        } catch (err) {
          setEndModalVisibility(false);
        }
      }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={async () => {
            setModalVisibility(false);
          }}>
          <Icon name="close" size={30} color="gray" />
        </TouchableOpacity>
        <View style={styles.descriptionView}>
          <CustomText style={styles.descriptionText}>
            You have exceeded your time by{' '}
            <CustomText style={styles.boldGreen}>{timeExceededString}.</CustomText>
          </CustomText>
          <CustomText>
            You can choose to be charged $5 an hour on your exceeded time or add time to your 8 Hour
            Pass.
          </CustomText>
        </View>
        <View>
          <Button
            text="Add Time"
            color={eggshell}
            backgroundColor={coral}
            marginBottom={10}
            onPress={async () => {
              setModalVisibility(false);
            }}
          />
          <Button
            text="Charge $5 an hour"
            color={darkGreen}
            backgroundColor={lightGreen}
            marginBottom={10}
            onPress={() => {
              setShouldEnd(true);
              setModalVisibility(false);
            }}
          />
        </View>
      </View>
    </BottomModalBase>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: eggshell,
  },
  dismissButton: {
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  descriptionView: {
    marginBottom: 20,
  },
  descriptionText: {
    marginBottom: 5,
  },
  boldGreen: {
    fontWeight: 'bold',
    color: darkGreen,
  },
});

export default RenewWeeklyPassModal;
