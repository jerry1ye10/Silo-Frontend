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
} from '../../actions/types';

// Determine if user is logged in by checking if token is not null.
const initialState = {
  id: null,
  token: null,
  email: null,
  stripeId: null,
  name: null,
  cards: [],
  deviceToken: null,
  baseRate: null,
  discount: null,
  // State which keeps track of loading.
  isSigningIn: false,
  isAddingCard: false,
  cardBeingRemoved: null,
  cardBeingSelected: null,
  isChangingName: false,
  isAddingDeviceToken: false,
  // State which keeps track of errors.
  userError: ' ',
  cardError: ' ',
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CARD:
      const oldCardList = state.cards.map((card) => {
        card.isDefault = 0;
        return card;
      });
      // When a card is added it is inserted at the beginning of the state
      // array in order to keep in sorted by most recent card.
      return Object.assign({}, state, {
        cards: [action.payload, ...oldCardList],
        cardError: ' ',
        isAddingCard: false,
      });
    case ADD_CARDS:
      return { ...state, cards: action.payload };
    case ADD_CARD_ADDING:
      return Object.assign({}, state, { isAddingCard: true });
    case ADD_CARD_ERROR:
      return Object.assign({}, state, {
        cardBeingRemoved: null,
        cardBeingSelected: null,
        cardError: action.payload,
        isAddingCard: false,
        isAddingMembership: false,
      });
    case ADD_CARD_REMOVING:
      return Object.assign({}, state, { cardBeingRemoved: action.payload });
    case ADD_CARD_SELECTING:
      return Object.assign({}, state, { cardBeingSelected: action.payload });
    case ADD_DEVICE_TOKEN:
      return Object.assign({}, state, {
        deviceToken: action.payload,
        isAddingDeviceToken: false,
      });
    case ADD_DEVICE_TOKEN_ADDING:
      return Object.assign({}, state, { isAddingDeviceToken: true });
    case ADD_DEVICE_TOKEN_ENDING:
      return Object.assign({}, state, { isAddingDeviceToken: false });
    case ADD_STRIPE_ID_WITH_CARD:
      return Object.assign({}, state, {
        cards: [...state.cards, action.payload.cardInfo],
        cardError: ' ',
        isAddingCard: false,
        stripeId: action.payload.stripeId,
      });
    case ADD_USER:
      return Object.assign({}, state, action.payload.userInfo, {
        isSigningIn: false,
        userError: ' ',
      });
    case ADD_USER_ERROR:
      return Object.assign({}, state, {
        isSigningIn: false,
        isChangingName: false,
        userError: action.payload,
      });
    case ADD_USER_NAME_CHANGING:
      return Object.assign({}, state, {
        isChangingName: true,
      });
    case ADD_USER_SIGNING_IN:
      return Object.assign({}, state, { isSigningIn: true });
    case CHANGE_USER_NAME:
      return Object.assign({}, state, {
        isChangingName: false,
        name: action.payload,
        userError: ' ',
      });
    case LOG_OUT:
      return { ...initialState, deviceToken: state.deviceToken };
    case SELECT_CARD:
      const reselectedCards = state.cards.map((card) => {
        if (card.id === action.payload.selectedCardId) {
          card.isDefault = 1;
        }
        if (card.id === action.payload.cardToBeDeselectedId) {
          card.isDefault = 0;
        }
        return card;
      });
      return Object.assign({}, state, {
        cardBeingSelected: null,
        cards: reselectedCards,
        cardError: ' ',
      });
    case REMOVE_CARD:
      // First remove the card using a filter.
      const updatedCards = state.cards.filter(
        (item) => item.id !== action.payload.cardToBeRemovedId,
      );
      // Then, update a card to default if needed.
      if (action.payload.cardToBeMadeDefaultId) {
        updatedCards.forEach((card) => {
          if (card.id === action.payload.cardToBeMadeDefaultId) {
            card.isDefault = 1;
          }
        });
      }
      return Object.assign({}, state, {
        cardBeingRemoved: null,
        cards: updatedCards,
        cardError: ' ',
      });
    default:
      return state;
  }
};
