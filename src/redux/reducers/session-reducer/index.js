import {
  ADD_SESSION,
  ADD_SESSION_ADDING,
  ADD_SESSION_ENDING,
  ADD_SESSION_ERROR,
  ADD_SESSION_HISTORY,
  ADD_SESSION_HISTORY_ADDING,
  ADD_SESSION_HISTORY_ERROR,
  ADD_USER,
  END_SESSION,
  LOG_OUT,
  REMOVE_SESSION_ENDING_COMPLETED,
  UPDATE_SESSIONS,
} from '../../actions/types';

const initialState = {
  activeSessions: [],
  sessionHistory: [],
  // State which keeps track of loading.
  isAddingSession: false,
  isAddingSessionHistory: false,
  isEndingSession: false,
  sessionEndingCompleted: false,
  // State which keeps track of errors.
  sessionError: ' ',
  sessionHistoryError: ' ',
};

export const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SESSION:
      return Object.assign({}, state, {
        activeSessions: [action.payload, ...state.activeSessions],
        isAddingSession: false,
        sessionError: ' ',
      });
    case ADD_SESSION_ADDING:
      return Object.assign({}, state, { isAddingSession: true });
    case ADD_SESSION_ENDING:
      return Object.assign({}, state, { isEndingSession: true });
    case ADD_SESSION_ERROR:
      return Object.assign({}, state, {
        sessionError: action.payload,
        isAddingSession: false,
        isEndingSession: false,
        sessionEndingCompleted: false,
      });
    case ADD_SESSION_HISTORY:
      return Object.assign({}, state, {
        isAddingSessionHistory: false,
        sessionHistory: action.payload,
        sessionHistoryError: ' ',
      });
    case ADD_SESSION_HISTORY_ADDING:
      return Object.assign({}, state, {
        isAddingSessionHistory: true,
      });
    case ADD_SESSION_HISTORY_ERROR:
      return Object.assign({}, state, {
        isAddingSessionHistory: false,
        sessionHistoryError: action.payload,
      });
    case ADD_USER:
      return Object.assign({}, state, {
        activeSessions: action.payload.sessions,
      });
    case END_SESSION:
      const updatedSessions = state.activeSessions.filter(
        (session) => session.id !== action.payload,
      );
      return Object.assign({}, state, {
        activeSessions: updatedSessions,
        isEndingSession: false,
        sessionEndingCompleted: true,
      });
    case LOG_OUT:
      return Object.assign({}, state, initialState);
    case REMOVE_SESSION_ENDING_COMPLETED:
      return Object.assign({}, state, {
        sessionEndingCompleted: false,
      });
    case UPDATE_SESSIONS:
      return Object.assign({}, state, {
        activeSessions: action.payload,
        isAddingSession: false,
        isEndingSession: false,
        sessionError: ' ',
      });
    default:
      return state;
  }
};
