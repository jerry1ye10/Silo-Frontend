import {
  ADD_CARD_ERROR,
  ADD_SESSION_ADDING,
  ADD_SESSION_ENDING,
  ADD_SESSION_ERROR,
  ADD_SESSION_HISTORY,
  ADD_SESSION_HISTORY_ADDING,
  ADD_SESSION_HISTORY_ERROR,
  END_SESSION,
  REMOVE_SESSION_ENDING_COMPLETED,
  UPDATE_SESSIONS,
} from '../types';
import minotaur from '../../../api/minotaur';

export const beginHourly = (lockId, promotionRecordId, noPaymentAction, next) => {
  return async (dispatch) => {
    // Make sure that card information is present.
    try {
      dispatch(addSessionAdding());
      await minotaur.post('/hourly_session', {
        lock_id: lockId,
        promotion_record_id: promotionRecordId,
      });
      next();
    } catch (err) {
      if (err.response.status === 400) {
        if (err.response.data === 'NO_CARD') {
          noPaymentAction();
          dispatch({ type: ADD_CARD_ERROR, payload: 'Please add a payment method.' });
        } else if (err.response.data === 'TOGGLE_FAILED') {
          dispatch({ type: ADD_SESSION_ERROR, payload: 'Scan unsuccessful.' });
        }
      } else {
        dispatch({ type: ADD_SESSION_ERROR, payload: 'Could not complete transaction.' });
      }
    }
  };
};

export const beginMembership = (lockId, next, flags = null) => {
  return async (dispatch) => {
    try {
      dispatch(addSessionAdding());
      await minotaur.post('/membership_session', { lock_id: lockId, flags });
      next();
    } catch (err) {
      if (err.response.status === 400) {
        dispatch({ type: ADD_SESSION_ERROR, payload: 'Scan unsuccessful.' });
      } else {
        dispatch({ type: ADD_SESSION_ERROR, payload: 'Could not complete transaction.' });
      }
    }
  };
};

export const beginWeeklyPassWithoutPurchase = (lockId, next) => {
  return async (dispatch) => {
    try {
      dispatch(addSessionAdding());
      await minotaur.post('/weekly_pass_session', { lock_id: lockId });
      next();
    } catch (err) {
      if (err.response.status === 400) {
        dispatch({ type: ADD_SESSION_ERROR, payload: 'Scan unsuccessful.' });
      } else {
        dispatch({ type: ADD_SESSION_ERROR, payload: 'Could not complete transaction.' });
      }
    }
  };
};

export const beginWeeklyPassWithPurchase = (lockId, promotionRecordId, noPaymentAction, next) => {
  // Make sure that card information is present.
  return async (dispatch) => {
    try {
      dispatch(addSessionAdding());
      await minotaur.post('/weekly_passes', { promotion_record_id: promotionRecordId });
      await minotaur.post('/weekly_pass_session', { lock_id: lockId });
      next();
    } catch (err) {
      if (err.response.status === 400) {
        if (err.response.data === 'NO_CARD') {
          noPaymentAction();
          dispatch({ type: ADD_CARD_ERROR, payload: 'Please add a payment method.' });
        } else if (err.response.data === 'TOGGLE_FAILED') {
          dispatch({ type: ADD_SESSION_ERROR, payload: 'Scan unsuccessful.' });
        }
      } else if (err.response.status === 403) {
        dispatch({
          type: ADD_SESSION_ERROR,
          payload: 'Payment unsuccesful. Please update your card.',
        });
      } else {
        dispatch({ type: ADD_SESSION_ERROR, payload: 'Could not complete transaction.' });
      }
    }
  };
};

export const purchaseWeeklyPass = (promotionRecordId, noPaymentAction, next) => {
  // Make sure that card information is present.
  return async (dispatch) => {
    try {
      dispatch(addSessionAdding());
      await minotaur.post('/weekly_passes', { promotion_record_id: promotionRecordId });
      next();
    } catch (err) {
      if (err.response.status === 400) {
        if (err.response.data === 'NO_CARD') {
          noPaymentAction();
          dispatch({ type: ADD_CARD_ERROR, payload: 'Please add a payment method.' });
        } else if (err.response.data === 'TOGGLE_FAILED') {
          dispatch({ type: ADD_SESSION_ERROR, payload: 'Scan unsuccessful.' });
        }
      } else if (err.response.status === 403) {
        dispatch({
          type: ADD_SESSION_ERROR,
          payload: 'Payment unsuccessful. Please update your card.',
        });
      } else {
        dispatch({ type: ADD_SESSION_ERROR, payload: 'Could not complete transaction.' });
      }
    }
  };
};

export const clearSessionError = () => {
  return (dispatch) => {
    dispatch(addSessionError(' '));
  };
};

export const deactivateLock = (user, lockId) => {
  return async (dispatch) => {
    try {
      await minotaur.post('/toggle', { id: lockId, action: 'dismiss', token: user.token });
    } catch (err) {
      dispatch(addSessionError('Could not deactivate lock'));
    }
  };
};

export const finishSession = (user, session) => {
  return async (dispatch) => {
    dispatch(addSessionEnding());
    try {
      await minotaur.post('/toggle', {
        id: session.lockId,
        action: 'prepare_to_lock',
        token: user.token,
        user,
        session,
      });
    } catch (err) {
      if (err.response.status === 403) {
        dispatch(addSessionError('CARD_DECLINED'));
      } else {
        dispatch(addSessionError('Could not end session'));
      }
    }
  };
};

export const getActiveSessions = () => {
  return async (dispatch) => {
    try {
      const sessionsResponse = await minotaur.get('/sessions?active=true');
      dispatch(updateSessions(sessionsResponse.data));
    } catch (err) {
      dispatch(addSessionError('Could not fetch active sessions.'));
    }
  };
};

// Get all previous ended sessions.
export const getSessionHistory = (authToken) => {
  return async (dispatch) => {
    dispatch(addSessionHistoryAdding());
    try {
      const { data } = await minotaur.get('/sessions?active=false');
      dispatch(addSessionHistory(data));
    } catch (err) {
      dispatch(addSessionHistoryError('Could not fetch history.'));
    }
  };
};

export const removeSessionEndingCompleted = () => {
  return { type: REMOVE_SESSION_ENDING_COMPLETED };
};

export const updateSessions = (sessions) => {
  return { type: UPDATE_SESSIONS, payload: sessions };
};

const addSessionAdding = () => {
  return { type: ADD_SESSION_ADDING };
};

const addSessionEnding = () => {
  return { type: ADD_SESSION_ENDING };
};

const addSessionError = (error) => {
  return { type: ADD_SESSION_ERROR, payload: error };
};

const addSessionHistory = (sessionHistory) => {
  return { type: ADD_SESSION_HISTORY, payload: sessionHistory };
};

const addSessionHistoryAdding = () => {
  return { type: ADD_SESSION_HISTORY_ADDING };
};

const addSessionHistoryError = (error) => {
  return { type: ADD_SESSION_HISTORY_ERROR, payload: error };
};

export const endSession = (id) => {
  return { type: END_SESSION, payload: id };
};
