import {
  ADD_PROMOTION,
  ADD_PROMOTION_ACTIVATED,
  ADD_PROMOTION_ACTIVATING,
  ADD_PROMOTION_ADDING,
  ADD_PROMOTION_ERROR,
  ADD_SINGLE_PROMOTION,
  LOG_OUT,
} from '../../actions/types';

const initialState = {
  activePromotions: [],
  // State which keeps track of loading.
  isCheckingPromotion: false,
  isActivatingPromotion: false,
  // State which keeps track of error.
  promotionError: ' ',
};

export const promotionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PROMOTION:
      return {
        activePromotions: action.payload,
        isCheckingPromotion: false,
        promotionError: ' ',
      };
    case ADD_PROMOTION_ACTIVATED:
      const updatedPromotions = state.activePromotions.map((promotion) => {
        if (promotion.promotionRecordId === action.payload) {
          promotion.active = 1;
        }
        return promotion;
      });
      return {
        ...state,
        activePromotions: updatedPromotions,
        isActivatingPromotion: false,
      };
    case ADD_PROMOTION_ACTIVATING:
      return { ...state, isActivatingPromotion: true };
    case ADD_PROMOTION_ADDING:
      return { ...state, isCheckingPromotion: true };
    case ADD_PROMOTION_ERROR:
      return {
        ...state,
        isCheckingPromotion: false,
        isActivatingPromotion: false,
        promotionError: action.payload,
      };
    case ADD_SINGLE_PROMOTION:
      return {
        ...state,
        activePromotions: [action.payload, ...state.activePromotions],
        isActivatingPromotion: false,
        promotionError: ' ',
      };
    case LOG_OUT:
      return Object.assign({}, state, initialState);
    default:
      return state;
  }
};
