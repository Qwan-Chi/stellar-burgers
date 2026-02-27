import { rootReducer } from '../rootReducer';

describe('rootReducer', () => {
  it('должен правильно инициализироваться с начальным состоянием', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('profileOrders');
    expect(state).toHaveProperty('order');
  });

  it('должен содержать корректные начальные значения для ingredients', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state.ingredients).toEqual({
      data: [],
      isLoading: false,
      error: null
    });
  });

  it('должен содержать корректные начальные значения для auth', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state.auth).toEqual({
      data: null,
      isLoading: false,
      error: null,
      isAuthChecked: false
    });
  });

  it('должен содержать корректные начальные значения для burgerConstructor', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('должен содержать корректные начальные значения для feed', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state.feed).toEqual({
      data: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
  });

  it('должен содержать корректные начальные значения для profileOrders', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state.profileOrders).toEqual({
      data: [],
      isLoading: false,
      error: null
    });
  });

  it('должен содержать корректные начальные значения для order', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state.order).toEqual({
      data: null,
      isLoading: false,
      error: null,
      orderRequest: false,
      orderModalData: null
    });
  });
});
