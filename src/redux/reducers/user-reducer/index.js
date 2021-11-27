import {
  ADD_CARD,
  ADD_CARDS,
  ADD_CARD_ADDING,
  ADD_CARD_ERROR,
  ADD_CARD_REMOVING,
  ADD_CARD_SELECTING,
  ADD_DAY_PASS,
  ADD_DAY_PASS_ADDING,
  ADD_DAY_PASS_ERROR,
  ADD_DEVICE_TOKEN,
  ADD_DEVICE_TOKEN_ADDING,
  ADD_DEVICE_TOKEN_ENDING,
  ADD_MEMBERSHIP,
  ADD_MEMBERSHIP_ADDING,
  ADD_MEMBERSHIP_ERROR,
  ADD_STRIPE_ID_WITH_CARD,
  ADD_USER,
  ADD_USER_ERROR,
  ADD_USER_NAME_CHANGING,
  ADD_USER_SIGNING_IN,
  CHANGE_MEMBERSHIP_RENEWAL,
  CHANGE_USER_NAME,
  LOG_OUT,
  REMOVE_CARD,
  REMOVE_DAY_PASS,
  REMOVE_MEMBERSHIP,
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
  dayPass: { status: 'NO_PASS' },
  membership: { status: 'NO_MEMBERSHIP' },
  // State which keeps track of loading.
  isSigningIn: false,
  isAddingCard: false,
  cardBeingRemoved: null,
  cardBeingSelected: null,
  isChangingName: false,
  isAddingDayPass: false,
  isAddingMembership: false,
  isAddingDeviceToken: false,
  // State which keeps track of errors.
  userError: ' ',
  cardError: ' ',
  dayPassError: ' ',
  membershipError: ' ',
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
    case ADD_DAY_PASS:
      return {
        ...state,
        dayPass: action.payload,
        isAddingDayPass: false,
        dayPassError: ' ',
      };
    case ADD_DAY_PASS_ADDING:
      return { ...state, isAddingDayPass: true };
    case ADD_DAY_PASS_ERROR:
      return { ...state, isAddingDayPass: false, dayPassError: action.payload };
    case ADD_DEVICE_TOKEN:
      return Object.assign({}, state, {
        deviceToken: action.payload,
        isAddingDeviceToken: false,
      });
    case ADD_DEVICE_TOKEN_ADDING:
      return Object.assign({}, state, { isAddingDeviceToken: true });
    case ADD_DEVICE_TOKEN_ENDING:
      return Object.assign({}, state, { isAddingDeviceToken: false });
    case ADD_MEMBERSHIP: {
      return {
        ...state,
        membership: action.payload,
        isAddingMembership: false,
        membershipError: ' ',
      };
    }
    case ADD_MEMBERSHIP_ADDING:
      return { ...state, isAddingMembership: true };
    case ADD_MEMBERSHIP_ERROR:
      return { ...state, isAddingMembership: false, membershipError: action.payload };
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
    case CHANGE_MEMBERSHIP_RENEWAL:
      return { ...state, membership: { ...state.membership, shouldRenew: action.payload } };
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
    case REMOVE_DAY_PASS:
      return { ...state, dayPass: initialState.dayPass };
    case REMOVE_MEMBERSHIP:
      return { ...state, membership: initialState.membership };
    default:
      return state;
  }
};
