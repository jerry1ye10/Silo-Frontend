import thunk from 'redux-thunk';
import * as SessionActions from '.';
import * as UserActions from '../user-actions';
import {
  ADD_SESSION,
  ADD_SESSION_ADDING,
  ADD_SESSION_ERROR,
  ADD_CARD_ERROR,
  ADD_DAY_PASS,
} from '../types';
import configureMockStore from 'redux-mock-store';

import minotaur from '../../../api/minotaur';
jest.mock('../../../api/minotaur');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

afterEach(() => {
  jest.resetAllMocks();
});

describe('SessionActions', () => {
  it('beginSession admin', async () => {
    minotaur.post.mockResolvedValue();
    minotaur.post.mockResolvedValue({data: 'test'});
    const response = await SessionActions.beginSession(
      {isAdmin: true, token: 'token'},
      2,
      499,
      null,
      null,
      null,
    );
    expect(response).toEqual('test');
    expect(minotaur.post).toHaveBeenCalledWith(
      '/toggle',
      {id: 2, action: 'unlock', token: 'token'},
      {headers: {Authorization: 'Bearer token'}},
    );
    expect(minotaur.post).toHaveBeenCalledWith(
      '/sessions',
      {
        lock_id: 2,
        location: '262MET',
        card_id: 'admin_card',
        rate: 499,
        promotion_record_id: null,
        day_pass_id: null,
      },
      {headers: {Authorization: 'Bearer token'}},
    );
  });

  it('beginSession not admin', async () => {
    minotaur.post.mockResolvedValue();
    minotaur.post.mockResolvedValue({data: null});
    await SessionActions.beginSession(
      {isAdmin: false, token: 'token'},
      21,
      699,
      null,
      '123.456.789',
      null,
    );
    expect(minotaur.post).toHaveBeenCalledWith(
      '/sessions',
      {
        lock_id: 21,
        location: '262MET',
        card_id: '123.456.789',
        rate: 699,
        promotion_record_id: null,
        day_pass_id: null,
      },
      {headers: {Authorization: 'Bearer token'}},
    );
  });

  it('beginSessionWithoutPayment success', () => {
    const spy = jest.spyOn(SessionActions, 'beginSession');
    spy.mockReturnValue({session: 'placeholder'});
    const expectedActions = [
      {type: ADD_SESSION_ADDING},
      {type: ADD_SESSION, payload: {session: 'placeholder'}},
    ];
    const store = mockStore({});
    const next = jest.fn();
    return store
      .dispatch(
        SessionActions.beginSessionWithoutPayment(
          {token: 'token', dayPass: {id: '123'}},
          3,
          499,
          next,
        ),
      )
      .then(() => {
        expect(spy).toHaveBeenCalled();
        expect(store.getActions()).toEqual(expectedActions);
        expect(next).toHaveBeenCalled();
        spy.mockRestore();
      });
  });

  it('beginSessionWithoutPayment fail', () => {
    const spy = jest.spyOn(SessionActions, 'beginSession');
    spy.mockRejectedValue();
    const expectedActions = [
      {type: ADD_SESSION_ADDING},
      {type: ADD_SESSION_ERROR, payload: 'Could not unlock desk'},
    ];
    const store = mockStore({});
    const next = jest.fn();
    return store
      .dispatch(
        SessionActions.beginSessionWithoutPayment(
          {token: 'token', dayPass: {id: '123'}},
          3,
          499,
          next,
        ),
      )
      .then(() => {
        expect(spy).toHaveBeenCalled();
        expect(store.getActions()).toEqual(expectedActions);
        expect(next).not.toHaveBeenCalled();
        spy.mockRestore();
      });
  });

  it('clearSessionError', () => {
    const expectedActions = [{type: ADD_SESSION_ERROR, payload: ' '}];
    const store = mockStore({});
    store.dispatch(SessionActions.clearSessionError());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('checkPaymentAndBeginSession no payment', () => {
    const store = mockStore({});
    const spy = jest.spyOn(SessionActions, 'beginSession');
    const noPaymentAction = jest.fn();
    const next = jest.fn();
    const expectedActions = [
      {type: ADD_CARD_ERROR, payload: 'Please add a payment method'},
    ];
    return store
      .dispatch(
        SessionActions.checkPaymentAndBeginSession(
          {isAdmin: false, cards: []},
          4,
          499,
          null,
          noPaymentAction,
          next,
        ),
      )
      .then(() => {
        expect(noPaymentAction).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
        expect(store.getActions()).toEqual(expectedActions);
        spy.mockRestore();
      });
  });

  it('checkPaymentAndBeginSession success', () => {
    const store = mockStore({});
    const spy = jest.spyOn(SessionActions, 'beginSession');
    spy.mockReturnValue({session: 'placeholder'});
    const noPaymentAction = jest.fn();
    const next = jest.fn();
    const expectedActions = [
      {type: ADD_SESSION_ADDING},
      {type: ADD_SESSION, payload: {session: 'placeholder'}},
    ];
    return store
      .dispatch(
        SessionActions.checkPaymentAndBeginSession(
          {isAdmin: false, cards: [{isDefault: true}]},
          4,
          499,
          null,
          noPaymentAction,
          next,
        ),
      )
      .then(() => {
        expect(noPaymentAction).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(store.getActions()).toEqual(expectedActions);
        spy.mockRestore();
      });
  });

  it('checkPaymentAndBeginSession failure', () => {
    const store = mockStore({});
    const spy = jest.spyOn(SessionActions, 'beginSession');
    spy.mockRejectedValue();
    const noPaymentAction = jest.fn();
    const next = jest.fn();
    const expectedActions = [
      {type: ADD_SESSION_ADDING},
      {type: ADD_SESSION_ERROR, payload: 'Could not unlock desk'},
    ];
    return store
      .dispatch(
        SessionActions.checkPaymentAndBeginSession(
          {isAdmin: false, cards: [{isDefault: true}]},
          4,
          499,
          null,
          noPaymentAction,
          next,
        ),
      )
      .then(() => {
        expect(noPaymentAction).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalledWith();
        expect(spy).toHaveBeenCalled();
        expect(store.getActions()).toEqual(expectedActions);
        spy.mockRestore();
      });
  });

  it('deactivateLock success', () => {
    minotaur.post.mockResolvedValue();
    const store = mockStore({});
    return store
      .dispatch(SessionActions.deactivateLock({token: 'token'}, 3))
      .then(() => {
        expect(minotaur.post).toHaveBeenCalledWith(
          '/toggle',
          {id: 3, action: 'dismiss', token: 'token'},
          {headers: {Authorization: 'Bearer token'}},
        );
        expect(store.getActions()).toEqual([]);
      });
  });

  it('deactivateLock failure', () => {
    minotaur.post.mockRejectedValue();
    const expectedActions = [
      {type: ADD_SESSION_ERROR, payload: 'Could not deactivate lock'},
    ];
    const store = mockStore({});
    return store
      .dispatch(SessionActions.deactivateLock({token: 'TOKEN'}, 6))
      .then(() => {
        expect(minotaur.post).toHaveBeenCalledWith(
          '/toggle',
          {id: 6, action: 'dismiss', token: 'TOKEN'},
          {headers: {Authorization: 'Bearer TOKEN'}},
        );
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('updateSessions', async () => {
    minotaur.put.mockResolvedValue({data: 'test'});
    const response = await SessionActions.updateSession(
      {isAdmin: false, stripeId: 'stripe3', token: 'token'},
      '12345',
      'sometime',
      499,
      'stripe4',
      'card2',
      null,
      null,
      false,
      '14231',
    );
    expect(response).toEqual('test');
    expect(minotaur.put).toHaveBeenCalledWith(
      '/sessions',
      {
        id: '12345',
        time_created: 'sometime',
        rate: 499,
        stripe_id: 'stripe4',
        card_id: 'card2',
        remaining_value: null,
        promotion_value: null,
        is_admin: false,
        day_pass_id: '14231',
      },
      {headers: {Authorization: 'Bearer token'}},
    );
  });

  it('getPaymentMethod success', () => {
    const store = mockStore({});
    const noPaymentAction = jest.fn();
    const card = store.dispatch(
      SessionActions.getPaymentMethod(
        {isAdmin: false, cards: [{isDefault: true}]},
        noPaymentAction,
      ),
    );
    expect(card).toBeTruthy();
    expect(noPaymentAction).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });

  it('getPaymentMethod admin', () => {
    const store = mockStore({});
    const noPaymentAction = jest.fn();
    const card = store.dispatch(
      SessionActions.getPaymentMethod(
        {isAdmin: true, cards: []},
        noPaymentAction,
      ),
    );
    expect(card).toBeFalsy();
    expect(noPaymentAction).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });

  it('getPaymentMethod failure', () => {
    const store = mockStore({});
    const noPaymentAction = jest.fn();
    const card = store.dispatch(
      SessionActions.getPaymentMethod(
        {isAdmin: false, cards: []},
        noPaymentAction,
      ),
    );
    const expectedActions = [
      {type: ADD_CARD_ERROR, payload: 'Please add a payment method'},
    ];
    expect(card).toBeFalsy();
    expect(noPaymentAction).toHaveBeenCalled();
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('purchaseDayPassAndBeginSession no payment', () => {
    const store = mockStore({});
    const spy = jest.spyOn(SessionActions, 'beginSession');
    const noPaymentAction = jest.fn();
    const next = jest.fn();
    const expectedActions = [
      {type: ADD_CARD_ERROR, payload: 'Please add a payment method'},
    ];
    return store
      .dispatch(
        SessionActions.purchaseDayPassAndBeginSession(
          {isAdmin: false, cards: []},
          4,
          499,
          1999,
          noPaymentAction,
          next,
        ),
      )
      .then(() => {
        expect(noPaymentAction).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
        expect(store.getActions()).toEqual(expectedActions);
        spy.mockRestore();
      });
  });

  it('purchaseDayPassAndBeginSession success', () => {
    const store = mockStore({});
    const purchaseDayPassSpy = jest.spyOn(UserActions, 'purchaseDayPass');
    purchaseDayPassSpy.mockReturnValue({dayPass: 'data'});
    const beginSessionSpy = jest.spyOn(SessionActions, 'beginSession');
    beginSessionSpy.mockReturnValue({session: 'placeholder'});
    const noPaymentAction = jest.fn();
    const next = jest.fn();
    const expectedActions = [
      {type: ADD_SESSION_ADDING},
      {type: ADD_DAY_PASS, payload: {dayPass: 'data'}},
      {type: ADD_SESSION, payload: {session: 'placeholder'}},
    ];
    return store
      .dispatch(
        SessionActions.purchaseDayPassAndBeginSession(
          {isAdmin: false, cards: [{isDefault: true}]},
          4,
          499,
          1999,
          noPaymentAction,
          next,
        ),
      )
      .then(() => {
        expect(noPaymentAction).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        expect(purchaseDayPassSpy).toHaveBeenCalled();
        expect(beginSessionSpy).toHaveBeenCalled();
        expect(store.getActions()).toEqual(expectedActions);
        purchaseDayPassSpy.mockRestore();
        beginSessionSpy.mockRestore();
      });
  });

  it('purchaseDayPassAndBeginSession failure', () => {
    const store = mockStore({});
    const spy = jest.spyOn(UserActions, 'purchaseDayPass');
    spy.mockRejectedValue();
    const noPaymentAction = jest.fn();
    const next = jest.fn();
    const expectedActions = [
      {type: ADD_SESSION_ADDING},
      {
        type: ADD_SESSION_ERROR,
        payload: 'Could not purchase day pass or unlock lock',
      },
    ];
    return store
      .dispatch(
        SessionActions.purchaseDayPassAndBeginSession(
          {isAdmin: false, cards: [{isDefault: true}]},
          4,
          499,
          1999,
          noPaymentAction,
          next,
        ),
      )
      .then(() => {
        expect(noPaymentAction).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(store.getActions()).toEqual(expectedActions);
        spy.mockRestore();
      });
  });
});
