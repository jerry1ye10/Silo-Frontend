import {
  ADD_PROMOTION,
  ADD_PROMOTION_ACTIVATED,
  ADD_PROMOTION_ACTIVATING,
  ADD_PROMOTION_ADDING,
  ADD_PROMOTION_ERROR,
  ADD_SINGLE_PROMOTION,
} from '../types';
import minotaur from '../../../api/minotaur';

export const checkPromotion = (authToken, codename) => {
  return async (dispatch) => {
    dispatch(addPromotionActivating());
    try {
      const response = await minotaur.get(`/promotions/${codename}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      dispatch(addSinglePromotion(response.data));
    } catch (err) {
      if (err.response) {
        dispatch(addPromotionError(err.response.data.message));
      }
    }
  };
};

export const activatePromotion = (authToken, promotionRecordId) => {
  return async (dispatch) => {
    dispatch(addPromotionActivating());
    try {
      await minotaur.put(
        `/promotion-records/${promotionRecordId}`,
        { active: true },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      dispatch(addPromotionActivated(promotionRecordId));
    } catch (err) {
      dispatch(addPromotionError('Server error'));
    }
  };
};

export const getRelevantPromotions = (authToken) => {
  return async (dispatch) => {
    dispatch(addPromotionAdding());
    try {
      const response = await minotaur.get('/promotion-records', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      dispatch(addPromotion(response.data));
    } catch (err) {
      dispatch(addPromotionError('Server error'));
    }
  };
};

const addPromotion = (promotionInfo) => {
  return { type: ADD_PROMOTION, payload: promotionInfo };
};

const addPromotionActivated = (promotionId) => {
  return { type: ADD_PROMOTION_ACTIVATED, payload: promotionId };
};

const addPromotionActivating = () => {
  return { type: ADD_PROMOTION_ACTIVATING };
};

const addPromotionAdding = () => {
  return { type: ADD_PROMOTION_ADDING };
};

export const addPromotionError = (error) => {
  return { type: ADD_PROMOTION_ERROR, payload: error };
};

const addSinglePromotion = (promotionInfo) => {
  return { type: ADD_SINGLE_PROMOTION, payload: promotionInfo };
};
