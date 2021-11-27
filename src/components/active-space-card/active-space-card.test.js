import React from 'react';
import renderer from 'react-test-renderer';
import moment from 'moment';

import {ActiveSpaceCard} from '.';
jest.mock('react-native-push-notification', () => {
  return {
    localNotification: jest.fn(),
  };
});
import {Alert} from 'react-native';
jest.mock('Alert', () => {
  return {
    alert: jest.fn(),
  };
});

const user = {id: 10587239871};
const sessionInfo1 = {
  cardId: 'card_1FrawOEuGNwXiyj3ciyJNOEK',
  id: '73608ba6a3a0f38d0b8d79285f93eaa04feef1a1',
  location: '262MET',
  lockId: 3,
  promotionRecordId: null,
  rate: 499,
  timeCreated: '2020-01-03 21:08:45',
  userId: '180efe93f1978bc3ffad43b256d5b32ddc0ecf99',
};
const sessionInfo2 = {
  cardId: 'card_1FrawOEuGNwXiyj3ciyJNOEK',
  id: '73608ba6a3a0f38d0b8d79285f93eaa04feef1a1',
  location: '262MET',
  lockId: 10,
  promotionRecordId: null,
  rate: 499,
  timeCreated: '2020-02-28 03:44:12',
  userId: '180efe93f1978bc3ffad43b256d5b32ddc0ecf99',
};
const setModalVisibility = jest.fn();
const onButtonPress = jest.fn();

describe('<ActiveSpaceCard />', () => {
  it('card text correct 1', () => {
    const component = renderer.create(
      <ActiveSpaceCard
        user={user}
        sessionInfo={sessionInfo1}
        setModalVisibility={setModalVisibility}
        onButtonPress={onButtonPress}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const topLeftText = component.root.findByProps({
      testID: 'top-left-text',
    });
    expect(topLeftText.props.children).toEqual('Desk 3');
    const bottomLeftText = component.root.findByProps({
      testID: 'bottom-left-text',
    });
    expect(bottomLeftText.props.children).toEqual(
      `Start Time: ${moment
        .utc(sessionInfo1.timeCreated)
        .local()
        .format('MMM D, h:mm A')}`,
    );
    const buttonText = component.root.findByProps({
      testID: 'button-text',
    });
    expect(buttonText.props.children).toEqual('End Session');
  });

  it('card text correct 2', () => {
    const component = renderer.create(
      <ActiveSpaceCard
        user={user}
        sessionInfo={sessionInfo2}
        setModalVisibility={setModalVisibility}
        onButtonPress={onButtonPress}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    const topLeftText = component.root.findByProps({
      testID: 'top-left-text',
    });
    expect(topLeftText.props.children).toEqual('Desk 10');
    const bottomLeftText = component.root.findByProps({
      testID: 'bottom-left-text',
    });
    expect(bottomLeftText.props.children).toEqual(
      `Start Time: ${moment
        .utc(sessionInfo2.timeCreated)
        .local()
        .format('MMM D, h:mm A')}`,
    );
    const buttonText = component.root.findByProps({
      testID: 'button-text',
    });
    expect(buttonText.props.children).toEqual('End Session');
  });

  it('alert text correct', () => {
    const component = renderer.create(
      <ActiveSpaceCard
        user={user}
        sessionInfo={sessionInfo1}
        setModalVisibility={setModalVisibility}
        onButtonPress={onButtonPress}
      />,
    );
    const endButton = component.root.findByProps({testID: 'end-button'});
    const alertSpy = jest.spyOn(Alert, 'alert');
    endButton.props.onPress();
    expect(alertSpy).toHaveBeenCalled();
    const calls = Alert.alert.mock.calls[0];
    expect(calls[0]).toEqual('Ending Session');
    expect(calls[1]).toEqual(
      'Are you sure you want to end your session on Desk 3?',
    );
    expect(calls[2][0].text).toEqual('Cancel');
    expect(calls[2][0].style).toEqual('cancel');
    expect(calls[2][1].text).toEqual('Confirm');
  });
});
