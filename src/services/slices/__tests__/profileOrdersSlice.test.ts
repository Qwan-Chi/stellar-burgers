import {
  profileOrdersReducer,
  fetchProfileOrders
} from '../profileOrdersSlice';
import { TOrder } from '../../../utils/types';

const initialState = {
  data: [],
  isLoading: false,
  error: null
};

const mockOrders: TOrder[] = [
  {
    _id: '6601a1b797ede0001d0671a1',
    status: 'done',
    name: 'Краторный люминесцентный бургер',
    createdAt: '2024-03-25T12:00:00.000Z',
    updatedAt: '2024-03-25T12:00:00.000Z',
    number: 12345,
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
  },
  {
    _id: '6601a1b797ede0001d0671a2',
    status: 'pending',
    name: 'Марсианский бургер',
    createdAt: '2024-03-25T13:00:00.000Z',
    updatedAt: '2024-03-25T13:00:00.000Z',
    number: 12346,
    ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa0942']
  }
];

describe('profileOrdersSlice', () => {
  it('должен вернуть начальное состояние', () => {
    const state = profileOrdersReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialState);
  });

  describe('fetchProfileOrders', () => {
    it('должен установить isLoading в true при pending', () => {
      const state = profileOrdersReducer(
        initialState,
        fetchProfileOrders.pending('', undefined)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записать данные при fulfilled', () => {
      const state = profileOrdersReducer(
        { ...initialState, isLoading: true },
        fetchProfileOrders.fulfilled(mockOrders, '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });

    it('должен записать ошибку при rejected', () => {
      const errorMessage = 'Не удалось загрузить историю заказов';
      const state = profileOrdersReducer(
        { ...initialState, isLoading: true },
        fetchProfileOrders.rejected(
          new Error(errorMessage),
          '',
          undefined,
          errorMessage
        )
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
