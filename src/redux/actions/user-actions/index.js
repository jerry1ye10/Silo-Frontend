import moment from 'moment';

import {
  ADD_CARD,
  ADD_CARDS,
  ADD_CARD_ADDING,
  ADD_CARD_ERROR,
  ADD_CARD_REMOVING,
  ADD_CARD_SELECTING,
  ADD_DEVICE_TOKEN,
  ADD_DEVICE_TOKEN_ADDING,
  ADD_DEVICE_TOKEN_ENDING,
  ADD_STRIPE_ID_WITH_CARD,
  ADD_USER,
  ADD_USER_ERROR,
  ADD_USER_NAME_CHANGING,
  ADD_USER_SIGNING_IN,
  CHANGE_USER_NAME,
  LOG_OUT,
  REMOVE_CARD,
  SELECT_CARD,
} from '../types';

import minotaur from '../../../api/minotaur';
import { isEmailValid } from '../../../utilities/strings';
import { getTrimmedCard } from '../../../utilities/cards';
import * as SessionActions from '../session-actions';

export const addCardError = (error) => {
  return { type: ADD_CARD_ERROR, payload: error };
};

export const addUserError = (error) => {
  return { type: ADD_USER_ERROR, payload: error };
};


// Removes a payment source from a user while making sure no current sessions
// are currently using the card. If multiple payment sources exists while
// deleting a card, a new default source is chosen.
export const deletePaymentSource = (cardId, isDefault, user, activeSessions) => {
  return async (dispatch) => {
    dispatch(addCardRemoving(cardId));
    // If there exists more than one card, choose the most recent one that is
    // not being deleted as the new default.
    let cardToBeMadeDefaultId = null;
    if (isDefault && user.cards.length > 1) {
      // This search method assumes that the cards are in descending
      // date order, and ends up choosing the most recently added
      // remaining card.
      for (let i = 0; i < user.cards.length; i++) {
        if (user.cards[i].id !== cardId) {
          cardToBeMadeDefaultId = user.cards[i].id;
          break;
        }
      }
    }
    // Make sure a currently active session does not contain a card being used.
    // If so, throw an error.
    const cardBeingUsed = activeSessions.find((item) => {
      return item.cardId === cardId;
    });
    if (cardBeingUsed !== undefined) {
      dispatch(addCardError('Cannot remove a card currently being used'));
      return;
    }
    try {
      // First remove the card from minotaur. If the second request fails,
      // it is preferrable that it is the Stripe call instead of the database
      // update.
      await minotaur.delete(`/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // If there is a card to be made default, make it default.
      if (cardToBeMadeDefaultId) {
        await minotaur.put(
          `/cards/${cardToBeMadeDefaultId}`,
          { is_default: 1 },
          { headers: { Authorization: `Bearer ${user.token}` } },
        );
      }
      dispatch(removeCard(cardId, cardToBeMadeDefaultId));
    } catch (err) {
      dispatch(addCardError('Could not remove card'));
    }
  };
};

export const editName = (authToken, name, next) => {
  return async (dispatch) => {
    dispatch(addUserNameChanging());
    try {
      await minotaur.put('/users', { name }, { headers: { Authorization: `Bearer ${authToken}` } });
      dispatch(changeUserName(name));
      next();
    } catch (err) {
      dispatch(addUserError('Could not change name'));
    }
  };
};

export const getCards = (authToken) => {
  return async (dispatch) => {
    try {
      const cardResponse = await minotaur.get('/cards', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      dispatch(addCards(cardResponse.data));
    } catch (err) {
      dispatch(addUserError('Server error'));
    }
  };
};

// Communicates with minotaur to log in a user.
export const login = (email, password, deviceToken, next) => {
  return async (dispatch) => {
    if (!email || !password) {
      dispatch(addUserError('Please enter an email and a password'));
    } else if (!isEmailValid(email)) {
      dispatch(addUserError('Please enter a valid email address'));
    } else {
      dispatch(addUserSigningIn());
      try {
        const loginResponse = await minotaur.post('/login', {
          email,
          password,
        });
        const user = { ...loginResponse.data, email };
        // Check if there is device token information present.
        if (deviceToken !== null) {
          // If nothing exists, create it.
          
          await minotaur.post('/devices', {
            token: deviceToken.token,
            os: deviceToken.os,
            user_id: loginResponse.data.id,
          });
        }
        dispatch(addUser(user));
        next();
      } catch (err) {
        if (
          err.response.status === 400 ||
          err.response.status === 403 ||
          err.response.status === 404
        ) {
          dispatch(addUserError('Login failed'));
        } else {
          dispatch(addUserError('Server error'));
        }
      }
    }
  };
};

export const logOut = () => {
  return { type: LOG_OUT };
};


export const recordDeviceToken = (token, os) => {
  return async (dispatch) => {
    dispatch(addDeviceTokenAdding());
    try {
      // No entry with given token and os exists yet.
      await minotaur.post('/devices', { token, os, user_id: null });
      dispatch(addDeviceToken(token, os));
    } catch (err) {
      dispatch(addDeviceTokenEnding());
    }
  };
};

// Selects a new default payment source.
export const selectPaymentSource = (user, selectedCardId) => {
  return async (dispatch) => {
    dispatch(addCardSelecting(selectedCardId));
    // Find the default card. The card from which this method is being called
    // cannot be the default as enforced by the UI.
    const defaultCard = user.cards.find((card) => {
      return card.isDefault;
    });
    try {
      // First deselect then select to avoid case where there are two defaults.
      await minotaur.put(
        `/cards/${defaultCard.id}`,
        { is_default: 0 },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      await minotaur.put(
        `/cards/${selectedCardId}`,
        { is_default: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      dispatch(selectCard(selectedCardId, defaultCard.id));
    } catch (err) {
      dispatch(addCardError('Could not select card'));
    }
  };
};

// Communicates with minotaur to add a card to the user through stripe. A JWT
// token is required to perform this action.
export const updatePaymentProfile = (user, userCard, next) => {
  const cardToken = userCard.tokenId;

  return async (dispatch) => {
    dispatch(addCardAdding());
    // First, see if current card is already marked default, it there is
    // prepare for it to undefault.
    let cardToBeReplacedId = null;
    if (user.cards.length !== 0) {
      user.cards.forEach((card) => {
        if (card.isDefault) {
          cardToBeReplacedId = card.id;
        }
      });
    }
    // If the user does not have a stripeId, set up a stripe customer for the
    // user with the card object. If a stripe customer already exists, update
    // card onto the user.
    try {
      if (!user.stripeId) {
        const createCustomerResponse = await minotaur.post(
          '/stripe-customers',
          { email: user.email, source: cardToken },
          { headers: { Authorization: `Bearer ${user.token}` } },
        );
        const { stripeId: freshStripeId } = createCustomerResponse.data;
        await minotaur.put(
          '/users',
          { stripeId: freshStripeId },
          { headers: { Authorization: `Bearer ${user.token}` } },
        );

        // If the customer is created successfully, update mintotaur with all
        // relevant information.
        // Trim the card down to only what's necessary for the database.
        const card = getTrimmedCard(userCard.card);

        // Now add card to database.
        await minotaur.post(
          '/cards',
          { card },
          { headers: { Authorization: `Bearer ${user.token}` } },
        );
        dispatch(addStripeIdWithCard(freshStripeId, card));
        next();
      } else {
        // If a stripeId already exists, simply attach the card to the
        // existing customer.
        const createCardResponse = await minotaur.post(
          '/stripe-cards',
          { stripe_id: user.stripeId, source: cardToken },
          { headers: { Authorization: `Bearer ${user.token}` } },
        );
        // If there is a card to be replaced, first set the value of that
        // card's "is_default" to be false.
        if (cardToBeReplacedId) {
          await minotaur.put(
            `/cards/${cardToBeReplacedId}`,
            { is_default: 0 },
            { headers: { Authorization: `Bearer ${user.token}` } },
          );
        }
        // If the card is created successfully, update mintotaur with all
        // relevant information.
        const card = getTrimmedCard(userCard.card);
        await minotaur.post(
          '/cards',
          { card },
          { headers: { Authorization: `Bearer ${user.token}` } },
        );
        // Update sessions in case a new card changes a session.
        dispatch(SessionActions.getActiveSessions(user.token));
        // Once all async calls are successful, update the redux store.
        dispatch(addCard(card));
        next();
      }
    } catch (err) {
      dispatch(addCardError('Could not add card'));
    }
  };
};

const addCard = (cardInfo) => {
  return { type: ADD_CARD, payload: cardInfo };
};

const addCards = (cards) => {
  return { type: ADD_CARDS, payload: cards };
};

const addCardAdding = () => {
  return { type: ADD_CARD_ADDING };
};

const addCardRemoving = (cardId) => {
  return { type: ADD_CARD_REMOVING, payload: cardId };
};

const addCardSelecting = (cardId) => {
  return { type: ADD_CARD_SELECTING, payload: cardId };
};


const addDeviceToken = (token, os) => {
  return { type: ADD_DEVICE_TOKEN, payload: { token, os } };
};

const addDeviceTokenAdding = () => {
  return { type: ADD_DEVICE_TOKEN_ADDING };
};

const addDeviceTokenEnding = () => {
  return { type: ADD_DEVICE_TOKEN_ENDING };
};


const addStripeIdWithCard = (stripeId, cardInfo) => {
  return { type: ADD_STRIPE_ID_WITH_CARD, payload: { stripeId, cardInfo } };
};

export const addUser = (user, cards = [], sessions = [], dayPass = null) => {
  return {
    type: ADD_USER,
    payload: { userInfo: { ...user, cards }, sessions, dayPass },
  };
};

const addUserNameChanging = () => {
  return { type: ADD_USER_NAME_CHANGING };
};

const addUserSigningIn = () => {
  return { type: ADD_USER_SIGNING_IN };
};

const changeUserName = (name) => {
  return { type: CHANGE_USER_NAME, payload: name };
};

const removeCard = (cardToBeRemovedId, cardToBeMadeDefaultId) => {
  return {
    type: REMOVE_CARD,
    payload: { cardToBeRemovedId, cardToBeMadeDefaultId },
  };
};

const selectCard = (selectedCardId, cardToBeDeselectedId) => {
  return {
    type: SELECT_CARD,
    payload: { selectedCardId, cardToBeDeselectedId },
  };
};
