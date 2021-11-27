import React from 'react';
import { View, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CustomText from '../../components/custom-text';
import BottomModalBase from '../bottom-modal-base';
import Button from '../button';

const UnlockErrorModal = ({ modalVisibility, setModalVisibility, message = 0 }) => {
  const NoLocationPermissionContent = () => (
    <>
      <CustomText style={styles.description}>
        Labyrinthe needs access to your location to ensure you are near the store to unlock the
        front door. Please enable location permissions on your device.
      </CustomText>
      <View>
        <Button
          text="Open Settings"
          color="white"
          backgroundColor="black"
          onPress={() => {
            Linking.openSettings();
          }}
        />
      </View>
    </>
  );

  const TooFarAwayContent = () => (
    <CustomText style={styles.descriptionLong}>
      You are too far away from the store to unlock the front door. Please move closer and try
      again.
    </CustomText>
  );

  const GeneralErrorContent = () => (
    <CustomText style={styles.descriptionLong}>
      Sorry, something went wrong. Please try again later.
    </CustomText>
  );

  const content =
    message === 0 ? (
      <NoLocationPermissionContent />
    ) : message === 1 ? (
      <TooFarAwayContent />
    ) : (
      <GeneralErrorContent />
    );

  return (
    <BottomModalBase
      modalVisibility={modalVisibility}
      setModalVisibility={setModalVisibility}
      canDismiss={true}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={async () => {
            setModalVisibility(false);
          }}>
          <Icon name="close" size={30} color="gray" />
        </TouchableOpacity>
        {content}
      </View>
    </BottomModalBase>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  dismissButton: {
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  description: {
    marginBottom: 20,
  },
  descriptionLong: {
    marginBottom: 40,
  },
});

export default UnlockErrorModal;
