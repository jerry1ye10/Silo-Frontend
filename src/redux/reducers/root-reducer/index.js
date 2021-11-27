import { combineReducers } from 'redux';

import { promotionReducer } from '../promotion-reducer';
import { sessionReducer } from '../session-reducer';
import { userReducer } from '../user-reducer';

export const rootReducer = combineReducers({
  promotions: promotionReducer,
  sessions: sessionReducer,
  user: userReducer,
});
